import { NodeRuntime, NodeServices } from '@effect/platform-node';
import { Effect, Layer } from 'effect';
import { AppConfig } from './config/config.ts';
import { banner, logError } from './lib/log.ts';
import { poll } from './loop/poll.ts';
import { Prompts } from './loop/prompts.ts';
import { State } from './loop/state.ts';

const program = Effect.gen(function* () {
  const { pollIntervalMs } = yield* AppConfig;
  yield* banner;
  let first = true;
  yield* Effect.gen(function* () {
    yield* poll(first).pipe(Effect.catch((e) => logError('POLL', e)));
    first = false;
    yield* Effect.sleep(pollIntervalMs);
  }).pipe(Effect.forever);
});

const config = AppConfig.layer;
const live = Layer.mergeAll(State.layer, Prompts.layer).pipe(
  Layer.provideMerge(config),
  Layer.provideMerge(NodeServices.layer),
);

NodeRuntime.runMain(program.pipe(Effect.scoped, Effect.provide(live)));
