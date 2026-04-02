import css from '@eslint/css';
import js from '@eslint/js';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['.astro', '.vscode', 'dist', 'package*.json', 'public']),
  {
    files: ['**/*.astro'],
    plugins: { astro },
    extends: [astro.configs.recommended],
  },
  {
    files: ['**/*.css'],
    plugins: { css },
    extends: [css.configs.recommended],
    language: 'css/css',
    rules: {
      'css/no-invalid-at-rules': 0, // Progressive enhancements
      'css/no-invalid-properties': 0, // Imported variables
      'css/use-baseline': 0, // Progressive enhancements
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    plugins: { js, jsxA11y },
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true }, tsconfigRootDir: import.meta.dirname },
    },
  },
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: [json.configs.recommended],
  },
  {
    files: ['**/*.md'],
    plugins: { markdown },
    extends: [markdown.configs.recommended],
    language: 'markdown/gfm',
  },
);
