import rss from '@astrojs/rss';
import { page } from '@config';
import { getPublishedPages } from '@scripts/getPublishedPages';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const collection = await getPublishedPages();

  const entries = collection.map((entry) => ({
    title: entry.data.title,
    description: entry.data.description,
    link: `/${entry.id}`,
    pubDate: entry.data.date,
    content: entry.rendered?.html,
  }));

  return rss({
    title: page.title,
    description: page.description,
    site: page.url,
    items: entries,
  });
};
