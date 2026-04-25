import { test, expect } from '../fixtures/baseTest';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import {
  sortNumbersAscending,
  sortNumbersDescending,
  sortStringsAscending,
  sortStringsDescending
} from '../utils/arrayHelpers';
import { buildUserCredentials, getTestData } from '../utils/testData';

test.describe('Sauce Demo inventory', () => {
  test.beforeEach(async ({ page, environment }) => {
    const loginPage = new LoginPage(page);
    const credentials = buildUserCredentials(environment);

    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);
  });

  test('shows all expected products with prices', async ({ page, environment }) => {
    const inventoryPage = new InventoryPage(page);
    const testData = getTestData(environment);

    await inventoryPage.expectLoaded();
    await inventoryPage.expectProductCount(testData.products.all.length);

    for (const product of testData.products.all) {
      await inventoryPage.expectProductVisible(product.name, product.price);
    }
  });

  test('sorts products by name and price', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.expectLoaded();

    await inventoryPage.selectSortOption('az');
    let productNames = await inventoryPage.getProductNames();
    expect(productNames).toEqual(sortStringsAscending(productNames));

    await inventoryPage.selectSortOption('za');
    productNames = await inventoryPage.getProductNames();
    expect(productNames).toEqual(sortStringsDescending(productNames));

    await inventoryPage.selectSortOption('lohi');
    let productPrices = await inventoryPage.getProductPrices();
    expect(productPrices).toEqual(sortNumbersAscending(productPrices));

    await inventoryPage.selectSortOption('hilo');
    productPrices = await inventoryPage.getProductPrices();
    expect(productPrices).toEqual(sortNumbersDescending(productPrices));
  });

  test('adds and removes a product from the listing page', async ({ page, environment }) => {
    const inventoryPage = new InventoryPage(page);
    const testData = getTestData(environment);
    const product = testData.products.backpack;

    await inventoryPage.expectLoaded();
    await inventoryPage.addProductToCart(product.name);
    await inventoryPage.expectCartBadgeCount(1);

    await inventoryPage.removeProductFromCart(product.name);
    await inventoryPage.expectCartBadgeHidden();
  });
});
