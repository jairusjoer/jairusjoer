// Collections
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Pages
const pages = defineCollection({
  loader: glob({
    base: `./src/content/pages`,
    pattern: '**/*.{md,mdx}',
  }),
  schema: ({ image }) =>
    z.object({
      draft: z.boolean().optional(),
      image: image().optional(),
      title: z.string(),
      description: z.string().optional(),
    }),
});

export const collections = {
  pages,
};
