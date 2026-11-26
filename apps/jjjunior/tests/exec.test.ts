import assert from 'node:assert/strict';
import { test } from 'node:test';
import { NodeServices } from '@effect/platform-node';
import { Effect } from 'effect';
import { run } from '../src/lib/exec.ts';

const exec = <A, E>(self: Effect.Effect<A, E, never>) => Effect.runPromise(self);
const provide = <A, E, R>(self: Effect.Effect<A, E, R>) => self.pipe(Effect.provide(NodeServices.layer));

test('run returns stdout and feeds stdin', async () => {
  assert.equal(await exec(provide(run('echo', ['hi']))), 'hi\n');
  assert.equal(await exec(provide(run('cat', [], { input: 'piped' }))), 'piped');
});

test('run fails with stderr on a non-zero exit', async () => {
  const error = await exec(provide(run('sh', ['-c', 'echo boom >&2; exit 3']).pipe(Effect.flip)));
  assert.match(error.message, /exited 3: boom/);
});

test('interrupting run kills the process', async () => {
  const started = Date.now();
  await exec(provide(run('sleep', ['30']).pipe(Effect.timeoutOption('200 millis'))));
  assert.ok(Date.now() - started < 5_000);
});
