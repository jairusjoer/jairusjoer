import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const previewOrigin = 'http://localhost:4321';

const rssUrl = `${previewOrigin}/rss.xml`;
const rssResponse = await fetch(rssUrl);

if (!rssResponse.ok) {
  throw new Error(`Unable to read RSS feed from ${rssUrl}: ${rssResponse.status} ${rssResponse.statusText}`);
}

const rss = await rssResponse.text();

const regex = /<title>\s*(?<title>[^<]+?)\s*<\/title>[\s\S]*?<link>\s*(?<link>[^<]+?)\s*<\/link>/g;

const entries = [...rss.matchAll(regex)].map((item) => {
  const { title, link } = item.groups as { title: string; link: string };
  const id = new URL(link).pathname.replace(/^\/|\/$/g, '');

  return { id: id === '' ? 'index' : id, title, link };
});

const browser = await chromium.launch({ headless: true });

try {
  for (const entry of entries) {
    let page;

    try {
      page = await browser.newPage({
        viewport: {
          width: 1200,
          height: 630,
        },
      });

      await page.goto(`${previewOrigin}/open-graph?title=${encodeURIComponent(entry.title)}`, {
        waitUntil: 'load',
      });

      const openGraphCanvas = page.locator('.open-graph');
      await page.waitForSelector('.open-graph-title:not(:empty)');

      const screenshotPath = `public/og/${entry.id}.png`;

      await mkdir(path.dirname(screenshotPath), { recursive: true });
      await openGraphCanvas.screenshot({ path: screenshotPath });

      console.log(`[✓]`, entry.id);
    } catch (error) {
      console.error(`[✗]`, entry.id, error);
    } finally {
      if (page) {
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}
