import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { formatDatetime } from 'src/scripts/formatDatetime';
import { defaultMetadata } from 'src/constants';

export const GET: APIRoute = async (context) => {
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
    title: defaultMetadata.title!,
    description: defaultMetadata.description!,
    site: context.site?.toString() ?? 'https://jairusjoer.com',
    items: entries,
  });
};
