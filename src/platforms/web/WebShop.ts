import { expect, type Page } from '@playwright/test';
import type { Product, Shop } from '../../contracts/Shop';
export class WebShop implements Shop {
  constructor(
    private readonly page: Page,
    private readonly auth: { username: string; password: string },
  ) {}
  async open() {
    await this.page.goto('/');
    await this.page.locator('[data-test="username"]').fill(this.auth.username);
    await this.page.locator('[data-test="password"]').fill(this.auth.password);
    await this.page.locator('[data-test="login-button"]').click();
    await expect(this.page.locator('[data-test="inventory-container"]')).toBeVisible();
  }
  async addProduct(product: Product) {
    await this.page.locator(`[data-test="add-to-cart-${product.id}"]`).click();
    await expect(this.page.locator(`[data-test="remove-${product.id}"]`)).toBeVisible();
  }
  async openCart() {
    await this.page.locator('[data-test="shopping-cart-link"]').click();
    await expect(this.page.locator('[data-test="cart-list"]')).toBeVisible();
  }
  async removeProduct(product: Product) {
    await this.page.locator(`[data-test="remove-${product.id}"]`).click();
  }
  async expectCartProducts(products: readonly Product[]) {
    const rows = this.page.locator('[data-test="inventory-item"]');
    await expect(rows).toHaveCount(products.length);
    for (const product of products) {
      const row = rows.filter({ has: this.page.getByText(product.name, { exact: true }) });
      await expect(row).toHaveCount(1);
      await expect(row.locator('[data-test="item-quantity"]')).toHaveText('1');
    }
  }
}
