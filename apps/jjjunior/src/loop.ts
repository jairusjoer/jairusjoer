import { setTimeout as sleep } from 'node:timers/promises';
import { styleText } from 'node:util';
import { implementationSchema, reviewSchema, runAgent, type Implementation, type Review } from './agent.ts';
import { config } from './config.ts';
import {
  comment,
  ensureMergeRequest,
  failedJobLogs,
  getMergeRequestNotes,
  getNotes,
  getProject,
  isClosed,
  isPending,
  listIssues,
  pipelinesFor,
  setStatus,
  type Issue,
  type Note,
  type Project,
} from './gitlab.ts';
import { log, logError } from './log.ts';
import { branchName, hasCommits, headSha, prepareWorktree, push, removeWorktree } from './workspace.ts';

const { todo, doing, review } = config.status;
type Mode = 'implement' | 'review';

const running = new Map<string, { controller: AbortController; done: Promise<void> }>();
/** Last status seen per issue, used to detect moves into "In Review". */
const seen = new Map<string, { issue: Issue; status: string | null }>();
/** When we last changed an issue's status; poll results older than that are stale for it. */
const ourMoves = new Map<string, number>();

/** Issues whose failure could not be recorded on the board; not retried until their status changes. */
const failed = new Set<string>();

const keyOf = (issue: Issue) => `${issue.project}#${issue.iid}`;

const moveTo = async (issue: Issue, status: string) => {
  await setStatus(issue, status);
  ourMoves.set(keyOf(issue), Date.now());
  seen.set(keyOf(issue), { issue, status });
};

// --- concurrency limit -------------------------------------------------------
let slots = config.maxParallel;
const waiting: (() => void)[] = [];
const acquire = () => (slots > 0 ? (slots--, Promise.resolve()) : new Promise<void>((r) => waiting.push(r)));
const release = () => (waiting.length ? waiting.shift()!() : slots++);

// --- polling -----------------------------------------------------------------
/**
 * One poll of the board. Rules:
 * - in "To do"                          → start implement ⇄ review loop
 * - moved into "In Review" by a human   → start adversarial review (may loop back)
 * - left the flow while an agent works  → abort (closed, unassigned, label removed, other status)
 * - closed                              → remove its worktree
 */
export const poll = async (firstPoll: boolean) => {
  const startedAt = Date.now();
  const issues = await listIssues();
  const present = new Set<string>();
  const isStale = (key: string) => (ourMoves.get(key) ?? 0) > startedAt; // we changed it mid-poll

  for (const issue of issues) {
    present.add(keyOf(issue));
    if (!isStale(keyOf(issue))) handleIssue(issue, firstPoll);
  }

  for (const [key, { issue }] of seen) {
    if (!present.has(key) && !isStale(key)) await handleGone(key, issue);
  }
};

const handleIssue = (issue: Issue, firstPoll: boolean) => {
  const key = keyOf(issue);
  const previous = seen.get(key);
  seen.set(key, { issue, status: issue.status });
  const active = running.get(key);
  if (issue.status !== todo) failed.delete(key);

  if (active) {
    if (![todo, doing, review].includes(issue.status ?? '')) abort(issue, active, `status is "${issue.status}"`);
  } else if (issue.status === todo) {
    if (!failed.has(key)) start(issue, 'implement');
  } else if (issue.status === review && !firstPoll && previous && previous.status !== review) {
    start(issue, 'review');
  }
};

const handleGone = async (key: string, issue: Issue) => {
  seen.delete(key);
  failed.delete(key);
  const active = running.get(key);
  if (active) abort(issue, active, 'issue left the board query (closed, unassigned, label or iteration removed)');
  if (!(await isClosed(issue).catch(() => false))) return;
  await active?.done;
  try {
    await removeWorktree(await getProject(issue.project), issue);
    log('CLEANUP', 'closed, worktree removed', issue);
  } catch (e) {
    logError('FAIL', e, issue);
  }
};

const abort = (issue: Issue, active: { controller: AbortController }, reason: string) => {
  if (active.controller.signal.aborted) return;
  log('ABORT', reason, issue);
  active.controller.abort();
};

const start = (issue: Issue, mode: Mode) => {
  const key = keyOf(issue);
  const controller = new AbortController();
  const done = (async () => {
    await acquire();
    try {
      await work(issue, mode, controller.signal);
    } finally {
      release();
      running.delete(key);
    }
  })();
  running.set(key, { controller, done });
};

// --- the implement ⇄ review loop ---------------------------------------------
type Run = {
  issue: Issue;
  project: Project;
  dir: string;
  context: string;
  signal: AbortSignal;
  prompt: string;
  session?: string;
  summary: string;
  mrUrl: string;
};

const work = async (issue: Issue, mode: Mode, signal: AbortSignal) => {
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

/** Hand the issue to a human: comment and move it to "In Review". */
const stop = async (issue: Issue, message: string) => {
  await comment(issue, message);
  await moveTo(issue, review);
};

/** implement → push → CI; failed CI goes straight back to the implementer. Returns false if the run stopped. */
const implement = async (run: Run, round: number) => {
  const { issue, project, dir } = run;
  for (let attempt = 1; ; attempt++) {
    const ciFix = attempt > 1 ? ` · CI fix ${attempt - 1}` : '';
    log('IMPLEMENT', `round ${round}${ciFix}`, issue);
    const impl = await runAgent<Implementation>({
      cwd: dir,
      prompt: run.prompt,
      schema: implementationSchema,
      systemPrompt: IMPLEMENTER,
      resume: run.session,
      signal: run.signal,
    });
    run.session = impl.sessionId;
    run.summary = impl.output.summary;

    if (impl.output.status === 'blocked') {
      await stop(
        issue,
        `❓ **Claude Code needs input** before continuing:\n\n${impl.output.question ?? run.summary}\n\n_Answer in a comment and move the issue back to **${todo}** to resume._`,
      );
      return false;
    }
    if (!(await hasCommits(dir, project))) {
      await stop(issue, `⚠️ The agent reported done but produced no commits.\n\n${run.summary}`);
      return false;
    }
    await push(dir, issue);
    run.mrUrl = await ensureMergeRequest(issue, project, branchName(issue));

    const ci = await waitForPipelines(issue, project, await headSha(dir), run.signal);
    if (ci.status !== 'failed') {
      await moveTo(issue, review);
      return true;
    }
    if (attempt >= config.maxRounds) {
      await stop(
        issue,
        `⚠️ CI still failing after ${attempt} attempts — needs a human.\n\n${ci.urls}\n\nMerge request: ${run.mrUrl}`,
      );
      return false;
    }
    await comment(
      issue,
      `🔧 **CI failed** (attempt ${attempt}/${config.maxRounds}) — feeding the job logs back to the implementer.\n\n${ci.urls}`,
    );
    run.prompt = `The CI pipeline failed for your last commit. Failed job logs (tail):\n\n${ci.logs}\n\nFind the root cause and fix it. Reproduce locally where possible. Do not skip, disable or weaken tests or CI jobs to make them pass. If the failure is unrelated to your change (flaky test, infrastructure, missing secret), report status "blocked" and explain. Commit and report again.`;
  }
};

/** One adversarial review. Returns true when the loop is finished (approved or out of rounds). */
const reviewRound = async (run: Run, round: number) => {
  const { issue, project, context } = run;
  log('REVIEW', `round ${round}`, issue);
  const rev = await runAgent<Review>({
    cwd: run.dir,
    prompt: reviewPrompt(context, project, run.summary),
    schema: reviewSchema,
    systemPrompt: REVIEWER,
    readOnly: true,
    signal: run.signal,
  });

  if (rev.output.approved) {
    log('DONE', 'approved', issue);
    await comment(
      issue,
      `✅ Loop completed\n\nMerge request: ${run.mrUrl}\n\n**Summary**\n\n${run.summary}\n\n**Reviewer verification**\n\n${rev.output.verification}\n\n_Ready for human review._`,
    );
    return true;
  }

  await comment(
    issue,
    `🔁 **Review round ${round}/${config.maxRounds}: changes requested**\n\n${rev.output.findings}\n\n**Reviewer verification**\n\n${rev.output.verification}`,
  );
  if (round === config.maxRounds) {
    await comment(
      issue,
      `⚠️ Stopped after ${config.maxRounds} rounds without approval — needs a human decision.\n\nMerge request: ${run.mrUrl}`,
    );
    return true;
  }

  await moveTo(issue, doing);
  run.prompt = run.session
    ? `An adversarial reviewer rejected your implementation. Findings:\n\n${rev.output.findings}\n\nAddress every finding (or explain in your summary why one is invalid), commit, and report again.`
    : `${implementPrompt(context, project)}\n\nAn adversarial reviewer rejected the current state of this branch. Findings:\n\n${rev.output.findings}\n\nAddress every finding (or explain in your summary why one is invalid).`;
  return false;
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

// --- CI gate -----------------------------------------------------------------
/** Wait until every pipeline for the commit has finished. No pipeline within 3 minutes means "no CI". */
const waitForPipelines = async (issue: Issue, project: Project, sha: string, signal: AbortSignal) => {
  const started = Date.now();
  log('CI', `waiting on ${styleText('yellow', sha.slice(0, 8))}`, issue);
  for (;;) {
    const pipelines = await pipelinesFor(project.id, sha);
    const elapsed = Date.now() - started;
    if (!pipelines.length && elapsed > 3 * 60_000) return { status: 'none' as const, logs: '', urls: '' };
    if (pipelines.length && !pipelines.some(isPending)) {
      const urls = pipelines.map((p) => `- ${p.status}: ${p.web_url}`).join('\n');
      if (!pipelines.some((p) => p.status === 'failed')) return { status: 'success' as const, logs: '', urls };
      return { status: 'failed' as const, logs: await failedJobLogs(project.id, pipelines), urls };
    }
    if (elapsed > config.pipelineTimeoutMs) {
      throw new Error(`CI did not finish within ${config.pipelineTimeoutMs / 60_000} min for ${sha}`);
    }
    await sleep(20_000, undefined, { signal });
  }
};

// --- prompts -----------------------------------------------------------------
const IMPLEMENTER = `You are an autonomous engineer implementing a GitLab issue in a dedicated git worktree.
- Follow the repository's conventions (read CLAUDE.md/README/CONTRIBUTING if present). Prefer simple, minimal changes.
- Verify your work: run the relevant tests, linters and type checks. Add tests for new behaviour.
- Make sure the project's CI checks would pass (run the same commands CI runs, see .gitlab-ci.yml).
- Commit your work on the current branch with clear messages. Do NOT push, do NOT create merge requests, do NOT change the issue status — the orchestrator does that.
- If requirements are ambiguous or contradictory such that you would have to guess at product decisions, stop and report status "blocked" with a precise question instead of guessing.`;

const REVIEWER = `You are an adversarial code reviewer. Your job is to find reasons this change should NOT ship.
- You must NOT modify files, commit, or push. Read, run tests, and inspect only.
- Check: does it fully satisfy the issue and any human comments? Correctness and edge cases, regressions, missing or weak tests, security, scope creep, needless complexity.
- Before deciding, you MUST run the test suite, type check and linter yourself (install dependencies if needed) and report the exact commands and results. Never trust the implementer's summary. If you could not run them, do not approve.
- Approve only if there are no blocking issues. Nitpicks and style preferences are not blocking — omit them.
- If rejecting, list each blocking finding concretely (file, line, what is wrong, what is expected).`;

/** Issue description plus issue comments and unresolved MR review comments, merged chronologically. */
const issueContext = (issue: Issue, notes: Note[]) => {
  const discussion = notes
    .toSorted((a, b) => a.created_at.localeCompare(b.created_at))
    .map((n) => `**@${n.author.username}** (${[n.created_at, n.where].filter(Boolean).join(', ')}):\n${n.body}`)
    .join('\n\n---\n\n');
  return `# Issue #${issue.iid}: ${issue.title}\n${issue.webUrl}\n\n${issue.description || '(no description)'}\n\n## Discussion (oldest first; issue comments and unresolved merge request review comments; later human comments override earlier requirements)\n\n${discussion || '(none)'}`;
};

const implementPrompt = (context: string, project: Project) =>
  `${context}\n\n---\n\nImplement this issue in ${project.path_with_namespace}. If this branch already contains earlier work, build on it and address the latest feedback in the discussion.`;

const reviewPrompt = (context: string, project: Project, summary: string) =>
  `${context}\n\n---\n\nReview the changes on the current branch: \`git diff origin/${project.default_branch}...HEAD\`.\n\nImplementer's summary (do not trust blindly):\n\n${summary}`;
