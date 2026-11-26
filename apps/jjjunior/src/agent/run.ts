import { Effect, Schema } from 'effect';
import { AppConfig } from '../config/config.ts';
import { run } from '../lib/exec.ts';

export class AgentError extends Schema.TaggedError<AgentError>()('AgentError', { message: Schema.String }) {}

export type Usage = {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  costUsd: number;
  durationMs: number;
  turns: number;
};

/** Run a headless Claude Code instance and return its schema-validated output. Interrupting kills it. */
export const runAgent = <S extends Schema.Top>(opts: {
  cwd: string;
  prompt: string;
  schema: S;
  systemPrompt: string;
  resume?: string;
  readOnly?: boolean;
}) =>
  Effect.gen(function* () {
    const config = yield* AppConfig;
    const args = [
      '-p',
      '--output-format',
      'json',
      '--json-schema',
      JSON.stringify(Schema.toJsonSchemaDocument(opts.schema).schema),
      '--append-system-prompt',
      opts.systemPrompt,
      '--permission-mode',
      config.permissionMode,
      '--model',
      config.model,
      // Resumed sessions re-read the whole transcript every turn; compact early to keep that bounded.
      '--autocompact',
      '100k',
    ];
    if (opts.resume) args.push('--resume', opts.resume);
    if (opts.readOnly) args.push('--disallowedTools', 'Edit', 'Write', 'NotebookEdit');

    const out = yield* run('claude', args, { cwd: opts.cwd, input: opts.prompt }).pipe(
      Effect.timeoutOrElse({
        duration: config.agentTimeoutMs,
        orElse: () =>
          Effect.fail(new AgentError({ message: `Agent timed out after ${config.agentTimeoutMs / 60_000} min` })),
      }),
    );
    // The CLI's JSON envelope is trusted; only the structured output is validated.
    const raw = yield* Effect.try({
      try: () => JSON.parse(out),
      catch: () => new AgentError({ message: `Agent printed invalid JSON: ${out.slice(0, 500)}` }),
    });
    if (raw.is_error || !raw.structured_output) {
      return yield* new AgentError({
        message: `Agent ended without a result (${raw.subtype}): ${String(raw.result ?? '').slice(0, 500)}`,
      });
    }
    const output = yield* Schema.decodeUnknownEffect(opts.schema)(raw.structured_output).pipe(
      Effect.mapError((e) => new AgentError({ message: `Agent output does not match the schema: ${e.message}` })),
    );
    return {
      sessionId: raw.session_id as string,
      output: output as S['Type'],
      usage: {
        input: raw.usage?.input_tokens ?? 0,
        output: raw.usage?.output_tokens ?? 0,
        cacheRead: raw.usage?.cache_read_input_tokens ?? 0,
        cacheWrite: raw.usage?.cache_creation_input_tokens ?? 0,
        costUsd: raw.total_cost_usd ?? 0,
        durationMs: raw.duration_ms ?? 0,
        turns: raw.num_turns ?? 0,
      } satisfies Usage,
    };
  });
