import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { defaultMetadata } from '../constants';

export async function GET(context) {
  const blog = await getCollection('blog');

  return rss({
    title: defaultMetadata.title,
    description: defaultMetadata.description,
    site: context.site,
    items: blog.map((entry) => ({
      ...entry.data,
      link: `/${entry.id}/`,
    })),
  });
}
