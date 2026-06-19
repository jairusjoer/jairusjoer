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
      weights: [400, 500],
      cssVariable: '--font-inter',
    },
  ],

  integrations: [mdx(), sitemap(), vue()],

  markdown: {
    shikiConfig: {
      themes: {
        dark: 'github-dark-high-contrast',
        light: 'github-light-high-contrast',
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
