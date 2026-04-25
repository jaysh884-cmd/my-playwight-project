import { test } from '../fixtures/baseTest';
import { CartPage } from '../pages/CartPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { CheckoutInformationPage } from '../pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import { buildUserCredentials } from '../utils/testData';

const checkoutCustomer = {
  firstName: 'QA',
  lastName: 'Agent',
  postalCode: '12345'
};

test.describe('Sauce Demo checkout', () => {
  test.beforeEach(async ({ page, environment }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const credentials = buildUserCredentials(environment);

    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);
    await inventoryPage.expectLoaded();
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await cartPage.expectLoaded();
    await cartPage.checkout();
  });

  test('validates required checkout information fields', async ({ page }) => {
    const checkoutInformationPage = new CheckoutInformationPage(page);

    await checkoutInformationPage.expectLoaded();
    await checkoutInformationPage.continue();
    await checkoutInformationPage.expectError('Error: First Name is required');

    await checkoutInformationPage.fillCustomerInformation({ firstName: checkoutCustomer.firstName });
    await checkoutInformationPage.continue();
    await checkoutInformationPage.expectError('Error: Last Name is required');

    await checkoutInformationPage.fillCustomerInformation({ lastName: checkoutCustomer.lastName });
    await checkoutInformationPage.continue();
    await checkoutInformationPage.expectError('Error: Postal Code is required');
  });

  test('completes an end-to-end order', async ({ page }) => {
    const checkoutInformationPage = new CheckoutInformationPage(page);
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    const checkoutCompletePage = new CheckoutCompletePage(page);
    const inventoryPage = new InventoryPage(page);

    await checkoutInformationPage.expectLoaded();
    await checkoutInformationPage.fillCustomerInformation(checkoutCustomer);
    await checkoutInformationPage.continue();

    await checkoutOverviewPage.expectLoaded();
    await checkoutOverviewPage.expectProductVisible('Sauce Labs Backpack');
    await checkoutOverviewPage.expectSummary('$29.99', '$2.40', '$32.39');
    await checkoutOverviewPage.finish();

    await checkoutCompletePage.expectLoaded();
    await checkoutCompletePage.backHome();
    await inventoryPage.expectLoaded();
  });

  test('cancels checkout from overview', async ({ page }) => {
    const checkoutInformationPage = new CheckoutInformationPage(page);
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    const inventoryPage = new InventoryPage(page);

    await checkoutInformationPage.expectLoaded();
    await checkoutInformationPage.fillCustomerInformation(checkoutCustomer);
    await checkoutInformationPage.continue();

    await checkoutOverviewPage.expectLoaded();
    await checkoutOverviewPage.cancel();
    await inventoryPage.expectLoaded();
  });
});
