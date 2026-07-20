import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { site } from './src/config';

// https://astro.build/config
export default defineConfig({
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
