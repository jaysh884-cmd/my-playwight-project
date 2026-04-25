import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  private readonly page: Page;
  private readonly pageTitle: Locator;
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByTestId('title');
    this.cartItems = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/cart\.html$/);
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  async expectProductInCart(productName: string): Promise<void> {
    await expect(this.cartItems.filter({ hasText: productName })).toBeVisible();
  }

  async expectProductNotInCart(productName: string): Promise<void> {
    await expect(this.cartItems.filter({ hasText: productName })).toHaveCount(0);
  }

  async removeProduct(productName: string): Promise<void> {
    const cartItem = this.cartItems.filter({ hasText: productName });

    await expect(cartItem).toBeVisible();
    await cartItem.getByRole('button', { name: /remove/i }).click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
