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
      name: 'Geist',
      cssVariable: '--font-geist',
      weights: ['400', '500', '600'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      weights: ['400', '500', '600'],
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
