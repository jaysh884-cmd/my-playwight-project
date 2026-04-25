import { test } from '../fixtures/baseTest';
import { CartPage } from '../pages/CartPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { CheckoutInformationPage } from '../pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import { buildUserCredentials, getTestData } from '../utils/testData';

test.describe('Sauce Demo checkout', () => {
  test.beforeEach(async ({ page, environment }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const credentials = buildUserCredentials(environment);
    const testData = getTestData(environment);

    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);
    await inventoryPage.expectLoaded();
    await inventoryPage.addProductToCart(testData.products.backpack.name);
    await inventoryPage.openCart();
    await cartPage.expectLoaded();
    await cartPage.checkout();
  });

  test('validates required checkout information fields', async ({ page, environment }) => {
    const checkoutInformationPage = new CheckoutInformationPage(page);
    const testData = getTestData(environment);
    const checkoutCustomer = testData.checkout.defaultCustomer;

    await checkoutInformationPage.expectLoaded();
    await checkoutInformationPage.continue();
    await checkoutInformationPage.expectError(testData.checkout.errors.firstNameRequired);

    await checkoutInformationPage.fillCustomerInformation({ firstName: checkoutCustomer.firstName });
    await checkoutInformationPage.continue();
    await checkoutInformationPage.expectError(testData.checkout.errors.lastNameRequired);

    await checkoutInformationPage.fillCustomerInformation({ lastName: checkoutCustomer.lastName });
    await checkoutInformationPage.continue();
    await checkoutInformationPage.expectError(testData.checkout.errors.postalCodeRequired);
  });

  test('completes an end-to-end order', async ({ page, environment }) => {
    const checkoutInformationPage = new CheckoutInformationPage(page);
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    const checkoutCompletePage = new CheckoutCompletePage(page);
    const inventoryPage = new InventoryPage(page);
    const testData = getTestData(environment);
    const checkoutCustomer = testData.checkout.defaultCustomer;
    const product = testData.products.backpack;
    const summary = testData.checkout.expectedBackpackSummary;

    await checkoutInformationPage.expectLoaded();
    await checkoutInformationPage.fillCustomerInformation(checkoutCustomer);
    await checkoutInformationPage.continue();

    await checkoutOverviewPage.expectLoaded();
    await checkoutOverviewPage.expectProductVisible(product.name);
    await checkoutOverviewPage.expectSummary(summary.itemTotal, summary.tax, summary.total);
    await checkoutOverviewPage.finish();

    await checkoutCompletePage.expectLoaded();
    await checkoutCompletePage.backHome();
    await inventoryPage.expectLoaded();
  });

  test('cancels checkout from overview', async ({ page, environment }) => {
    const checkoutInformationPage = new CheckoutInformationPage(page);
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    const inventoryPage = new InventoryPage(page);
    const testData = getTestData(environment);
    const checkoutCustomer = testData.checkout.defaultCustomer;

    await checkoutInformationPage.expectLoaded();
    await checkoutInformationPage.fillCustomerInformation(checkoutCustomer);
    await checkoutInformationPage.continue();

    await checkoutOverviewPage.expectLoaded();
    await checkoutOverviewPage.cancel();
    await inventoryPage.expectLoaded();
  });
});
