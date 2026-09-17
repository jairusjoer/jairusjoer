import { readdirSync } from 'node:fs';
import { RuleConfigSeverity, type UserConfig } from '@commitlint/types';

const apps = readdirSync('apps');
const packages = readdirSync('packages').filter((pkg) => !['.gitkeep'].includes(pkg));

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['repo', ...apps, ...packages]],
    'scope-empty': [RuleConfigSeverity.Error, 'never'],
  },
} satisfies UserConfig;
