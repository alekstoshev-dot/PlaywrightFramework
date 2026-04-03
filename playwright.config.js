const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Test folder
  testDir: './tests',

  // Parallel test execution
  fullyParallel: true,

  // Forbid only tests
  forbidOnly: !!process.env.CI,

  // number of retries in case of failure (2 for CI, 0 for local) 
  retries: process.env.CI ? 2 : 0,

  // number of worker processes (parallel processes)
  workers: process.env.CI ? 1 : undefined,

  // Reporter for the results
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],

  use: {
    // Base URL
    baseURL: 'https://jackentertainment.lv-dev.gameaccount.com/',

    // Log
    trace: 'on-first-retry',

    // Screenshots on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Headless mode
    headless: false,

    // забавя действията за да се вижда
    slowMo: 500,

  },

  // Browser configurations
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // // Mobile browsers
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],
});