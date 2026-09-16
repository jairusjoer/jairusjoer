import { RuleConfigSeverity, type UserConfig } from '@commitlint/types';

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-empty': [RuleConfigSeverity.Error, 'never'],
  },
} satisfies UserConfig;
