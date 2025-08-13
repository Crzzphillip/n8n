## src2/workflows/workflow-history.ee/__tests__/workflow-history-helper.ee.test.ts

Overview: src2/workflows/workflow-history.ee/__tests__/workflow-history-helper.ee.test.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { mockInstance } from '@n8n/backend-test-utils';
- import { GlobalConfig } from '@n8n/config';
- import { Container } from '@n8n/di';
- import { License } from '@/license';
- import { getWorkflowHistoryPruneTime } from '@/workflows/workflow-history.ee/workflow-history-helper.ee';

### Recreate

Place this file at `src2/workflows/workflow-history.ee/__tests__/workflow-history-helper.ee.test.ts` and use the following source:

```ts
import { mockInstance } from '@n8n/backend-test-utils';
import { GlobalConfig } from '@n8n/config';
import { Container } from '@n8n/di';

import { License } from '@/license';
import { getWorkflowHistoryPruneTime } from '@/workflows/workflow-history.ee/workflow-history-helper.ee';

let licensePruneTime = -1;
const globalConfig = Container.get(GlobalConfig);

beforeAll(async () => {
	mockInstance(License, {
		getWorkflowHistoryPruneLimit() {
			return licensePruneTime;
		},
	});
});

beforeEach(() => {
	licensePruneTime = -1;
	globalConfig.workflowHistory.pruneTime = -1;
});

describe('getWorkflowHistoryPruneTime', () => {
	test('should return -1 (infinite) if config and license are -1', () => {
		licensePruneTime = -1;
		globalConfig.workflowHistory.pruneTime = -1;

		expect(getWorkflowHistoryPruneTime()).toBe(-1);
	});

	test('should return config time if license is infinite and config is not', () => {
		licensePruneTime = -1;
		globalConfig.workflowHistory.pruneTime = 24;

		expect(getWorkflowHistoryPruneTime()).toBe(24);
	});

	test('should return license time if config is infinite and license is not', () => {
		licensePruneTime = 25;
		globalConfig.workflowHistory.pruneTime = -1;

		expect(getWorkflowHistoryPruneTime()).toBe(25);
	});

	test('should return lowest of config and license time if both are not -1', () => {
		licensePruneTime = 26;
		globalConfig.workflowHistory.pruneTime = 100;

		expect(getWorkflowHistoryPruneTime()).toBe(26);

		licensePruneTime = 100;
		globalConfig.workflowHistory.pruneTime = 27;

		expect(getWorkflowHistoryPruneTime()).toBe(27);
	});
});

```
