import { fileURLToPath } from 'node:url';

const env = (key: string, fallback: string): string => process.env[key] ?? fallback;
/** Monorepo root; clones and worktrees live there (gitignored). */
const root = fileURLToPath(new URL('../../../', import.meta.url));

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
  pollIntervalMs: 60_000,
  reposDir: `${root}repos`,
  worktreesDir: `${root}worktrees`,
  maxRounds: Number(env('MAX_ROUNDS', '3')),
  maxParallel: Number(env('MAX_PARALLEL', '2')),
  /** How long to wait for CI on a pushed commit. */
  pipelineTimeoutMs: 30 * 60_000,
  agentTimeoutMs: Number(env('AGENT_TIMEOUT_MIN', '60')) * 60_000,
  permissionMode: env('PERMISSION_MODE', 'auto'),
  model: env('CLAUDE_MODEL', 'claude-sonnet-5-5'),
};
