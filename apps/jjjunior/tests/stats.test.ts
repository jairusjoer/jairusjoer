import assert from 'node:assert/strict';
import { test } from 'node:test';
import { summarize, type Call, type Entry, type Outcome } from '../src/lib/stats.ts';

const call = (role: Call['role'], input = 100): Call => ({
  role,
  input,
  output: 10,
  cacheRead: 0,
  cacheWrite: 0,
  costUsd: 0.5,
  durationMs: 1,
  turns: 1,
});
const entry = (outcome: Outcome, reviews: number): Entry => ({
  at: '',
  project: 'g/p',
  iid: 1,
  mode: 'implement',
  model: 'm',
  outcome,
  durationMs: 60_000,
  calls: [call('implementer'), ...Array.from({ length: reviews }, () => call('reviewer'))],
});

test('summarize computes rates, ignoring aborted runs', () => {
  const s = summarize([entry('approved', 1), entry('approved', 2), entry('failed', 0), entry('aborted', 0)]);
  assert.equal(s.runs, 4);
  assert.equal(s.outcomes.approved, 2);
  assert.equal(s.successRate, 2 / 3);
  assert.equal(s.firstPassRate, 1 / 3);
  assert.equal(s.totalCostUsd, 0.5 * (2 + 3 + 1 + 1));
});

test('summarize handles no runs', () => {
  assert.equal(summarize([]).successRate, 0);
});
