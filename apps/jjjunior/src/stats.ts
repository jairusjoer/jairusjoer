import { NodeRuntime, NodeServices } from '@effect/platform-node';
import { Effect } from 'effect';
import { AppConfig } from './config/config.ts';
import { load, summarize } from './lib/stats.ts';

const pct = (n: number) => `${(n * 100).toFixed(0)}%`;
const k = (n: number) => `${Math.round(n / 1000)}k`;

const program = Effect.gen(function* () {
  const { statsFile } = yield* AppConfig;
  const s = summarize(yield* load);
  console.log(
    [
      `${s.runs} runs (${statsFile})`,
      ...Object.entries(s.outcomes).map(([name, n]) => `  ${name.padEnd(17)} ${n}`),
      `success rate     ${pct(s.successRate)} (approved / finished, aborted excluded)`,
      `first-pass       ${pct(s.firstPassRate)} (approved in one review round)`,
      `avg review rounds ${s.avgRounds.toFixed(1)}`,
      `avg per run      ${k(s.avgTokens)} tokens · $${s.avgCostUsd.toFixed(2)} · ${s.avgMinutes.toFixed(1)} min`,
      `total            ${k(s.totalTokens)} tokens · $${s.totalCostUsd.toFixed(2)}`,
      `cache hit rate   ${pct(s.cacheHitRate)}`,
    ].join('\n'),
  );
});

NodeRuntime.runMain(program.pipe(Effect.provide(AppConfig.layer), Effect.provide(NodeServices.layer)));
