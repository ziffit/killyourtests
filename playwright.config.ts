import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  testDir: './tests',
  testMatch: '**/*.test.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
    // Fast feedback during development: hanging locators fail after 8s instead of eating the test timeout.
    // 8s because after closing both banners the overlay blocks clicks for ~5s.
    actionTimeout: 8000,
    launchOptions: {
      slowMo: parseInt(process.env.SLOW_MO || '0'),
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
