import { mkdir, readdir, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { page as site } from '../src/config.ts';

const previewOrigin = 'http://localhost:4321';

const distFiles = await readdir('dist', { recursive: true, withFileTypes: true });

const entries = (
  await Promise.all(
    distFiles
      .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
      .map(async (entry) => {
        const file = path.relative('dist', path.join(entry.parentPath, entry.name));
        const id = file === 'index.html' ? 'index' : file.replace(/\/index\.html$/, '').replace(/\.html$/, '');

        if (['404', 'open-graph'].includes(id)) return null;

        const html = await readFile(path.join(entry.parentPath, entry.name), 'utf-8');
        const title = html
          .match(/<title>(.*?)<\/title>/s)?.[1]
          ?.replace(` • ${site.title}`, '')
          .trim();

        if (!title) return null;

        return { id, title };
      }),
  )
).filter((entry) => entry !== null);

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
