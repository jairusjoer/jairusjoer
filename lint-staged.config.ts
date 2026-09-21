import { type Configuration } from 'lint-staged';

export default {
  '*': ['prettier --write --ignore-unknown', 'eslint --fix --no-warn-ignored'],
} satisfies Configuration;
