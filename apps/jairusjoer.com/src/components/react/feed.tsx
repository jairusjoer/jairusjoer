import Badge from './badge';
import { useEffect, useState } from 'react';

export interface Item {
  title: string;
  link: string;
  pubDate: string;
  isoDate: string;
  content: string;
  categories: Array<string>;
}

export const rssToJson = (rss: string): Array<Item> => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(rss, 'application/xml');

  return Array.from(xml.querySelectorAll('item')).map(
    (item) =>
      ({
        title: item.querySelector('title')?.textContent,
        link: item.querySelector('link')?.textContent,
        pubDate: item.querySelector('pubDate')?.textContent,
        isoDate: item.querySelector('isoDate')?.textContent,
        content: item.querySelector('description')?.textContent,
        categories: Array.from(item.querySelectorAll('category')).map((category) => category.textContent),
      }) as Item,
  );
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const Skeleton = () => (
  <div className="rounded-inner flex animate-pulse flex-col border p-4">
    <div className="bg-background-subtle rounded-inner my-1 h-4 w-80" />
    <div className="bg-background-subtle rounded-inner my-1 h-4 w-40" />
    <div className="bg-background-subtle rounded-inner my-4 h-6 w-60" />
    <div className="bg-background-subtle rounded-inner h-12 w-full" />
  </div>
);

const Item = (item: Item) => (
  <article className="not-prose rounded-inner relative border p-4">
    <h2 className="text-foreground block font-medium">{item.title}</h2>
    <time
      className="mb-4 block"
      dateTime={item.isoDate}
    >
      {formatDate(String(item.pubDate))}
    </time>
    {item.categories.length > 0 && (
      <div className="mb-4 flex flex-wrap gap-1">
        {item.categories?.map((category, index) => (
          <Badge
            key={index}
            label={category}
          />
        ))}
      </div>
    )}
    <p>{item.content}</p>
    <a
      className="rounded-inner absolute inset-0"
      href={item.link}
      target="_blank"
      title={item.title}
      aria-label={item.title}
    ></a>
  </article>
);

export interface Props {
  src: string;
}

const Feed = ({ src }: Props) => {
  const [feed, setFeed] = useState<Array<Item>>([]);

  useEffect(() => {
    const retrieve = async () => {
      const proxy = 'https://cors-anywhere.com/';
      const response = await (await fetch(proxy + src)).text();

      setFeed(rssToJson(response));
    };

    retrieve();
  }, []);

  const render = () => {
    if (!feed.length)
      return (
        <div className="space-y-4">
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      );

    return (
      <div className="space-y-4">
        {feed.map((item, index) => (
          <Item
            key={index}
            {...item}
          />
        ))}
      </div>
    );
  };

  return <>{render()}</>;
};

export default Feed;
