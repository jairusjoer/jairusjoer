import { relative } from 'node:path';
import { type Configuration } from 'lint-staged';

export default {
  '*': [
    (files) => `nx affected -t check-types --files="${files.map((file) => relative(process.cwd(), file)).join(',')}"`,
    'prettier --write --ignore-unknown',
    'eslint --fix',
  ],
} satisfies Configuration;
