import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Sauce Demo exposes stable data-test attributes; Playwright is configured to use data-test for getByTestId.
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.submitButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/Swag Labs/i);
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeEnabled();
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async expectLoginError(expectedMessage?: string | RegExp): Promise<void> {
    await expect(this.errorMessage.first()).toBeVisible();

    if (expectedMessage) {
      await expect(this.errorMessage.first()).toContainText(expectedMessage);
    }
  }
}
