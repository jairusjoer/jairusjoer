import { type Config } from 'prettier';

export default {
  tabWidth: 2,
  printWidth: 120,
  singleAttributePerLine: true,
  singleQuote: true,
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
} satisfies Config;
