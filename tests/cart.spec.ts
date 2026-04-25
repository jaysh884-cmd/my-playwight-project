import { test, expect } from '../fixtures/baseTest';
import { CartPage } from '../pages/CartPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import { buildUserCredentials, getTestData } from '../utils/testData';

test.describe('Sauce Demo cart', () => {
  test.beforeEach(async ({ page, environment }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const credentials = buildUserCredentials(environment);

    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);
    await inventoryPage.expectLoaded();
  });

  test('shows selected product in cart', async ({ page, environment }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const testData = getTestData(environment);
    const product = testData.products.backpack;

    await inventoryPage.addProductToCart(product.name);
    await inventoryPage.openCart();

    await cartPage.expectLoaded();
    await cartPage.expectProductInCart(product.name);
  });

  test('removes a product from cart', async ({ page, environment }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const testData = getTestData(environment);
    const product = testData.products.backpack;

    await inventoryPage.addProductToCart(product.name);
    await inventoryPage.openCart();
    await cartPage.expectLoaded();

    await cartPage.removeProduct(product.name);
    await cartPage.expectProductNotInCart(product.name);
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
