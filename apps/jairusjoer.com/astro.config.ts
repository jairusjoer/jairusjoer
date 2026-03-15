import { defineConfig } from 'astro/config';
import { site } from './src/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), sitemap()],

  markdown: {
    shikiConfig: {
      themes: {
        dark: 'rose-pine-moon',
        light: 'rose-pine-dawn',
      },
    },
    remarkRehype: {
      footnoteLabelProperties: {},
    },
  },

  site: site.url,

  vite: {
    plugins: [tailwindcss()],
  },
});
