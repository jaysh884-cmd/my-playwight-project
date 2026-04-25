import { expect, type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  private readonly page: Page;
  private readonly pageTitle: Locator;
  private readonly inventoryItems: Locator;
  private readonly cartLink: Locator;
  private readonly sortDropdown: Locator;
  private readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByTestId('title');
    this.inventoryItems = page.getByTestId('inventory-item');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/inventory\.html$/);
    await expect(this.pageTitle).toHaveText('Products');
    await expect(this.inventoryItems.first()).toBeVisible();
  }

  async addProductToCart(productName: string): Promise<void> {
    const productCard = this.inventoryItems.filter({ hasText: productName });

    await expect(productCard).toBeVisible();
    await productCard.getByRole('button', { name: /add to cart/i }).click();
  }

  async removeProductFromCart(productName: string): Promise<void> {
    const productCard = this.inventoryItems.filter({ hasText: productName });

    await expect(productCard).toBeVisible();
    await productCard.getByRole('button', { name: /remove/i }).click();
  }

  async selectSortOption(optionValue: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(optionValue);
  }

  async getProductNames(): Promise<string[]> {
    return this.inventoryItems.getByTestId('inventory-item-name').allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const prices = await this.inventoryItems.getByTestId('inventory-item-price').allTextContents();

    return prices.map((price) => Number(price.replace('$', '')));
  }

  async expectProductCount(expectedCount: number): Promise<void> {
    await expect(this.inventoryItems).toHaveCount(expectedCount);
  }

  async expectProductVisible(productName: string, productPrice: string): Promise<void> {
    const productCard = this.inventoryItems.filter({ hasText: productName });

    await expect(productCard).toBeVisible();
    await expect(productCard.getByTestId('inventory-item-price')).toHaveText(productPrice);
  }

  async expectCartBadgeCount(expectedCount: number): Promise<void> {
    await expect(this.cartBadge).toHaveText(String(expectedCount));
  }

  async expectCartBadgeHidden(): Promise<void> {
    await expect(this.cartBadge).toHaveCount(0);
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
