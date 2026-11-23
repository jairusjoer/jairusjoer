import { homedir } from 'node:os';

const env = (key: string, fallback: string): string => (process.env[key] ?? fallback).replace(/^~(?=\/|$)/, homedir());

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var ${key} (see .env.example)`);
  return value;
};

export const config = {
  group: required('GITLAB_GROUP'),
  assignee: required('ASSIGNEE'),
  /** Opt-in label; only issues carrying it are touched. Empty = every assigned issue. */
  triggerLabel: env('TRIGGER_LABEL', 'claude'),
  currentIterationOnly: env('CURRENT_ITERATION_ONLY', 'true') === 'true',
  /** Board lists are work item statuses. */
  status: {
    todo: env('STATUS_TODO', 'To do'),
    doing: env('STATUS_DOING', 'In progress'),
    review: env('STATUS_REVIEW', 'In Review'),
  },
  pollIntervalMs: Number(env('POLL_INTERVAL_SEC', '30')) * 1000,
  reposDir: env('REPOS_DIR', '~/Git/jjjunior-repos'),
  worktreesDir: env('WORKTREES_DIR', '~/Git/jjjunior-worktrees'),
  maxRounds: Number(env('MAX_ROUNDS', '3')),
  maxParallel: Number(env('MAX_PARALLEL', '2')),
  /** How long to wait for CI on a pushed commit; 0 disables the CI gate. */
  pipelineTimeoutMs: Number(env('PIPELINE_TIMEOUT_MIN', '45')) * 60_000,
  agentTimeoutMs: Number(env('AGENT_TIMEOUT_MIN', '60')) * 60_000,
  permissionMode: env('PERMISSION_MODE', 'auto'),
  model: process.env.CLAUDE_MODEL,
};
