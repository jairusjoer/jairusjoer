import { file, glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const books = defineCollection({
  loader: file('src/content/reading/books.json'),
  schema: ({ image }) =>
    z.object({
      author: z.string(),
      cover: image().optional(),
      source: z.string().url().optional(),
      status: z.enum(['Unread', 'Reading', 'Completed', 'Dropped']),
      id: z.string(),
    }),
});

const links = defineCollection({
  loader: file('src/content/reading/links.json'),
  schema: z.array(z.string().url()),
});

const pages = defineCollection({
  loader: glob({
    base: `./src/content`,
    pattern: '**/*.{md,mdoc,mdx}',
  }),
  schema: ({ image }) =>
    z.object({
      date: z.date().optional(),
      description: z.string().max(300).optional(),
      status: z.enum(['Draft', 'Unpublished']).optional(),
      image: image().optional(),
      title: z.string().max(150),
    }),
});

// https://docs.astro.build/en/guides/content-collections/
export const collections = { books, links, pages };
