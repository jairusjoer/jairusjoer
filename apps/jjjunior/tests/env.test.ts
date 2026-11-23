import assert from 'node:assert/strict';
import { test } from 'node:test';
import { env, int, required } from '../src/config/env.ts';

test('env falls back when unset or empty', () => {
  process.env.JJ_TEST = '';
  assert.equal(env('JJ_TEST', 'x'), 'x');
  process.env.JJ_TEST = 'y';
  assert.equal(env('JJ_TEST', 'x'), 'y');
});

test('int validates range and integrality', () => {
  process.env.JJ_TEST = '0';
  assert.throws(() => int('JJ_TEST', '1'));
  process.env.JJ_TEST = '2.5';
  assert.throws(() => int('JJ_TEST', '1'));
  process.env.JJ_TEST = '4';
  assert.equal(int('JJ_TEST', '1'), 4);
});

test('required throws when missing', () => {
  delete process.env.JJ_MISSING;
  assert.throws(() => required('JJ_MISSING'), /JJ_MISSING/);
});
