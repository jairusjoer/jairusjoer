import Badge from './badge';
import { useEffect, useState } from 'react';

export interface Props {
  src: string;
}

export interface Item {
  title: string;
  link: string;
  pubDate: string;
  isoDate: string;
  content: string;
  categories: Array<string>;
}

const rssToJson = (rss: string): Array<Item> => {
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

const Error = () => (
  <div className="rounded-inner bg-danger-background px-4 leading-12">
    <span className="text-danger-foreground font-medium">Failed to fetch RSS feed…</span>
  </div>
);

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

const Feed = ({ src }: Props) => {
  const [feed, setFeed] = useState<Array<Item>>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const retrieve = async () => {
      const proxy = (url: string) => `https://corsproxy.io/?url=${url}`;

      try {
        const response = await (await fetch(proxy(src))).text();
        setFeed(rssToJson(response));
      } catch (error) {
        setError(true);
      }
    };

    retrieve();
  }, []);

  const render = () => {
    if (error) {
      return <Error />;
    }

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

  return (
    <>
      <a
        className="bg-background-subtle rounded-inner text-foreground mb-4 block px-4 py-3"
        href="https://aggregata.de/authors/jairusjoer/"
        target="_blank"
      >
        <span>For all articles by yours truly, visit Aggregata</span>
      </a>
      {render()}
    </>
  );
};

export default Feed;
