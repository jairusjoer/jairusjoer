import { getCollection, type CollectionEntry } from 'astro:content';
import { isPublished } from './isPublished';

export async function getPublishedPages(filter?: string): Promise<CollectionEntry<'pages'>[]> {
  let collection = await getCollection('pages', ({ id }) => {
    if (id.endsWith('index')) return false;
    return filter ? id.startsWith(filter.toLowerCase()) : true;
  });

  collection = collection.sort((a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0));

  if (import.meta.env.PROD) {
    collection = collection.filter((entry) => isPublished(entry.data?.status));
  }

  return collection;
}
