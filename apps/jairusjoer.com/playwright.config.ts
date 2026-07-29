import { defineConfig } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
  testDir: './tests',
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
  },
  webServer: {
    command: 'pnpm build && pnpm preview',
    reuseExistingServer: !process.env.CI,
    url: 'http://localhost:4321',
  },
});
