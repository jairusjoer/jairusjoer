import { NodeRuntime } from '@effect/platform-node';
import { serve } from '@hono/node-server';
import { Effect, Layer } from 'effect';
import { Hono } from 'hono';
import { appConfig } from './jjjunior.config.js';

const app = new Hono();

app.get('/healthz', (c) => c.json({ ok: true }));

// Phase 2 mounts `POST /hooks/<providerKey>` per configured adapter here.
app.post('/hooks/:provider', (c) => c.json({ error: 'adapter wiring pending (Phase 2)' }, 501));

const Receiver = Layer.effectDiscard(
  Effect.gen(function* () {
    yield* Effect.acquireRelease(
      Effect.sync(() =>
        serve({ fetch: app.fetch, port: appConfig.delivery.webhooks.port }, (info) => {
          console.log(`[jjjunior] receiver listening on: http://localhost:${info.port}`);
        }),
      ),
      (server) => Effect.promise(() => new Promise<void>((resolve) => server.close(() => resolve()))),
    );

    console.log(`[jjjunior] daemon running in mode: ${appConfig.mode}`);

    yield* Effect.never;
  }),
);

NodeRuntime.runMain(Layer.launch(Receiver));
