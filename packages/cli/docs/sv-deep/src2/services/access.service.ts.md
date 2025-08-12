## src2/services/access.service.ts

Overview: src2/services/access.service.ts provides a service (AccessService) encapsulating domain logic and integrations.

How it works: Injected via DI, composes repositories, utilities, and external APIs into cohesive operations.

Why: Keeps controllers/commands thin and enables unit testing with dependency mocks.

### Imports

- import type { User } from '@n8n/db';
- import { UserRepository } from '@n8n/db';
- import { Service } from '@n8n/di';
- import type { Workflow } from 'n8n-workflow';
- import { WorkflowFinderService } from '@/workflows/workflow-finder.service';

### Declarations

- Classes: AccessService
- Exports: AccessService

### Recreate

Place this file at `src2/services/access.service.ts` and use the following source:

```ts
import type { User } from '@n8n/db';
import { UserRepository } from '@n8n/db';
import { Service } from '@n8n/di';
import type { Workflow } from 'n8n-workflow';

import { WorkflowFinderService } from '@/workflows/workflow-finder.service';

/**
 * Responsible for checking whether a user has access to a resource.
 */
@Service()
export class AccessService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly workflowFinderService: WorkflowFinderService,
	) {}

	/** Whether a user has read access to a workflow based on their project and scope. */
	async hasReadAccess(userId: User['id'], workflowId: Workflow['id']) {
		const user = await this.userRepository.findOneBy({ id: userId });

		if (!user) return false;

		const workflow = await this.workflowFinderService.findWorkflowForUser(workflowId, user, [
			'workflow:read',
		]);

		return workflow !== null;
	}
}

```
