import { redact } from '../reporting/redact';
import { getWebAuth } from '../config/environment';
import { test as base } from '@playwright/test';
import { remote, type Browser } from 'webdriverio';
import type { Shop } from '../contracts/Shop';
import { WebShop } from '../platforms/web/WebShop';
import { MobileShop } from '../platforms/mobile/MobileShop';
import { androidSelectors } from '../platforms/android/selectors';
import { iosSelectors } from '../platforms/ios/selectors';
export const test = base.extend<{ shop: Shop }>({
  shop: async ({ browserName, headless, launchOptions }, use, info) => {
    const platform = info.project.name;
    if (platform === 'web') {
      const auth = getWebAuth();
      // Browser fixtures are created only for web; mobile runs need no Playwright browser.
      const { chromium, firefox, webkit } = await import('@playwright/test');
      const browser = await { chromium, firefox, webkit }[browserName].launch({
        ...launchOptions,
        headless,
      });
      const context = await browser.newContext({ baseURL: auth.baseURL });
      const page = await context.newPage();
      try {
        await use(new WebShop(page, auth));
      } finally {
        try {
          if (info.status !== info.expectedStatus) {
            await info.attach('screenshot', {
              body: await page.screenshot(),
              contentType: 'image/png',
            });
          }
        } finally {
          await browser.close();
        }
      }
      return;
    }
    if (platform !== 'android' && platform !== 'ios')
      throw new Error(`Unsupported platform: ${platform}`);
    const app = process.env[platform === 'android' ? 'ANDROID_APP' : 'IOS_APP'];
    if (!app)
      throw new Error(
        `Set ${platform === 'android' ? 'ANDROID_APP' : 'IOS_APP'} to an absolute app path on the Appium host.`,
      );
    const url = new URL(process.env.APPIUM_URL || 'http://127.0.0.1:4723');
    const driver: Browser = await remote({
      hostname: url.hostname,
      port: Number(url.port || (url.protocol === 'https:' ? 443 : 80)),
      protocol: url.protocol === 'https:' ? 'https' : 'http',
      path: url.pathname,
      connectionRetryCount: 0,
      logLevel: 'warn',
      capabilities: {
        platformName: platform === 'android' ? 'Android' : 'iOS',
        'appium:automationName': platform === 'android' ? 'UiAutomator2' : 'XCUITest',
        'appium:app': app,
        'appium:fullReset': true,
        'appium:deviceName':
          process.env[platform === 'android' ? 'ANDROID_DEVICE_NAME' : 'IOS_DEVICE_NAME'] ||
          (platform === 'android' ? 'Android Emulator' : 'iPhone 16'),
        ...(process.env.MOBILE_UDID ? { 'appium:udid': process.env.MOBILE_UDID } : {}),
        ...(process.env.MOBILE_PLATFORM_VERSION
          ? { 'appium:platformVersion': process.env.MOBILE_PLATFORM_VERSION }
          : {}),
      },
    });
    try {
      await use(new MobileShop(driver, platform === 'android' ? androidSelectors : iosSelectors));
    } finally {
      const alreadyFailed = info.status !== info.expectedStatus;
      const diagnostics: string[] = [];
      if (alreadyFailed) {
        for (const [name, collect] of [
          [
            'screenshot',
            async () =>
              info.attach('screenshot', {
                body: Buffer.from(await driver.takeScreenshot(), 'base64'),
                contentType: 'image/png',
              }),
          ],
          [
            'page-source',
            async () =>
              info.attach('page-source', {
                body: await driver.getPageSource(),
                contentType: 'application/xml',
              }),
          ],
        ] as const) {
          try {
            await test.step(`Collect native ${name}`, collect);
          } catch (error) {
            diagnostics.push(redact(`${name}: ${String(error)}`));
          }
        }
      }
      try {
        await test.step('Close native session', () => driver.deleteSession());
      } catch (error) {
        if (!alreadyFailed) throw error;
        diagnostics.push(redact(`session cleanup: ${String(error)}`));
      }
      if (diagnostics.length) {
        console.warn(diagnostics.join('\n'));
        await info.attach('diagnostic-errors', {
          body: diagnostics.join('\n'),
          contentType: 'text/plain',
        });
      }
    }
  },
});
