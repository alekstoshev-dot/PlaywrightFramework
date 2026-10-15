import { expect, test } from '@playwright/test';
import type { Browser } from 'webdriverio';
import type { Product, Shop } from '../../contracts/Shop';
export interface ShopSelectors {
  catalog: string;
  product: (product: Product) => string;
  revealProduct?: (product: Product) => string;
  add: string;
  cart: string;
  cartScreen: string;
  cartRows: string;
  cartProduct: (product: Product) => string;
  remove: (product: Product) => string;
  emptyCart: string;
  catalogNavigation?: string;
  startupDialog?: { title: string; dismiss: string };
}
export class MobileShop implements Shop {
  constructor(
    private readonly driver: Browser,
    private readonly selectors: ShopSelectors,
  ) {}
  private async click(selector: string) {
    await test.step(`Click native element: ${selector}`, async () => {
      const element = await test.step(`Find element: ${selector}`, () => this.driver.$(selector));
      await test.step('Wait for element to be displayed (timeout 15000 ms)', () =>
        element.waitForDisplayed({ timeout: 15000 }));
      await test.step('Tap element', () => element.click());
    });
  }
  async open() {
    await expect
      .poll(
        async () => {
          const dialog = this.selectors.startupDialog;
          if (dialog && (await (await this.driver.$(dialog.title)).isDisplayed())) {
            await test.step('Dismiss Android compatibility warning', () =>
              this.click(dialog.dismiss));
            await (
              await this.driver.$(dialog.title)
            ).waitForDisplayed({
              reverse: true,
              timeout: 5000,
            });
          }
          return (await this.driver.$(this.selectors.catalog)).isDisplayed();
        },
        { message: 'Catalog is ready after optional startup dialog', timeout: 30000 },
      )
      .toBe(true);
  }
  async addProduct(product: Product) {
    if (this.selectors.revealProduct) {
      await test.step(`Reveal catalog product: ${product.name}`, async () => {
        await (
          await this.driver.$(this.selectors.revealProduct!(product))
        ).waitForDisplayed({ timeout: 15000 });
      });
    }
    await this.click(this.selectors.product(product));
    await this.click(this.selectors.add);
    // Return to the catalog so another product can be added using the same business step.
    if (this.selectors.catalogNavigation) await this.click(this.selectors.catalogNavigation);
    else await test.step('Navigate back to the catalog', () => this.driver.back());
    await this.open();
  }
  async openCart() {
    await this.click(this.selectors.cart);
  }
  async removeProduct(product: Product) {
    await this.click(this.selectors.remove(product));
  }
  async expectCartProducts(products: readonly Product[]) {
    if (!products.length) {
      await (await this.driver.$(this.selectors.emptyCart)).waitForDisplayed({ timeout: 15000 });
    } else {
      await (await this.driver.$(this.selectors.cartScreen)).waitForDisplayed({ timeout: 15000 });
      for (const product of products) {
        await (
          await this.driver.$(this.selectors.cartProduct(product))
        ).waitForDisplayed({ timeout: 15000 });
      }
    }
    await expect
      .poll(async () => (await this.driver.$$(this.selectors.cartRows)).length, {
        message: 'Cart must contain exactly the expected product rows',
        timeout: 15000,
      })
      .toBe(products.length);
  }
}
