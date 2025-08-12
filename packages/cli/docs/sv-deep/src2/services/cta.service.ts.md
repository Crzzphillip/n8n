## src2/services/cta.service.ts

Overview: src2/services/cta.service.ts provides a service (CtaService) encapsulating domain logic and integrations.

How it works: Injected via DI, composes repositories, utilities, and external APIs into cohesive operations.

Why: Keeps controllers/commands thin and enables unit testing with dependency mocks.

### Imports

- import type { User } from '@n8n/db';
- import { WorkflowStatisticsRepository } from '@n8n/db';
- import { Service } from '@n8n/di';

### Declarations

- Classes: CtaService
- Exports: CtaService

### Recreate

Place this file at `src2/services/cta.service.ts` and use the following source:

```ts
import type { User } from '@n8n/db';
import { WorkflowStatisticsRepository } from '@n8n/db';
import { Service } from '@n8n/di';

@Service()
export class CtaService {
	constructor(private readonly workflowStatisticsRepository: WorkflowStatisticsRepository) {}

	async getBecomeCreatorCta(userId: User['id']) {
		// There need to be at least 3 workflows with at least 5 executions
		const numWfsWithOver5ProdExecutions =
			await this.workflowStatisticsRepository.queryNumWorkflowsUserHasWithFiveOrMoreProdExecs(
				userId,
			);

		return numWfsWithOver5ProdExecutions >= 3;
	}
}

```
