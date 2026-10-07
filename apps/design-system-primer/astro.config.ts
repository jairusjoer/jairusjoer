import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import type { StarlightConfig } from '@astrojs/starlight/types';
import stylex from '@stylexjs/unplugin';
import { defineConfig } from 'astro/config';

const stylexHead: StarlightConfig['head'] = [
  {
    tag: 'link',
    attrs: {
      rel: 'stylesheet',
      href: '/virtual:stylex.css',
    },
  },
  {
    tag: 'script',
    attrs: {
      type: 'module',
      src: '/@id/virtual:stylex:runtime',
    },
  },
];

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'My Docs',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
      sidebar: [
        {
          label: 'Guides',
          items: [
            // Each item here is one entry in the navigation menu.
            { label: 'Example Guide', slug: 'guides/example' },
          ],
        },
        {
          label: 'Reference',
          items: [{ autogenerate: { directory: 'reference' } }],
        },
      ],
      head: [...stylexHead],
      customCss: ['./src/styles/theme.css', './src/styles/stylex.css'],
    }),
    react(),
  ],
  vite: {
    plugins: [stylex.vite()],
  },
});
