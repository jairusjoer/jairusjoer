import css from '@eslint/css';
import js from '@eslint/js';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import * as mdx from 'eslint-plugin-mdx';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['**/.astro', '**/.vscode', '**/dist', '**/public', '.agents', '.nx']),
  {
    files: ['**/*.astro'],
    plugins: { astro },
    extends: [astro.configs['flat/jsx-a11y-recommended']],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: [css.configs.recommended],
    rules: {
      'css/no-invalid-at-rules': 0, // Progressive enhancements
      'css/no-invalid-properties': 0, // Imported variables
      'css/use-baseline': 0, // Progressive enhancements
    },
  },
  {
    files: ['**/*.{cjs,js,jsx,mjs,mjsx,mtsx,ts,tsx}'],
    plugins: { jsxA11y },
    extends: [js.configs.recommended, tseslint.configs.recommended, jsxA11y.flatConfigs.recommended],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        tsconfigRootDir: process.cwd(),
      },
    },
    rules: {
      'jsx-a11y/no-noninteractive-tabindex': ['error', { roles: ['tabpanel', 'region'] }], // Astro code blocks
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
    language: 'markdown/gfm',
    extends: [markdown.configs.recommended],
  },
  {
    files: ['**/*.mdx'],
    plugins: { jsxA11y },
    extends: [mdx.configs.flat, mdx.configs.flatCodeBlocks, jsxA11y.flatConfigs.recommended],
  },
);
