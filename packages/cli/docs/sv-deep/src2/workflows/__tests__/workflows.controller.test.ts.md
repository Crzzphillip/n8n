## src2/workflows/__tests__/workflows.controller.test.ts

Overview: src2/workflows/__tests__/workflows.controller.test.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { ImportWorkflowFromUrlDto } from '@n8n/api-types/src/dto/workflows/import-workflow-from-url.dto';
- import type { AuthenticatedRequest } from '@n8n/db';
- import axios from 'axios';
- import type { Response } from 'express';
- import { mock } from 'jest-mock-extended';
- import { BadRequestError } from '@/errors/response-errors/bad-request.error';
- import { WorkflowsController } from '../workflows.controller';

### Recreate

Place this file at `src2/workflows/__tests__/workflows.controller.test.ts` and use the following source:

```ts
import type { ImportWorkflowFromUrlDto } from '@n8n/api-types/src/dto/workflows/import-workflow-from-url.dto';
import type { AuthenticatedRequest } from '@n8n/db';
import axios from 'axios';
import type { Response } from 'express';
import { mock } from 'jest-mock-extended';

import { BadRequestError } from '@/errors/response-errors/bad-request.error';

import { WorkflowsController } from '../workflows.controller';

jest.mock('axios');

describe('WorkflowsController', () => {
	const controller = Object.create(WorkflowsController.prototype);
	const axiosMock = axios.get as jest.Mock;
	const req = mock<AuthenticatedRequest>();
	const res = mock<Response>();

	describe('getFromUrl', () => {
		describe('should return workflow data', () => {
			it('when the URL points to a valid JSON file', async () => {
				const mockWorkflowData = {
					nodes: [],
					connections: {},
				};

				axiosMock.mockResolvedValue({ data: mockWorkflowData });

				const query: ImportWorkflowFromUrlDto = { url: 'https://example.com/workflow.json' };
				const result = await controller.getFromUrl(req, res, query);

				expect(result).toEqual(mockWorkflowData);
				expect(axiosMock).toHaveBeenCalledWith(query.url);
			});
		});

		describe('should throw a BadRequestError', () => {
			const query: ImportWorkflowFromUrlDto = { url: 'https://example.com/invalid.json' };

			it('when the URL does not point to a valid JSON file', async () => {
				axiosMock.mockRejectedValue(new Error('Network Error'));

				await expect(controller.getFromUrl(req, res, query)).rejects.toThrow(BadRequestError);
				expect(axiosMock).toHaveBeenCalledWith(query.url);
			});

			it('when the data is not a valid sv workflow JSON', async () => {
				const invalidWorkflowData = {
					nodes: 'not an array',
					connections: 'not an object',
				};

				axiosMock.mockResolvedValue({ data: invalidWorkflowData });

				await expect(controller.getFromUrl(req, res, query)).rejects.toThrow(BadRequestError);
				expect(axiosMock).toHaveBeenCalledWith(query.url);
			});

			it('when the data is missing required fields', async () => {
				const incompleteWorkflowData = {
					nodes: [],
					// Missing connections field
				};

				axiosMock.mockResolvedValue({ data: incompleteWorkflowData });

				await expect(controller.getFromUrl(req, res, query)).rejects.toThrow(BadRequestError);
				expect(axiosMock).toHaveBeenCalledWith(query.url);
			});
		});
	});
});

```
