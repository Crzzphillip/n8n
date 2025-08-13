## src2/services/execution-metadata.service.ts

Overview: src2/services/execution-metadata.service.ts provides a service (ExecutionMetadataService) encapsulating domain logic and integrations.

How it works: Injected via DI, composes repositories, utilities, and external APIs into cohesive operations.

Why: Keeps controllers/commands thin and enables unit testing with dependency mocks.

### Imports

- import type { ExecutionMetadata } from '@n8n/db';
- import { ExecutionMetadataRepository } from '@n8n/db';
- import { Service } from '@n8n/di';

### Declarations

- Classes: ExecutionMetadataService
- Exports: ExecutionMetadataService

### Recreate

Place this file at `src2/services/execution-metadata.service.ts` and use the following source:

```ts
import type { ExecutionMetadata } from '@n8n/db';
import { ExecutionMetadataRepository } from '@n8n/db';
import { Service } from '@n8n/di';

@Service()
export class ExecutionMetadataService {
	constructor(private readonly executionMetadataRepository: ExecutionMetadataRepository) {}

	async save(executionId: string, executionMetadata: Record<string, string>): Promise<void> {
		const metadataRows: Array<Pick<ExecutionMetadata, 'executionId' | 'key' | 'value'>> = [];
		for (const [key, value] of Object.entries(executionMetadata)) {
			metadataRows.push({
				executionId,
				key,
				value,
			});
		}

		await this.executionMetadataRepository.upsert(metadataRows, {
			conflictPaths: { executionId: true, key: true },
		});
	}
}

```
