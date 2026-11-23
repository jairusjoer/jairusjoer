import { config } from '../config/config.ts';
import { setStatus } from '../gitlab/issues.ts';
import { type Issue } from '../gitlab/types.ts';
import { semaphore } from '../lib/semaphore.ts';

export const { acquire, release } = semaphore(config.maxParallel);

export const running = new Map<string, { controller: AbortController; done: Promise<void> }>();
/** Last status seen per issue, used to detect moves into "In Review". */
export const seen = new Map<string, { issue: Issue; status: string | null }>();
/** When we last changed an issue's status; poll results older than that are stale for it. */
export const ourMoves = new Map<string, number>();

/** Issues whose failure could not be recorded on the board; not retried until their status changes. */
export const failed = new Set<string>();

export const keyOf = (issue: Issue) => `${issue.project}#${issue.iid}`;

export const moveTo = async (issue: Issue, status: string) => {
  await setStatus(issue, status);
  ourMoves.set(keyOf(issue), Date.now());
  seen.set(keyOf(issue), { issue, status });
};
