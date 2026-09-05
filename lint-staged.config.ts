import { relative } from 'node:path';
import { type Configuration } from 'lint-staged';

export default {
  '*': [
    'prettier --write --ignore-unknown',
    'eslint --fix --no-warn-ignored',
    (files) => `nx affected -t typecheck --files="${files.map((file) => relative(process.cwd(), file)).join(',')}"`,
  ],
} satisfies Configuration;
