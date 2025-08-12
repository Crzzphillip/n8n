## src2/services/workflow-loader.service.ts

Overview: src2/services/workflow-loader.service.ts provides a service (WorkflowLoaderService) encapsulating domain logic and integrations.

How it works: Injected via DI, composes repositories, utilities, and external APIs into cohesive operations.

Why: Keeps controllers/commands thin and enables unit testing with dependency mocks.

### Imports

- import { WorkflowRepository } from '@n8n/db';
- import { Service } from '@n8n/di';
- import { UserError, type IWorkflowBase, type IWorkflowLoader } from 'n8n-workflow';

### Declarations

- Classes: WorkflowLoaderService
- Exports: WorkflowLoaderService

### Recreate

Place this file at `src2/services/workflow-loader.service.ts` and use the following source:

```ts
import { WorkflowRepository } from '@n8n/db';
import { Service } from '@n8n/di';
import { UserError, type IWorkflowBase, type IWorkflowLoader } from 'n8n-workflow';

@Service()
export class WorkflowLoaderService implements IWorkflowLoader {
	constructor(private readonly workflowRepository: WorkflowRepository) {}

	async get(workflowId: string): Promise<IWorkflowBase> {
		const workflow = await this.workflowRepository.findById(workflowId);

		if (!workflow) {
			throw new UserError(`Failed to find workflow with ID "${workflowId}"`);
		}

		return workflow;
	}
}

```
