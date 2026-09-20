import { resolve } from 'node:path';
import react from '@astrojs/react';
import stylex from '@stylexjs/unplugin';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  server: {
    port: 4322,
  },
  vite: {
    plugins: [stylex.vite({ useCSSLayers: true })],
    server: {
      fs: {
        allow: [resolve(process.cwd(), '../..')],
      },
    },
  },
});
