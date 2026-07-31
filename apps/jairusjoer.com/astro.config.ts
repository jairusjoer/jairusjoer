import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import { site } from './src/config';

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

  integrations: [mdx(), sitemap(), vue()],

  markdown: {
    shikiConfig: {
      themes: {
        dark: 'catppuccin-mocha',
        light: 'catppuccin-latte',
      },
    },
  },

  site: site.url,

  vite: {
    plugins: [tailwindcss()],
  },
});
