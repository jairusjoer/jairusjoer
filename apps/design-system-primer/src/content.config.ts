import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const pages = defineCollection({
  loader: glob({
    base: `./src/content`,
    pattern: '**/*.{md,mdx}',
  }),
  schema: () => {
    return z.object({
      title: z.string().max(150),
      date: z.coerce.date().optional(),
      description: z.string().max(300).optional(),
    });
  },
});

// https://docs.astro.build/en/guides/content-collections/
export const collections = { pages };
