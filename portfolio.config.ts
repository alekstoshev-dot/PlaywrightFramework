import './src/config/environment';
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/portfolio',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 90000,
  reporter: [
    ['./src/reporting/VerboseReporter.ts'],
    ['allure-playwright', { resultsDir: 'allure-results', detail: true }],
    ['list'],
    ['html', { outputFolder: 'portfolio-report', open: 'never' }],
  ],
  outputDir: 'portfolio-results',
  use: {
    baseURL: process.env.WEB_BASE_URL,
    headless: true,
    launchOptions: { slowMo: process.env.CI ? 0 : 400 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'web', testMatch: '**/shared/**/*.spec.ts', use: { browserName: 'chromium' } },
    { name: 'api', testMatch: '**/api/**/*.spec.ts' },
    { name: 'android', testMatch: '**/shared/**/*.spec.ts', workers: 1 },
    { name: 'ios', testMatch: '**/shared/**/*.spec.ts', workers: 1 },
  ],
});
