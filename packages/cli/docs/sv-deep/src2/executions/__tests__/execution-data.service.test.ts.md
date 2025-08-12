## src2/executions/__tests__/execution-data.service.test.ts

Overview: src2/executions/__tests__/execution-data.service.test.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { mock } from 'jest-mock-extended';
- import { NodeOperationError } from 'n8n-workflow';
- import type { INode, WorkflowExecuteMode } from 'n8n-workflow';
- import { ExecutionDataService } from '../execution-data.service';

### Recreate

Place this file at `src2/executions/__tests__/execution-data.service.test.ts` and use the following source:

```ts
import { mock } from 'jest-mock-extended';
import { NodeOperationError } from 'n8n-workflow';
import type { INode, WorkflowExecuteMode } from 'n8n-workflow';

import { ExecutionDataService } from '../execution-data.service';

describe('ExecutionDataService', () => {
	const service = new ExecutionDataService();

	describe('generateFailedExecutionFromError', () => {
		const mode: WorkflowExecuteMode = 'manual';
		const node = mock<INode>({ name: 'Test Node' });
		const error = new NodeOperationError(node, 'Test error message');

		it('should generate a failed execution with error details', () => {
			const startTime = Date.now();

			const result = service.generateFailedExecutionFromError(mode, error, node, startTime);

			expect(result.mode).toBe(mode);
			expect(result.status).toBe('error');
			expect(result.startedAt).toBeInstanceOf(Date);
			expect(result.stoppedAt).toBeInstanceOf(Date);
			expect(result.data.resultData.error?.message).toBe(error.message);

			const taskData = result.data.resultData.runData[node.name][0];
			expect(taskData.error?.message).toBe(error.message);
			expect(taskData.startTime).toBe(startTime);
			expect(taskData.executionStatus).toBe('error');
			expect(result.data.resultData.lastNodeExecuted).toBe(node.name);
			expect(result.data.executionData?.nodeExecutionStack[0].node).toEqual(node);
		});

		it('should generate a failed execution without node details if node is undefined', () => {
			const result = service.generateFailedExecutionFromError(mode, error, undefined);

			expect(result.mode).toBe(mode);
			expect(result.status).toBe('error');
			expect(result.startedAt).toBeInstanceOf(Date);
			expect(result.stoppedAt).toBeInstanceOf(Date);
			expect(result.data.resultData.error?.message).toBe(error.message);
			expect(result.data.resultData.runData).toEqual({});
			expect(result.data.resultData.lastNodeExecuted).toBeUndefined();
			expect(result.data.executionData).toBeUndefined();
		});
	});
});

```
