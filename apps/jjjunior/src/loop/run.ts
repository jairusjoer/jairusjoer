import { config } from '../config/config.ts';
import { branchName, hasCommits, prepareWorktree } from '../git/workspace.ts';
import { comment, getNotes } from '../gitlab/issues.ts';
import { ensureMergeRequest, getMergeRequestNotes } from '../gitlab/merge-requests.ts';
import { getProject } from '../gitlab/projects.ts';
import { type Issue } from '../gitlab/types.ts';
import { log, logError } from '../lib/log.ts';
import { cost, record, tokens, type Call, type Outcome } from '../lib/stats.ts';
import { implement } from './implement.ts';
import { implementPrompt, issueContext } from './prompts.ts';
import { reviewRound } from './review.ts';
import { failed, keyOf, moveTo } from './state.ts';
import type { Mode, Run } from './types.ts';

const { todo, doing, review } = config.status;

export const work = async (issue: Issue, mode: Mode, signal: AbortSignal) => {
  const started = Date.now();
  const calls: Call[] = [];
  let outcome: Outcome;
  try {
    outcome = signal.aborted ? 'aborted' : await runLoop(issue, mode, signal, calls);
  } catch (error) {
    outcome = signal.aborted ? 'aborted' : 'failed';
    await handleFailure(issue, error, signal);
  }
  const durationMs = Date.now() - started;
  try {
    record({
      at: new Date().toISOString(),
      project: issue.project,
      iid: issue.iid,
      mode,
      model: config.model,
      outcome,
      durationMs,
      calls,
    });
  } catch (e) {
    logError('FAIL', e, issue);
  }
  log(
    'STATS',
    `${outcome} · ${Math.round(tokens(calls) / 1000)}k tokens · $${cost(calls).toFixed(2)} · ${(durationMs / 60_000).toFixed(1)} min`,
    issue,
  );
};

const runLoop = async (issue: Issue, mode: Mode, signal: AbortSignal, calls: Call[]): Promise<Outcome> => {
  log('START', mode, issue);
  if (mode === 'implement') {
    await moveTo(issue, doing);
    await comment(issue, '🤖 Picked up by Claude Code — implementing.');
  } else {
    await comment(issue, '🤖 Moved to review — starting adversarial review by Claude Code.');
  }

  const project = await getProject(issue.project);
  const dir = await prepareWorktree(project, issue);
  const notes = [...(await getNotes(issue)), ...(await getMergeRequestNotes(project, branchName(issue)))];
  const context = issueContext(issue, notes);

  if (mode === 'review' && !(await hasCommits(dir, project))) {
    await comment(
      issue,
      `⚠️ Nothing to review: branch \`${branchName(issue)}\` has no commits ahead of \`${project.default_branch}\`.`,
    );
    return 'no-commits';
  }

  const run: Run = {
    issue,
    project,
    dir,
    context,
    signal,
    prompt: implementPrompt(context, project),
    summary: '(review triggered by a manual move; no implementer summary)',
    mrUrl: '',
    calls,
  };

  for (let round = 1; round <= config.maxRounds; round++) {
    if (mode === 'review' && round === 1) {
      run.mrUrl = await ensureMergeRequest(issue, project, branchName(issue));
    } else {
      const result = await implement(run, round);
      if (result !== 'ok') return result;
    }
    const outcome = await reviewRound(run, round);
    if (outcome) return outcome;
  }
  return 'rounds-exhausted';
};

const handleFailure = async (issue: Issue, error: unknown, signal: AbortSignal) => {
  if (signal.aborted) {
    // abort() already logged the reason.
    await comment(issue, '⏹️ Claude Code run aborted because the issue left the workflow.').catch(() => {});
    return;
  }
  const message = error instanceof Error ? error.message : String(error);
  logError('FAIL', error, issue);
  await comment(
    issue,
    `❌ **Claude Code run failed**\n\n\`\`\`\n${message}\n\`\`\`\n\n_Move the issue back to **${todo}** to retry._`,
  ).catch(() => {});
  await moveTo(issue, review).catch(() => failed.add(keyOf(issue)));
};
