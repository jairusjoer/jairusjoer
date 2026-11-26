import { Effect, Fiber } from 'effect';
import { AppConfig } from '../config/config.ts';
import { removeWorktree } from '../git/workspace.ts';
import { isClosed, listIssues } from '../gitlab/issues.ts';
import { getProject } from '../gitlab/projects.ts';
import type { Issue } from '../gitlab/types.ts';
import { log, logError } from '../lib/log.ts';
import { work } from './run.ts';
import { keyOf, State, type Mode } from './state.ts';

/**
 * One poll of the board. Rules:
 * - in "To do"                          → start implement ⇄ review loop
 * - moved into "In Review" by a human   → start adversarial review (may loop back)
 * - left the flow while an agent works  → abort (closed, unassigned, label removed, other status)
 * - closed                              → remove its worktree
 */
export const poll = (firstPoll: boolean) =>
  Effect.gen(function* () {
    const { seen, ourMoves } = yield* State;
    const startedAt = Date.now();
    const issues = yield* listIssues;
    const present = new Set<string>();
    const isStale = (key: string) => (ourMoves.get(key) ?? 0) > startedAt; // we changed it mid-poll

    for (const issue of issues) {
      present.add(keyOf(issue));
      if (!isStale(keyOf(issue))) yield* handleIssue(issue, firstPoll);
    }

    for (const [key, { issue }] of [...seen]) {
      if (!present.has(key) && !isStale(key)) yield* handleGone(key, issue);
    }
  });

const handleIssue = (issue: Issue, firstPoll: boolean) =>
  Effect.gen(function* () {
    const { status } = yield* AppConfig;
    const { seen, running, failed } = yield* State;
    const key = keyOf(issue);
    const previous = seen.get(key);
    seen.set(key, { issue, status: issue.status });
    const active = running.get(key);
    if (issue.status !== status.todo) failed.delete(key);

    if (active) {
      if (![status.todo, status.doing, status.review].includes(issue.status ?? '')) {
        yield* abort(issue, active, `status is "${issue.status}"`);
      }
    } else if (issue.status === status.todo) {
      if (!failed.has(key)) yield* start(issue, 'implement');
    } else if (issue.status === status.review && !firstPoll && previous && previous.status !== status.review) {
      yield* start(issue, 'review');
    }
  });

const handleGone = (key: string, issue: Issue) =>
  Effect.gen(function* () {
    const { seen, running, failed } = yield* State;
    seen.delete(key);
    failed.delete(key);
    const active = running.get(key);
    if (active)
      yield* abort(issue, active, 'issue left the board query (closed, unassigned, label or iteration removed)');
    if (!(yield* isClosed(issue).pipe(Effect.catch(() => Effect.succeed(false))))) return;
    if (active) yield* Fiber.await(active);
    yield* removeWorktree(yield* getProject(issue.project), issue).pipe(
      Effect.andThen(log('CLEANUP', 'closed, worktree removed', issue)),
      Effect.catch((e) => logError('FAIL', e, issue)),
    );
  });

const abort = (issue: Issue, active: Fiber.Fiber<unknown, unknown>, reason: string) =>
  Effect.gen(function* () {
    if (active.pollUnsafe()) return; // already finished or interrupted
    yield* log('ABORT', reason, issue);
    yield* Fiber.interrupt(active).pipe(Effect.forkChild);
  });

/** Run the issue in its own fiber, at most `maxParallel` at a time. */
const start = (issue: Issue, mode: Mode) =>
  Effect.gen(function* () {
    const { slots, running } = yield* State;
    const key = keyOf(issue);
    const fiber = yield* work(issue, mode).pipe(
      slots.withPermits(1),
      Effect.ensuring(Effect.sync(() => running.delete(key))),
      Effect.forkScoped,
    );
    running.set(key, fiber);
  });
