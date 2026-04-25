import { test, expect } from '../fixtures/baseTest';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import { buildUserCredentials } from '../utils/testData';

test.describe('Sauce Demo login flow', () => {
  test('allows a standard user to sign in', async ({ page, environment, agentContext }, testInfo) => {
    testInfo.annotations.push({
      type: 'agent-context',
      description: JSON.stringify(agentContext)
    });

    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.expectLoaded();

    const credentials = buildUserCredentials(environment);
    await loginPage.login(credentials.username, credentials.password);

    await inventoryPage.expectLoaded();
  });

  test('requires username and password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.expectLoaded();
    await loginPage.submit();
    await loginPage.expectLoginError('Epic sadface: Username is required');

    await loginPage.login('standard_user', '');
    await loginPage.expectLoginError('Epic sadface: Password is required');
  });

  test('rejects invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('invalid_user', 'invalid_password');
    await loginPage.expectLoginError(/Username and password do not match/i);
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
  });
});
