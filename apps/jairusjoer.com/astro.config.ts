// @ts-check
import { defineConfig } from 'astro/config';
import { site } from './src/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), sitemap()],

  markdown: {
    shikiConfig: {
      themes: {
        dark: 'catppuccin-mocha',
        light: 'catppuccin-latte',
      },
    },
    remarkRehype: {
      footnoteLabelProperties: {},
    },
  },

  site: site.url,
});