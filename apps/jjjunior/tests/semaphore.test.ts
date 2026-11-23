import assert from 'node:assert/strict';
import { test } from 'node:test';
import { semaphore } from '../src/lib/semaphore.ts';

test('runs up to max at once, then queues in order', async () => {
  const { acquire, release } = semaphore(1);
  const order: string[] = [];
  await acquire();
  const second = acquire().then(() => order.push('second'));
  await Promise.resolve();
  assert.deepEqual(order, []);
  release();
  await second;
  assert.deepEqual(order, ['second']);
});

test('release restores a free slot', async () => {
  const { acquire, release } = semaphore(1);
  await acquire();
  release();
  await assert.doesNotReject(acquire());
});
