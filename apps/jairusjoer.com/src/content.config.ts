import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const books = defineCollection({
  loader: file('src/content/books/index.json'),
  schema: ({ image }) =>
    z.object({
      author: z.string(),
      image: image().optional(),
      id: z.string(),
      status: z.enum(['Bought', 'Reading', 'Finished', 'Abandoned']),
      date: z.coerce.date(),
    }),
});

const links = defineCollection({
  loader: file('src/content/links/index.json'),
  schema: z.array(z.string()),
});

const pages = defineCollection({
  loader: glob({
    base: `./src/content`,
    pattern: '**/*.{md,mdx}',
  }),
  schema: ({ image }) => {
    return z.object({
      title: z.string().max(150),
      date: z.coerce.date().optional(),
      description: z.string().max(300).optional(),
      status: z.enum(['Draft']).optional(),
      image: image().optional(),
    });
  },
});

// https://docs.astro.build/en/guides/content-collections/
export const collections = { books, links, pages };
