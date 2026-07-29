import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { site } from '../src/config';

test.describe('', () => {
  const sitemapPath = resolve(process.cwd(), 'dist/sitemap-0.xml');
  const sitemapContent = readFileSync(sitemapPath, 'utf-8');

  const urlRegex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
  const urls = [...sitemapContent.matchAll(urlRegex)].map((url) => {
    return url[1].replace(site.url, '');
  });

  for (const url of urls) {
    test(url, async ({ page }) => {
      await page.goto(url);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();

      expect(results.violations.length, JSON.stringify(results.violations, null, 2)).toBe(0);
    });
  }
});
