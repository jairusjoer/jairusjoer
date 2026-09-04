import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { ensureCodeContrast } from '@scripts/ensureCodeContrast';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import { page } from './src/config';

// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-sans',
      weights: [400, 500, 600],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      weights: [400, 500, 600],
      fallbacks: ['monospace'],
    },
  ],

  integrations: [mdx(), sitemap(), react()],

  markdown: {
    shikiConfig: {
      themes: {
        dark: 'vitesse-dark',
        light: 'vitesse-light',
      },
      transformers: [ensureCodeContrast],
    },
  },

  prefetch: {
    prefetchAll: true,
  },

  site: page.url,

  vite: {
    plugins: [tailwindcss()],
  },
});
