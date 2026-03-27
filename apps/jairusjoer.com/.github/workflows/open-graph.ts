import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { site } from '../../src/config.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const previewOrigin = 'http://127.0.0.1:4321';

const rssPath = path.join(__dirname, '..', '..', 'dist', 'rss.xml');
const rss = await readFile(rssPath, 'utf-8');

const regex = /<title>\s*(?<title>[^<]+?)\s*<\/title>[\s\S]*?<link>\s*(?<link>[^<]+?)\s*<\/link>/g;

const entries = [...rss.matchAll(regex)].map((item) => {
  const { title, link } = item.groups as { title: string; link: string };
  const id = link.replace(site.url, '').replace(/^\/|\/$/g, '');

  return { id: id === '' ? 'index' : id, title, link };
});

const browser = await chromium.launch({ headless: true });

try {
  for (const entry of entries) {
    const page = await browser.newPage({
      viewport: {
        width: 1200,
        height: 630,
      },
    });

    await page.goto(`${previewOrigin}/open-graph?title=${encodeURIComponent(entry.title)}`, {
      waitUntil: 'load',
    });

    await page.waitForSelector('.open-graph-title:not(:empty)');

    const screenshotPath = `public/og/${entry.id}.png`;

    await mkdir(path.dirname(screenshotPath), { recursive: true });
    await page.screenshot({ path: screenshotPath });
    await page.close();

    console.log(`[✓]`, entry.id);
  }
} finally {
  await browser.close();
}
