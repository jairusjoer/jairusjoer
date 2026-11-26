import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ConfigProvider, Effect } from 'effect';
import { AppConfig } from '../src/config/config.ts';

const load = (env: Record<string, string>) =>
  Effect.runPromise(
    Effect.gen(function* () {
      return yield* AppConfig;
    }).pipe(Effect.provide(AppConfig.layer), Effect.provide(ConfigProvider.layer(ConfigProvider.fromEnv({ env })))),
  );

test('defaults apply when optional vars are unset', async () => {
  const c = await load({ GITLAB_GROUP: 'g', ASSIGNEE: 'me' });
  assert.equal(c.maxRounds, 3);
  assert.equal(c.triggerLabel, 'claude');
  assert.equal(c.status.review, 'In Review');
  assert.equal(c.agentTimeoutMs, 60 * 60_000);
});

test('required vars are enforced', async () => {
  await assert.rejects(load({ ASSIGNEE: 'me' }), /GITLAB_GROUP/);
});

test('counts are validated', async () => {
  await assert.rejects(load({ GITLAB_GROUP: 'g', ASSIGNEE: 'me', MAX_ROUNDS: '0' }));
  await assert.rejects(load({ GITLAB_GROUP: 'g', ASSIGNEE: 'me', MAX_ROUNDS: '2.5' }));
  assert.equal((await load({ GITLAB_GROUP: 'g', ASSIGNEE: 'me', MAX_ROUNDS: '4' })).maxRounds, 4);
});
