import { Context, Effect, Fiber, Layer, Semaphore } from 'effect';
import { AppConfig } from '../config/config.ts';
import { setStatus } from '../gitlab/issues.ts';
import type { Issue, Project } from '../gitlab/types.ts';
import type { Call, Outcome } from '../lib/stats.ts';

export type Mode = 'implement' | 'review';

export type Run = {
  issue: Issue;
  project: Project;
  dir: string;
  context: string;
  prompt: string;
  session?: string;
  summary: string;
  mrUrl: string;
  /** Usage of every agent call, for stats. */
  calls: Call[];
};

export type ImplementResult = 'ok' | Extract<Outcome, 'blocked' | 'no-commits' | 'ci-failed'>;

export const keyOf = (issue: Issue) => `${issue.project}#${issue.iid}`;

/** Mutable orchestrator state, shared by the poller and the runs. */
export class State extends Context.Service<
  State,
  {
    /** Limits how many runs work at once. */
    readonly slots: Semaphore.Semaphore;
    readonly running: Map<string, Fiber.Fiber<unknown, unknown>>;
    /** Last status seen per issue, used to detect moves into "In Review". */
    readonly seen: Map<string, { issue: Issue; status: string | null }>;
    /** When we last changed an issue's status; poll results older than that are stale for it. */
    readonly ourMoves: Map<string, number>;
    /** Issues whose failure could not be recorded on the board; not retried until their status changes. */
    readonly failed: Set<string>;
  }
>()('jjjunior/State') {
  static readonly layer = Layer.effect(
    State,
    Effect.gen(function* () {
      const { maxParallel } = yield* AppConfig;
      return {
        slots: yield* Semaphore.make(maxParallel),
        running: new Map(),
        seen: new Map(),
        ourMoves: new Map(),
        failed: new Set(),
      };
    }),
  );
}

export const moveTo = (issue: Issue, status: string) =>
  Effect.gen(function* () {
    const state = yield* State;
    yield* setStatus(issue, status);
    state.ourMoves.set(keyOf(issue), Date.now());
    state.seen.set(keyOf(issue), { issue, status });
  });
