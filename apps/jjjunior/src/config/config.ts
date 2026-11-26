import { fileURLToPath } from 'node:url';
import { Config, Context, Effect, Layer, Schema } from 'effect';

/** Monorepo root; clones and worktrees live there (gitignored). */
const root = fileURLToPath(new URL('../../../../', import.meta.url));

const count = (name: string, fallback: number) =>
  Config.schema(Schema.Int.check(Schema.isBetween({ minimum: 1, maximum: 10_000 })), name).pipe(
    Config.withDefault(fallback),
  );

const settings = Effect.gen(function* () {
  return {
    group: yield* Config.String('GITLAB_GROUP'),
    assignee: yield* Config.String('ASSIGNEE'),
    /** Opt-in label; only issues carrying it are touched. Empty = every assigned issue. */
    triggerLabel: yield* Config.String('TRIGGER_LABEL').pipe(Config.withDefault('claude')),
    currentIterationOnly: yield* Config.Boolean('CURRENT_ITERATION_ONLY').pipe(Config.withDefault(true)),
    /** Board lists are work item statuses. */
    status: {
      todo: yield* Config.String('STATUS_TODO').pipe(Config.withDefault('To do')),
      doing: yield* Config.String('STATUS_DOING').pipe(Config.withDefault('In progress')),
      review: yield* Config.String('STATUS_REVIEW').pipe(Config.withDefault('In Review')),
    },
    promptsDir: yield* Config.String('PROMPTS_DIR').pipe(
      Config.withDefault(fileURLToPath(new URL('../../prompts', import.meta.url))),
    ),
    statsFile: yield* Config.String('STATS_FILE').pipe(
      Config.withDefault(fileURLToPath(new URL('../../stats.jsonl', import.meta.url))),
    ),
    pollIntervalMs: 60_000,
    reposDir: `${root}repos`,
    worktreesDir: `${root}worktrees`,
    maxRounds: yield* count('MAX_ROUNDS', 3),
    maxParallel: yield* count('MAX_PARALLEL', 2),
    /** How long to wait for CI on a pushed commit. */
    pipelineTimeoutMs: 30 * 60_000,
    agentTimeoutMs: (yield* count('AGENT_TIMEOUT_MIN', 60)) * 60_000,
    permissionMode: yield* Config.String('PERMISSION_MODE').pipe(Config.withDefault('auto')),
    model: yield* Config.String('CLAUDE_MODEL').pipe(Config.withDefault('claude-sonnet-5-5')),
  };
});

export class AppConfig extends Context.Service<AppConfig, Effect.Success<typeof settings>>()('jjjunior/AppConfig') {
  static readonly layer = Layer.effect(AppConfig, settings);
}
