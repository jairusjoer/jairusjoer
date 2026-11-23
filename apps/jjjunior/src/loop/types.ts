import type { Issue, Project } from '../gitlab/types.ts';

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
};
