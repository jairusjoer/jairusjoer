import { readdirSync } from 'node:fs';
import { RuleConfigSeverity, type UserConfig } from '@commitlint/types';

const dirs = (path: string) =>
  readdirSync(path, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['repo', ...dirs('apps'), ...dirs('packages')]],
    'scope-empty': [RuleConfigSeverity.Error, 'never'],
  },
} satisfies UserConfig;
