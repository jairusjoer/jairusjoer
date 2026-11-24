import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import type { Usage } from '../agent/run.ts';
import { config } from '../config/config.ts';

export type Outcome = 'approved' | 'rounds-exhausted' | 'blocked' | 'no-commits' | 'ci-failed' | 'failed' | 'aborted';
export type Call = Usage & { role: 'implementer' | 'reviewer' };
export type Entry = {
  at: string;
  project: string;
  iid: number;
  mode: 'implement' | 'review';
  model: string;
  outcome: Outcome;
  /** Wall-clock time of the whole run, including CI waits. */
  durationMs: number;
  calls: Call[];
};

/** One JSON line per finished run. */
export const record = (entry: Entry) => appendFileSync(config.statsFile, JSON.stringify(entry) + '\n');

export const load = (file = config.statsFile): Entry[] =>
  existsSync(file)
    ? readFileSync(file, 'utf8')
        .split('\n')
        .filter(Boolean)
        .map((line) => JSON.parse(line))
    : [];

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const avg = (xs: number[]) => (xs.length ? sum(xs) / xs.length : 0);

export const tokens = (calls: Call[]) => sum(calls.map((c) => c.input + c.output + c.cacheRead + c.cacheWrite));
export const cost = (calls: Call[]) => sum(calls.map((c) => c.costUsd));

/** Aborted runs (issue left the workflow) are neither success nor failure, so they are left out of the rates. */
export const summarize = (entries: Entry[]) => {
  const outcomes: Partial<Record<Outcome, number>> = {};
  for (const e of entries) outcomes[e.outcome] = (outcomes[e.outcome] ?? 0) + 1;
  const finished = entries.filter((e) => e.outcome !== 'aborted');
  const approved = finished.filter((e) => e.outcome === 'approved');
  const reviews = (e: Entry) => e.calls.filter((c) => c.role === 'reviewer').length;
  const all = entries.flatMap((e) => e.calls);
  return {
    runs: entries.length,
    outcomes,
    successRate: finished.length ? approved.length / finished.length : 0,
    firstPassRate: finished.length ? approved.filter((e) => reviews(e) === 1).length / finished.length : 0,
    avgRounds: avg(finished.map(reviews)),
    avgTokens: avg(entries.map((e) => tokens(e.calls))),
    avgCostUsd: avg(entries.map((e) => cost(e.calls))),
    avgMinutes: avg(entries.map((e) => e.durationMs)) / 60_000,
    totalTokens: tokens(all),
    totalCostUsd: cost(all),
    cacheHitRate: sum(all.map((c) => c.cacheRead)) / (sum(all.map((c) => c.cacheRead + c.cacheWrite + c.input)) || 1),
  };
};
