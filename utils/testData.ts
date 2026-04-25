import type { EnvironmentConfig } from '../config/environment';

export type UserCredentials = {
  username: string;
  password: string;
};

// Centralize test data creation so specs avoid hard-coded values.
export function buildUserCredentials(environment: EnvironmentConfig): UserCredentials {
  return {
    username: environment.credentials.username,
    password: environment.credentials.password
  };
}
