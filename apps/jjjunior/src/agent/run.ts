import { config } from '../config/config.ts';
import { run } from '../lib/exec.ts';

export type Usage = {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  costUsd: number;
  durationMs: number;
  turns: number;
};
type AgentResult<T> = { sessionId: string; output: T; usage: Usage };

/** Run a headless Claude Code instance and return its schema-validated output. */
export const runAgent = async <T>(opts: {
  cwd: string;
  prompt: string;
  schema: object;
  systemPrompt: string;
  resume?: string;
  readOnly?: boolean;
  signal: AbortSignal;
}): Promise<AgentResult<T>> => {
  const args = [
    '-p',
    '--output-format',
    'json',
    '--json-schema',
    JSON.stringify(opts.schema),
    '--append-system-prompt',
    opts.systemPrompt,
    '--permission-mode',
    config.permissionMode,
    '--model',
    config.model,
  ];
  if (opts.resume) args.push('--resume', opts.resume);
  if (opts.readOnly) args.push('--disallowedTools', 'Edit', 'Write', 'NotebookEdit');

  const signal = AbortSignal.any([opts.signal, AbortSignal.timeout(config.agentTimeoutMs)]);
  const raw = JSON.parse(await run('claude', args, { cwd: opts.cwd, signal, input: opts.prompt }));
  if (raw.is_error || !raw.structured_output) {
    throw new Error(`Agent ended without a result (${raw.subtype}): ${String(raw.result ?? '').slice(0, 500)}`);
  }
  return {
    sessionId: raw.session_id,
    output: raw.structured_output as T,
    usage: {
      input: raw.usage?.input_tokens ?? 0,
      output: raw.usage?.output_tokens ?? 0,
      cacheRead: raw.usage?.cache_read_input_tokens ?? 0,
      cacheWrite: raw.usage?.cache_creation_input_tokens ?? 0,
      costUsd: raw.total_cost_usd ?? 0,
      durationMs: raw.duration_ms ?? 0,
      turns: raw.num_turns ?? 0,
    },
  };
};
