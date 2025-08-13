## src2/evaluation.ee/test-runner/test-run-cleanup.service.ee.ts

Overview: src2/evaluation.ee/test-runner/test-run-cleanup.service.ee.ts is a core component (TestRunCleanupService) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { Logger } from '@n8n/backend-common';
- import { TestRunRepository } from '@n8n/db';
- import { Service } from '@n8n/di';

### Declarations

- Classes: TestRunCleanupService
- Exports: TestRunCleanupService

### Recreate

Place this file at `src2/evaluation.ee/test-runner/test-run-cleanup.service.ee.ts` and use the following source:

```ts
import { Logger } from '@n8n/backend-common';
import { TestRunRepository } from '@n8n/db';
import { Service } from '@n8n/di';

/**
 * This service is responsible for cleaning up pending Test Runs on application startup.
 */
@Service()
export class TestRunCleanupService {
	constructor(
		private readonly logger: Logger,
		private readonly testRunRepository: TestRunRepository,
	) {}

	/**
	 * As Test Runner does not have a recovery mechanism, it can not resume Test Runs interrupted by the server restart.
	 * All Test Runs in incomplete state will be marked as failed.
	 */
	async cleanupIncompleteRuns() {
		const result = await this.testRunRepository.markAllIncompleteAsFailed();
		if (result.affected && result.affected > 0) {
			this.logger.debug(`Marked ${result.affected} incomplete test runs as failed`);
		}
	}
}

```
