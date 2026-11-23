import { config } from './config.ts';
import { run } from './exec.ts';

type AgentResult<T> = { sessionId: string; output: T; costUsd: number };

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
  return { sessionId: raw.session_id, output: raw.structured_output as T, costUsd: raw.total_cost_usd ?? 0 };
};

export type Implementation = { status: 'done' | 'blocked'; summary: string; question?: string };
export type Review = { approved: boolean; findings: string; verification: string };

export const implementationSchema = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['done', 'blocked'] },
    summary: { type: 'string', description: 'What was changed and how it was verified' },
    question: { type: 'string', description: 'Only when blocked: what the human must clarify' },
  },
  required: ['status', 'summary'],
};

export const reviewSchema = {
  type: 'object',
  properties: {
    approved: { type: 'boolean' },
    findings: { type: 'string', description: 'Markdown list of blocking issues; empty when approved' },
    verification: {
      type: 'string',
      description: 'Exact commands you ran yourself (tests, type check, lint, build) and their results',
    },
  },
  required: ['approved', 'findings', 'verification'],
};
