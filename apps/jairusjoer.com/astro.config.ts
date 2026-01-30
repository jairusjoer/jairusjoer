// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { site } from './src/config';

import markdoc from '@astrojs/markdoc';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), markdoc(), sitemap()],

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

  site: site.site,
});
