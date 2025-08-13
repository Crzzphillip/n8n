## src2/controllers/active-workflows.controller.ts

Overview: src2/controllers/active-workflows.controller.ts defines an HTTP controller (ActiveWorkflowsController) that exposes Express routes for a focused domain. Base route: `/active-workflows`.

How it works: Registered via the ControllerRegistry during server bootstrap. Each handler delegates to services and applies DTO validation, returning sanitized responses.

Why: Separation of transport and domain logic improves testability and consistency of route registration.

### Imports

- import { Get, RestController } from '@n8n/decorators';
- import { ActiveWorkflowRequest } from '@/requests';
- import { ActiveWorkflowsService } from '@/services/active-workflows.service';

### Declarations

- Classes: ActiveWorkflowsController
- Exports: ActiveWorkflowsController

### Recreate

Place this file at `src2/controllers/active-workflows.controller.ts` and use the following source:

```ts
import { Get, RestController } from '@n8n/decorators';

import { ActiveWorkflowRequest } from '@/requests';
import { ActiveWorkflowsService } from '@/services/active-workflows.service';

@RestController('/active-workflows')
export class ActiveWorkflowsController {
	constructor(private readonly activeWorkflowsService: ActiveWorkflowsService) {}

	@Get('/')
	async getActiveWorkflows(req: ActiveWorkflowRequest.GetAllActive) {
		return await this.activeWorkflowsService.getAllActiveIdsFor(req.user);
	}

	@Get('/error/:id')
	async getActivationError(req: ActiveWorkflowRequest.GetActivationError) {
		const {
			user,
			params: { id: workflowId },
		} = req;
		return await this.activeWorkflowsService.getActivationError(workflowId, user);
	}
}

```
