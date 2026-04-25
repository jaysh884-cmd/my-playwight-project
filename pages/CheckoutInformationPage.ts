import { expect, type Locator, type Page } from '@playwright/test';

export type CheckoutCustomer = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export class CheckoutInformationPage {
  private readonly page: Page;
  private readonly pageTitle: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByTestId('title');
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByTestId('cancel');
    this.errorMessage = page.getByTestId('error');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(this.pageTitle).toHaveText('Checkout: Your Information');
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.postalCodeInput).toBeVisible();
  }

  async fillCustomerInformation(customer: Partial<CheckoutCustomer>): Promise<void> {
    if (customer.firstName !== undefined) {
      await this.firstNameInput.fill(customer.firstName);
    }

    if (customer.lastName !== undefined) {
      await this.lastNameInput.fill(customer.lastName);
    }

    if (customer.postalCode !== undefined) {
      await this.postalCodeInput.fill(customer.postalCode);
    }
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async expectError(expectedMessage: string | RegExp): Promise<void> {
    await expect(this.errorMessage).toContainText(expectedMessage);
  }
}
