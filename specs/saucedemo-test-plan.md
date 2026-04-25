# Sauce Demo Test Plan

## Scope

This plan covers the core Sauce Demo buyer journey:

- Login
- Product listing and sorting
- Cart management
- Checkout information
- Checkout overview
- Order completion

Exploration was performed against `https://www.saucedemo.com`. No local `.env` file was present in the workspace during exploration, so the framework fallback credentials from `config/environment.ts` were used.

## Test Data

Use credentials from environment configuration:

- `LOGIN_USERNAME` from `.env` or fallback `standard_user`
- `LOGIN_PASSWORD` from `.env` or fallback configured password

Do not hard-code secrets in tests. Read credentials through `environment` from `fixtures/baseTest`.

## Locator Strategy

Sauce Demo exposes stable `data-test` attributes. Use Playwright `getByTestId` because `playwright.config.ts` sets:

```ts
testIdAttribute: 'data-test'
```

Prefer:

- `page.getByTestId('username')`
- `page.getByTestId('password')`
- `page.getByTestId('login-button')`
- `page.getByTestId('inventory-item')`
- `page.getByTestId('shopping-cart-link')`
- `page.getByTestId('checkout')`
- `page.getByTestId('firstName')`
- `page.getByTestId('lastName')`
- `page.getByTestId('postalCode')`
- `page.getByTestId('continue')`
- `page.getByTestId('finish')`

Use role locators for button interactions inside a specific product card when the visible action is the user-facing signal.

## Page Model Recommendations

Keep Page Objects out of fixtures. Instantiate only the page objects needed by a test:

```ts
const loginPage = new LoginPage(page);
const inventoryPage = new InventoryPage(page);
```

Suggested page objects for scale:

- `LoginPage`
- `InventoryPage`
- `CartPage`
- `CheckoutInformationPage`
- `CheckoutOverviewPage`
- `CheckoutCompletePage`

This keeps `baseTest` small and avoids loading 100+ page dependencies into every spec.

## Explored Pages

### Login Page

URL: `/`

Observed controls:

- Username input: `data-test="username"`
- Password input: `data-test="password"`
- Login submit input: `data-test="login-button"`

Primary assertions:

- Page title is `Swag Labs`
- Username and password fields are visible
- Login button is enabled
- Valid login navigates to `/inventory.html`

Negative assertions:

- Empty submit shows `data-test="error"`
- Missing username shows `Error: Username is required`
- Missing password shows `Error: Password is required`
- Invalid credentials should show a locked/invalid credential error depending on user type

### Product Listing Page

URL: `/inventory.html`

Observed page title:

- `Products`

Observed products:

- Sauce Labs Backpack: `$29.99`
- Sauce Labs Bike Light: `$9.99`
- Sauce Labs Bolt T-Shirt: `$15.99`
- Sauce Labs Fleece Jacket: `$49.99`
- Sauce Labs Onesie: `$7.99`
- Test.allTheThings() T-Shirt (Red): `$15.99`

Observed sort options:

- `az`: Name A to Z
- `za`: Name Z to A
- `lohi`: Price low to high
- `hilo`: Price high to low

Primary assertions:

- Inventory URL ends with `/inventory.html`
- Title is `Products`
- Six product cards are visible
- Each product has name, description, price, and add-to-cart button
- Cart badge increments after adding a product
- Added product button changes from `Add to cart` to `Remove`

Recommended test cases:

- Verify all products render with expected names and prices
- Verify sorting by name A to Z
- Verify sorting by name Z to A
- Verify sorting by price low to high
- Verify sorting by price high to low
- Add one product and verify cart badge is `1`
- Add multiple products and verify cart badge count
- Remove product from product listing and verify badge updates

### Cart Page

URL: `/cart.html`

Observed title:

- `Your Cart`

Observed controls:

- Continue Shopping: `data-test="continue-shopping"`
- Checkout: `data-test="checkout"`
- Product remove button, for example `data-test="remove-sauce-labs-backpack"`

Primary assertions:

- Cart URL ends with `/cart.html`
- Cart contains the selected products
- Quantity, product name, description, and price are visible
- Remove button removes item from cart
- Continue Shopping returns to product listing
- Checkout navigates to `/checkout-step-one.html`

Recommended test cases:

- Add Backpack from inventory, open cart, verify Backpack is listed
- Remove item from cart and verify cart is empty
- Continue shopping from cart returns to inventory page
- Checkout button moves user to checkout information page

### Checkout Information Page

URL: `/checkout-step-one.html`

Observed title:

- `Checkout: Your Information`

Observed fields:

- First Name: `data-test="firstName"`
- Last Name: `data-test="lastName"`
- Zip/Postal Code: `data-test="postalCode"`
- Continue: `data-test="continue"`
- Cancel: `data-test="cancel"`

Observed validation:

- Empty continue shows `Error: First Name is required`

Primary assertions:

- Required fields are visible
- Continue without first name shows first-name validation
- Continue without last name shows last-name validation
- Continue without postal code shows postal-code validation
- Valid customer information navigates to `/checkout-step-two.html`
- Cancel returns to cart

Recommended test cases:

- Submit empty form and verify first-name error
- Submit with first name only and verify last-name error
- Submit with first and last name only and verify postal-code error
- Submit all required fields and verify overview page loads
- Cancel checkout and verify return to cart page

### Checkout Overview Page

URL: `/checkout-step-two.html`

Observed title:

- `Checkout: Overview`

Observed summary for one Backpack:

- Payment Information: `SauceCard #31337`
- Shipping Information: `Free Pony Express Delivery!`
- Item total: `$29.99`
- Tax: `$2.40`
- Total: `$32.39`

Primary assertions:

- Overview URL ends with `/checkout-step-two.html`
- Selected products are visible
- Item total equals sum of selected product prices
- Tax is displayed
- Total equals item total plus tax
- Finish navigates to `/checkout-complete.html`
- Cancel returns to inventory page

Recommended test cases:

- Verify overview details for one product
- Verify overview details for multiple products
- Verify total calculation
- Cancel checkout from overview
- Finish checkout successfully

### Checkout Complete Page

URL: `/checkout-complete.html`

Observed title:

- `Checkout: Complete!`

Observed confirmation:

- Header: `Thank you for your order!`
- Message: `Your order has been dispatched, and will arrive just as fast as the pony can get there!`
- Back Home button: `data-test="back-to-products"`

Primary assertions:

- Complete URL ends with `/checkout-complete.html`
- Confirmation title and message are visible
- Back Home returns to `/inventory.html`

Recommended test cases:

- Complete order and verify confirmation page
- Click Back Home and verify product listing loads

## Priority Test Scenarios

### P0: End-to-End Purchase

Steps:

1. Login with valid standard user credentials.
2. Verify product listing page loads.
3. Add `Sauce Labs Backpack` to cart.
4. Open cart.
5. Verify cart contains `Sauce Labs Backpack`.
6. Start checkout.
7. Enter first name, last name, and postal code.
8. Continue to overview.
9. Verify item total, tax, total, payment, and shipping details.
10. Finish checkout.
11. Verify order confirmation page.

Expected result:

- User can complete checkout successfully and sees `Thank you for your order!`.

### P0: Checkout Required Field Validation

Steps:

1. Login.
2. Add a product to cart.
3. Start checkout.
4. Click Continue with an empty form.

Expected result:

- Error message `Error: First Name is required` is visible.

### P1: Product Sorting

Steps:

1. Login.
2. Select each available sort option.
3. Capture displayed product names or prices.

Expected result:

- Product order matches the selected sort mode.

### P1: Cart Item Removal

Steps:

1. Login.
2. Add one or more products.
3. Open cart.
4. Remove a product.

Expected result:

- Removed product is no longer visible and cart badge updates.

## AI Agent and MCP Compatibility Notes

Keep AI-agent-facing context separate from page automation:

- Continue using `agentContext` from `fixtures/baseTest`.
- Store generated plans and exploration notes in `/specs`.
- Keep page objects deterministic and side-effect-light.
- Prefer explicit methods such as `addProductToCart(productName)` and `completeCheckout(customer)` so future MCP tools or agents can reason about available actions.
- Avoid embedding credentials in specs or page objects.

Suggested future MCP resources:

- Test plan documents from `/specs`
- Page object method inventory from `/pages`
- Environment metadata from `/config`
- Test result summaries from `test-results`

## Automation Backlog

Recommended next files to add:

- `pages/CartPage.ts`
- `pages/CheckoutInformationPage.ts`
- `pages/CheckoutOverviewPage.ts`
- `pages/CheckoutCompletePage.ts`
- `tests/checkout.spec.ts`
- `utils/money.ts` for parsing and validating totals
- `utils/saucedemoProducts.ts` for expected product data

Recommended next automated specs:

- `login.spec.ts`: valid login, invalid login, required login fields
- `inventory.spec.ts`: product render, sorting, add/remove item
- `cart.spec.ts`: cart contents, remove, continue shopping
- `checkout.spec.ts`: validation, overview totals, complete order
