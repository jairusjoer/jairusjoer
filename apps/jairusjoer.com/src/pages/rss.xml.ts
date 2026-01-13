import rss from '@astrojs/rss';
import { site } from '../config';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { formatDatetime } from '@scripts/formatDatetime';

export const GET: APIRoute = async () => {
  let collection = await getCollection('pages', ({ data }) => !data.draft);

  if (import.meta.env.PROD) {
    collection = collection.filter((entry) => !entry.data?.draft);
  }

  const entries = [];

  for (const entry of collection) {
    const item = {
      title: entry.data.title,
      description: entry.data.description,
      link: `/${entry.id}`,
      content: entry.rendered?.html,
    };

    if (entry.data?.date && !Array.isArray(entry.data.date)) {
      Object.assign(item, { pubDate: formatDatetime(entry.data.date) });
    }

    entries.push(item);
  }

  return rss({
    title: site.title,
    description: site.description,
    site: site.site,
    items: entries,
  });
};
