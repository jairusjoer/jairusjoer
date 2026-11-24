import { config } from './config/config.ts';
import { load, summarize } from './lib/stats.ts';

const s = summarize(load());
const pct = (n: number) => `${(n * 100).toFixed(0)}%`;
const k = (n: number) => `${Math.round(n / 1000)}k`;

console.log(
  [
    `${s.runs} runs (${config.statsFile})`,
    ...Object.entries(s.outcomes).map(([name, n]) => `  ${name.padEnd(17)} ${n}`),
    `success rate     ${pct(s.successRate)} (approved / finished, aborted excluded)`,
    `first-pass       ${pct(s.firstPassRate)} (approved in one review round)`,
    `avg review rounds ${s.avgRounds.toFixed(1)}`,
    `avg per run      ${k(s.avgTokens)} tokens · $${s.avgCostUsd.toFixed(2)} · ${s.avgMinutes.toFixed(1)} min`,
    `total            ${k(s.totalTokens)} tokens · $${s.totalCostUsd.toFixed(2)}`,
    `cache hit rate   ${pct(s.cacheHitRate)}`,
  ].join('\n'),
);
