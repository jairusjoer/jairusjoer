import type { Issue, Project } from '../gitlab/types.ts';
import type { Call, Outcome } from '../lib/stats.ts';

export type Mode = 'implement' | 'review';

export type Run = {
  issue: Issue;
  project: Project;
  dir: string;
  context: string;
  signal: AbortSignal;
  prompt: string;
  session?: string;
  summary: string;
  mrUrl: string;
  /** Usage of every agent call, for stats. */
  calls: Call[];
};

export type ImplementResult = 'ok' | Extract<Outcome, 'blocked' | 'no-commits' | 'ci-failed'>;
