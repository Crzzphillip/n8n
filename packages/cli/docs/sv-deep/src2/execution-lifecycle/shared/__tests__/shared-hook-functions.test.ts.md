## src2/execution-lifecycle/shared/__tests__/shared-hook-functions.test.ts

Overview: src2/execution-lifecycle/shared/__tests__/shared-hook-functions.test.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { mock } from 'jest-mock-extended';
- import type { IRun } from 'n8n-workflow';
- import { NodeOperationError } from 'n8n-workflow';
- import { determineFinalExecutionStatus } from '../shared-hook-functions';

### Recreate

Place this file at `src2/execution-lifecycle/shared/__tests__/shared-hook-functions.test.ts` and use the following source:

```ts
import { mock } from 'jest-mock-extended';
import type { IRun } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { determineFinalExecutionStatus } from '../shared-hook-functions';

describe('determineFinalExecutionStatus', () => {
	describe('When waitTill is not set', () => {
		test.each(['canceled', 'crashed', 'error', 'success'])('should return "%s"', (status) => {
			const runData = { status, data: {} } as IRun;
			expect(determineFinalExecutionStatus(runData)).toBe(status);
		});
	});

	it('should return "error" when resultData.error exists', () => {
		const runData = {
			status: 'running',
			data: {
				resultData: {
					error: new NodeOperationError(mock(), 'An error occurred'),
				},
			},
		} as IRun;

		expect(determineFinalExecutionStatus(runData)).toBe('error');
	});

	it('should return "waiting" when waitTill is defined', () => {
		const runData = {
			status: 'running',
			data: {},
			waitTill: new Date('2022-01-01T00:00:00'),
		} as IRun;

		expect(determineFinalExecutionStatus(runData)).toBe('waiting');
	});
});

```
