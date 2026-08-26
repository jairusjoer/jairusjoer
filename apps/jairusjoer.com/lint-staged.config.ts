import { type Configuration } from 'lint-staged';

export default {
  '*.{astro,css,json,md,mdx,ts}': ['astro check', 'eslint --fix', 'prettier -w -u'],
} satisfies Configuration;
