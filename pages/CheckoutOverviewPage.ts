import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutOverviewPage {
  private readonly page: Page;
  private readonly pageTitle: Locator;
  private readonly inventoryItems: Locator;
  private readonly subtotalLabel: Locator;
  private readonly taxLabel: Locator;
  private readonly totalLabel: Locator;
  private readonly finishButton: Locator;
  private readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByTestId('title');
    this.inventoryItems = page.getByTestId('inventory-item');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    this.cancelButton = page.getByTestId('cancel');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
  }

  async expectProductVisible(productName: string): Promise<void> {
    await expect(this.inventoryItems.filter({ hasText: productName })).toBeVisible();
  }

  async expectSummary(itemTotal: string, tax: string, total: string): Promise<void> {
    await expect(this.subtotalLabel).toHaveText(`Item total: ${itemTotal}`);
    await expect(this.taxLabel).toHaveText(`Tax: ${tax}`);
    await expect(this.totalLabel).toHaveText(`Total: ${total}`);
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
