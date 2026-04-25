# Playwright TypeScript Automation Framework

This project is a starter Playwright Test Runner framework using TypeScript, Page Object Model, custom fixtures, environment config, and small utilities that can later be exposed to MCP tools or AI agents.

## Structure

- `tests/`: Playwright specs grouped by user flow or feature.
- `pages/`: Page Object Model classes. Keep locators and page actions here.
- `fixtures/`: Shared test setup for cross-cutting context such as environment and agent metadata.
- `utils/`: Helpers for data, logging, agent metadata, and reusable support code.
- `config/`: Environment and runtime configuration.
- `test-data/`: Environment-specific data split by feature/domain.

## Setup

```bash
npm install
npm run install:browsers
```

## Run Tests

```bash
npm test
npm run test:dev
npm run test:test
npm run test:headed
npm run test:ui
```

## Environment Selection

Set `TEST_ENV=dev` or `TEST_ENV=test`. You can also override the base URL with `BASE_URL`.

```bash
TEST_ENV=test npm test
BASE_URL=https://your-app.example.com npm test
```

On Windows PowerShell:

```powershell
$env:TEST_ENV="test"; npm test
```

## Test Data

Environment URLs live in `config/environment.ts`. Test values live in `test-data/<environment>/` and are split by domain:

- `users.json`
- `products.json`
- `checkout.json`

Tests should load data through `getTestData(environment)` from `utils/testData.ts` instead of importing JSON files directly:

```ts
const data = getTestData(environment);
await loginPage.login(data.users.standard.username, data.users.standard.password);
```

`LOGIN_USERNAME` and `LOGIN_PASSWORD` can still override the standard user at runtime through `.env`, CI variables, or GitHub Secrets.

## POM Usage

Tests import from `fixtures/baseTest` instead of `@playwright/test` to receive environment and agent context. Page Objects are instantiated inside the test that needs them, which keeps the base fixture scalable for projects with many pages:

```ts
import { test, expect } from '../fixtures/baseTest';
import { LoginPage } from '../pages/LoginPage';

test('login example', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('user', 'password');
});
```

## MCP / AI Agent Readiness

The `utils/agentContext.ts` helper exposes structured metadata about the current test run. This keeps agent-facing context separate from browser automation logic, making it easier to later connect the framework to MCP resources, tools, or agent workflows.
