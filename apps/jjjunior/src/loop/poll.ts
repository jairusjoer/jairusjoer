import { config } from '../config/config.ts';
import { removeWorktree } from '../git/workspace.ts';
import { isClosed, listIssues } from '../gitlab/issues.ts';
import { getProject } from '../gitlab/projects.ts';
import { type Issue } from '../gitlab/types.ts';
import { log, logError } from '../lib/log.ts';
import { work } from './run.ts';
import { acquire, failed, keyOf, ourMoves, release, running, seen } from './state.ts';
import type { Mode } from './types.ts';

const { todo, doing, review } = config.status;

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
