export type EnvironmentName = 'dev' | 'test' | 'qa' | 'stage';

export interface EnvironmentConfig {
  name: EnvironmentName;
  baseUrl: string;
  credentials: {
    username: string;
    password: string;
  };
}

const environments: Record<EnvironmentName, EnvironmentConfig> = {
  dev: {
    name: 'dev',
    baseUrl: 'https://www.saucedemo.com',
    credentials: {
      username: 'standard_user',
      password: 'secret_sauce'
    }
  },
  test: {
    name: 'test',
    baseUrl: 'https://www.saucedemo.com',
    credentials: {
      username: 'standard_user',
      password: 'secret_sauce'
    }
  },
  qa: {
    name: 'qa',
    baseUrl: 'https://www.saucedemo.com',
    credentials: {
      username: 'standard_user',
      password: 'secret_sauce'
    }
  },
  stage: {
    name: 'stage',
    baseUrl: 'https://www.saucedemo.com',
    credentials: {
      username: 'standard_user',
      password: 'secret_sauce'
    }
  }
};

function resolveEnvironmentName(): EnvironmentName {
  const requestedEnvironment = process.env.TEST_ENV ?? 'dev';

  if (
    requestedEnvironment === 'dev' ||
    requestedEnvironment === 'test' ||
    requestedEnvironment === 'qa' ||
    requestedEnvironment === 'stage'
  ) {
    return requestedEnvironment;
  }

  throw new Error(`Unsupported TEST_ENV "${requestedEnvironment}". Use "dev", "test", "qa", or "stage".`);
}

function getOptionalEnvValue(name: string): string | undefined {
  const value = process.env[name];

  return value && value.trim().length > 0 ? value : undefined;
}

export function getEnvironmentConfig(): EnvironmentConfig {
  const selectedEnvironment = environments[resolveEnvironmentName()];

  return {
    ...selectedEnvironment,
    baseUrl: getOptionalEnvValue('BASE_URL') ?? selectedEnvironment.baseUrl,
    credentials: {
      username: getOptionalEnvValue('LOGIN_USERNAME') ?? selectedEnvironment.credentials.username,
      password: getOptionalEnvValue('LOGIN_PASSWORD') ?? selectedEnvironment.credentials.password
    }
  };
}
