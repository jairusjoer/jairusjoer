import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const previewOrigin = 'http://localhost:4321';

const rssUrl = `${previewOrigin}/rss.xml`;
const rssResponse = await fetch(rssUrl);

if (!rssResponse.ok) {
  throw new Error(`Unable to read RSS feed from ${rssUrl}: ${rssResponse.status} ${rssResponse.statusText}`);
}

const rssFeed = await rssResponse.text();
const rssRegex = /<title>\s*(?<title>[^<]+?)\s*<\/title>[\s\S]*?<link>\s*(?<link>[^<]+?)\s*<\/link>/g;

const entries = [...rssFeed.matchAll(rssRegex)].map((item) => {
  const { title, link } = item.groups as { title: string; link: string };
  const id = new URL(link).pathname.replace(/^\/|\/$/g, '');

  return { id: id === '' ? 'index' : id, title };
});

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: {
    width: 1200,
    height: 630,
  },
});

await rm('public/og', { recursive: true, force: true });

for (const entry of entries) {
  const page = await context.newPage();

  try {
    await page.goto(`${previewOrigin}/open-graph?title=${encodeURIComponent(entry.title)}`, {
      waitUntil: 'load',
    });

    const canvas = page.locator('.open-graph');
    await page.waitForSelector('.open-graph-title:not(:empty)');

    const screenshot = `public/og/${entry.id}.png`;

    await mkdir(path.dirname(screenshot), { recursive: true });
    await canvas.screenshot({ path: screenshot });

    console.log(`✓`, entry.id);
  } catch (error) {
    console.error(`✗`, entry.id, error);
  } finally {
    await page.close();
  }
}

await browser.close();
