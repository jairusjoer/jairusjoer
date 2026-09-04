import { type Configuration } from 'lint-staged';

export default {
  'apps/jairusjoer.com/**/*.{astro,css,json,md,mdx,ts}': [
    'pnpm --filter jairusjoer.com exec astro check',
    'pnpm --filter jairusjoer.com exec eslint --fix',
  ],
  '*': ['prettier --write --ignore-unknown'],
} satisfies Configuration;
