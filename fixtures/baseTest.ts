import { test as base, expect } from '@playwright/test';
import { getEnvironmentConfig, type EnvironmentConfig } from '../config/environment';
import { createAgentContext, type AgentContext } from '../utils/agentContext';

type TestFixtures = {
  environment: EnvironmentConfig;
  agentContext: AgentContext;
};

// Keep base fixtures limited to cross-cutting test context.
// Page Objects are created inside specs so large projects can import only the pages each test needs.
export const test = base.extend<TestFixtures>({
  environment: async ({}, use) => {
    await use(getEnvironmentConfig());
  },

  agentContext: async ({ environment }, use, testInfo) => {
    await use(createAgentContext(testInfo, environment));
  }
});

export { expect };
