import { test, expect } from '../fixtures/baseTest';
import { CartPage } from '../pages/CartPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import { buildUserCredentials } from '../utils/testData';

test.describe('Sauce Demo cart', () => {
  test.beforeEach(async ({ page, environment }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const credentials = buildUserCredentials(environment);

    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);
    await inventoryPage.expectLoaded();
  });

  test('shows selected product in cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();

    await cartPage.expectLoaded();
    await cartPage.expectProductInCart('Sauce Labs Backpack');
  });

  test('removes a product from cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await cartPage.expectLoaded();

    await cartPage.removeProduct('Sauce Labs Backpack');
    await cartPage.expectProductNotInCart('Sauce Labs Backpack');
  });

  test('returns to inventory from cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.openCart();
    await cartPage.expectLoaded();
    await cartPage.continueShopping();

    await expect(page).toHaveURL(/\/inventory\.html$/);
  });
});
