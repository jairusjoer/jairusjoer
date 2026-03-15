import rss from '@astrojs/rss';
import { site } from '../config';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { isPublished } from '@scripts/isPublished';

export const GET: APIRoute = async () => {
  let collection = await getCollection('pages');

  if (import.meta.env.PROD) {
    collection = collection.filter((entry) => isPublished(entry.data?.status));
  }

  const entries = collection.map((entry) => {
    const item: {
      title: string;
      description?: string;
      link: string;
      content?: string;
      pubDate?: Date;
    } = {
      title: entry.data.title,
      description: entry.data.description,
      link: entry.id === 'index' ? '/' : `/${entry.id}`,
      content: entry.rendered?.html,
    };

    if (entry.data.date) {
      item.pubDate = entry.data.date;
    }

    return item;
  });

  return rss({
    title: site.title,
    description: site.description,
    site: site.url,
    items: entries,
  });
};
