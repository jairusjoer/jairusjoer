import { config } from '../config/config.ts';
import { branchName, hasCommits, prepareWorktree } from '../git/workspace.ts';
import { comment, getNotes } from '../gitlab/issues.ts';
import { ensureMergeRequest, getMergeRequestNotes } from '../gitlab/merge-requests.ts';
import { getProject } from '../gitlab/projects.ts';
import { type Issue } from '../gitlab/types.ts';
import { log, logError } from '../lib/log.ts';
import { implement } from './implement.ts';
import { implementPrompt, issueContext } from './prompts.ts';
import { reviewRound } from './review.ts';
import { failed, keyOf, moveTo } from './state.ts';
import type { Mode, Run } from './types.ts';

const { todo, doing, review } = config.status;

export const work = async (issue: Issue, mode: Mode, signal: AbortSignal) => {
  try {
    if (!signal.aborted) await runLoop(issue, mode, signal);
  } catch (error) {
    await handleFailure(issue, error, signal);
  }
};

const runLoop = async (issue: Issue, mode: Mode, signal: AbortSignal) => {
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
    return comment(
      issue,
      `⚠️ Nothing to review: branch \`${branchName(issue)}\` has no commits ahead of \`${project.default_branch}\`.`,
    );
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
  };

  for (let round = 1; round <= config.maxRounds; round++) {
    if (mode === 'review' && round === 1) {
      run.mrUrl = await ensureMergeRequest(issue, project, branchName(issue));
    } else if (!(await implement(run, round))) {
      return;
    }
    if (await reviewRound(run, round)) return;
  }
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
