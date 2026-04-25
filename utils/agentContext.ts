import type { TestInfo } from '@playwright/test';
import type { EnvironmentConfig } from '../config/environment';

export type AgentContext = {
  testTitle: string;
  projectName: string;
  environment: string;
  baseUrl: string;
  tags: string[];
};

// Keep AI/MCP metadata explicit and separate from browser automation code.
export function createAgentContext(testInfo: TestInfo, environment: EnvironmentConfig): AgentContext {
  return {
    testTitle: testInfo.title,
    projectName: testInfo.project.name,
    environment: environment.name,
    baseUrl: environment.baseUrl,
    tags: testInfo.tags
  };
}
