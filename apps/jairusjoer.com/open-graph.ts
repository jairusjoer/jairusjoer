import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { site } from './src/config.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rssPath = path.join(__dirname, 'dist', 'rss.xml');
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

    await page.goto(`http://localhost:4321/open-graph?title=${encodeURIComponent(entry.title)}`);
    await page.screenshot({ path: `public/og/${entry.id}.png` });
    await page.close();

    console.log(`[✓]`, entry.id);
  }
} finally {
  await browser.close();
}
