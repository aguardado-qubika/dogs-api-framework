import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: './global-setup',
  globalTeardown: './global-teardown',
  testDir: './tests',
  fullyParallel: false,        // API tests share server state — run serially
  forbidOnly: !!process.env.CI,
  retries: 0,                  // Pure executor: no retries, fail fast
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: 'http://localhost:3001',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },
  webServer: {
    command: 'npm run serve',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 10_000,
  },

});