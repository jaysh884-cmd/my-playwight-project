import type { EnvironmentConfig } from '../config/environment';
import devCheckout from '../test-data/dev/checkout.json';
import devProducts from '../test-data/dev/products.json';
import devUsers from '../test-data/dev/users.json';
import qaCheckout from '../test-data/qa/checkout.json';
import qaProducts from '../test-data/qa/products.json';
import qaUsers from '../test-data/qa/users.json';
import stageCheckout from '../test-data/stage/checkout.json';
import stageProducts from '../test-data/stage/products.json';
import stageUsers from '../test-data/stage/users.json';
import testCheckout from '../test-data/test/checkout.json';
import testProducts from '../test-data/test/products.json';
import testUsers from '../test-data/test/users.json';

export type UserCredentials = {
  username: string;
  password: string;
};

export type SauceDemoProduct = {
  name: string;
  price: string;
};

export type CheckoutCustomer = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export type EnvironmentTestData = {
  users: {
    standard: UserCredentials;
    invalid: UserCredentials;
  };
  products: {
    backpack: SauceDemoProduct;
    all: SauceDemoProduct[];
  };
  checkout: {
    defaultCustomer: CheckoutCustomer;
    errors: {
      firstNameRequired: string;
      lastNameRequired: string;
      postalCodeRequired: string;
    };
    expectedBackpackSummary: {
      itemTotal: string;
      tax: string;
      total: string;
    };
  };
};

const testDataByEnvironment = {
  dev: {
    users: devUsers,
    products: devProducts,
    checkout: devCheckout
  },
  test: {
    users: testUsers,
    products: testProducts,
    checkout: testCheckout
  },
  qa: {
    users: qaUsers,
    products: qaProducts,
    checkout: qaCheckout
  },
  stage: {
    users: stageUsers,
    products: stageProducts,
    checkout: stageCheckout
  }
} satisfies Record<EnvironmentConfig['name'], EnvironmentTestData>;

function getOptionalEnvValue(name: string): string | undefined {
  const value = process.env[name];

  return value && value.trim().length > 0 ? value : undefined;
}

// Centralize test data loading so specs never import environment-specific files directly.
export function getTestData(environment: EnvironmentConfig): EnvironmentTestData {
  const selectedData = testDataByEnvironment[environment.name];
  const standardUsername = getOptionalEnvValue('LOGIN_USERNAME') ?? selectedData.users.standard.username;
  const standardPassword = getOptionalEnvValue('LOGIN_PASSWORD') ?? selectedData.users.standard.password;

  return {
    ...selectedData,
    users: {
      ...selectedData.users,
      standard: {
        username: standardUsername,
        password: standardPassword
      }
    }
  };
}

// Compatibility helper for specs that only need the standard login user.
export function buildUserCredentials(environment: EnvironmentConfig): UserCredentials {
  return getTestData(environment).users.standard;
}
