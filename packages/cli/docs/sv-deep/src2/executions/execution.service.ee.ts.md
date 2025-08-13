## src2/executions/execution.service.ee.ts

Overview: src2/executions/execution.service.ee.ts is a core component (EnterpriseExecutionsService) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { WorkflowWithSharingsAndCredentials, IExecutionResponse } from '@n8n/db';
- import { WorkflowRepository } from '@n8n/db';
- import { Service } from '@n8n/di';
- import type { IExecutionFlattedResponse } from '@/interfaces';
- import { ExecutionService } from './execution.service';
- import type { ExecutionRequest } from './execution.types';
- import { EnterpriseWorkflowService } from '../workflows/workflow.service.ee';

### Declarations

- Classes: EnterpriseExecutionsService
- Exports: EnterpriseExecutionsService

### Recreate

Place this file at `src2/executions/execution.service.ee.ts` and use the following source:

```ts
import type { WorkflowWithSharingsAndCredentials, IExecutionResponse } from '@n8n/db';
import { WorkflowRepository } from '@n8n/db';
import { Service } from '@n8n/di';

import type { IExecutionFlattedResponse } from '@/interfaces';

import { ExecutionService } from './execution.service';
import type { ExecutionRequest } from './execution.types';
import { EnterpriseWorkflowService } from '../workflows/workflow.service.ee';

@Service()
export class EnterpriseExecutionsService {
	constructor(
		private readonly executionService: ExecutionService,
		private readonly workflowRepository: WorkflowRepository,
		private readonly enterpriseWorkflowService: EnterpriseWorkflowService,
	) {}

	async findOne(
		req: ExecutionRequest.GetOne,
		sharedWorkflowIds: string[],
	): Promise<IExecutionResponse | IExecutionFlattedResponse | undefined> {
		const execution = await this.executionService.findOne(req, sharedWorkflowIds);

		if (!execution) return;

		const workflow = (await this.workflowRepository.get({
			id: execution.workflowId,
		})) as WorkflowWithSharingsAndCredentials;

		if (!workflow) return;

		const workflowWithSharingsMetaData =
			this.enterpriseWorkflowService.addOwnerAndSharings(workflow);
		await this.enterpriseWorkflowService.addCredentialsToWorkflow(
			workflowWithSharingsMetaData,
			req.user,
		);

		execution.workflowData = {
			...execution.workflowData,
			homeProject: workflowWithSharingsMetaData.homeProject,
			sharedWithProjects: workflowWithSharingsMetaData.sharedWithProjects,
			usedCredentials: workflowWithSharingsMetaData.usedCredentials,
		} as WorkflowWithSharingsAndCredentials;

		return execution;
	}
}

```
