import { resolve } from 'node:path';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import stylex from '@stylexjs/unplugin';
import { defineConfig } from 'astro/config';
import { tokens } from './src/tokens/tokens';

// https://astro.build/config
export default defineConfig({
  integrations: [tokens(), react(), mdx()],
  server: {
    port: 4322,
  },
  vite: {
    plugins: [stylex.vite()],
    server: {
      fs: {
        allow: [resolve(process.cwd(), '../..')],
      },
    },
  },
});
