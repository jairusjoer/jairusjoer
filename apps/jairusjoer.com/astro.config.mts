import { defineConfig } from 'astro/config';

// Integrations
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Plugins
import tailwindcss from '@tailwindcss/vite';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), sitemap(), vue()],
  markdown: {
    shikiConfig: {
      themes: {
        dark: 'vitesse-dark',
        light: 'vitesse-light',
      },
    },
  },
  site: 'https://jairusjoer.com',
  vite: {
    plugins: [tailwindcss()],
  },
});
