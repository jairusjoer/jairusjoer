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
      date: z.date().optional(),
      description: z.string().optional(),
      draft: z.boolean().optional(),
      image: image().optional(),
      title: z.string(),
    }),
});

export const collections = {
  pages,
};
