import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cv = defineCollection({
  loader: glob({
    base: `./src/content/cv`,
    pattern: '**/*.{md,mdx}',
  }),
  schema: z.object({
    category: z.string(),
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    date: z.array(z.string()),
    draft: z.boolean().optional(),
    href: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({
    base: `./src/content/pages`,
    pattern: '**/*.{md,mdx}',
  }),
  schema: z.object({
    date: z.date().optional(),
    description: z.string().optional(),
    draft: z.boolean().optional(),
    title: z.string(),
  }),
});

export const collections = { cv, pages };
