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
        dark: 'vitesse-dark',
        light: 'vitesse-light',
      },
    },
    remarkRehype: {
      footnoteLabelProperties: {},
    },
  },

  site: site.site,
});
