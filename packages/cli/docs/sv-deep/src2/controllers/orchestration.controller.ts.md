## src2/controllers/orchestration.controller.ts

Overview: src2/controllers/orchestration.controller.ts defines an HTTP controller (OrchestrationController) that exposes Express routes for a focused domain. Base route: `/orchestration`.

How it works: Registered via the ControllerRegistry during server bootstrap. Each handler delegates to services and applies DTO validation, returning sanitized responses.

Why: Separation of transport and domain logic improves testability and consistency of route registration.

### Imports

- import { Post, RestController, GlobalScope } from '@n8n/decorators';
- import { License } from '@/license';
- import { WorkerStatusService } from '@/scaling/worker-status.service.ee';

### Declarations

- Classes: OrchestrationController
- Exports: OrchestrationController

### Recreate

Place this file at `src2/controllers/orchestration.controller.ts` and use the following source:

```ts
import { Post, RestController, GlobalScope } from '@n8n/decorators';

import { License } from '@/license';
import { WorkerStatusService } from '@/scaling/worker-status.service.ee';

@RestController('/orchestration')
export class OrchestrationController {
	constructor(
		private readonly licenseService: License,
		private readonly workerStatusService: WorkerStatusService,
	) {}

	/**
	 * This endpoint does not return anything, it just triggers the message to
	 * the workers to respond on Redis with their status.
	 */
	@GlobalScope('orchestration:read')
	@Post('/worker/status')
	async getWorkersStatusAll() {
		if (!this.licenseService.isWorkerViewLicensed()) return;

		return await this.workerStatusService.requestWorkerStatus();
	}
}

```
