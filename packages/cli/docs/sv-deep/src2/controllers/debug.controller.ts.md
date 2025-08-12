## src2/controllers/debug.controller.ts

Overview: src2/controllers/debug.controller.ts defines an HTTP controller (DebugController) that exposes Express routes for a focused domain. Base route: `/debug`.

How it works: Registered via the ControllerRegistry during server bootstrap. Each handler delegates to services and applies DTO validation, returning sanitized responses.

Why: Separation of transport and domain logic improves testability and consistency of route registration.

### Imports

- import { WorkflowRepository } from '@n8n/db';
- import { Get, RestController } from '@n8n/decorators';
- import { InstanceSettings } from 'n8n-core';
- import { ActiveWorkflowManager } from '@/active-workflow-manager';
- import { MultiMainSetup } from '@/scaling/multi-main-setup.ee';

### Declarations

- Classes: DebugController
- Exports: DebugController

### Recreate

Place this file at `src2/controllers/debug.controller.ts` and use the following source:

```ts
import { WorkflowRepository } from '@n8n/db';
import { Get, RestController } from '@n8n/decorators';
import { InstanceSettings } from 'n8n-core';

import { ActiveWorkflowManager } from '@/active-workflow-manager';
import { MultiMainSetup } from '@/scaling/multi-main-setup.ee';

@RestController('/debug')
export class DebugController {
	constructor(
		private readonly multiMainSetup: MultiMainSetup,
		private readonly activeWorkflowManager: ActiveWorkflowManager,
		private readonly workflowRepository: WorkflowRepository,
		private readonly instanceSettings: InstanceSettings,
	) {}

	@Get('/multi-main-setup', { skipAuth: true })
	async getMultiMainSetupDetails() {
		const leaderKey = await this.multiMainSetup.fetchLeaderKey();

		const triggersAndPollers = await this.workflowRepository.findIn(
			this.activeWorkflowManager.allActiveInMemory(),
		);

		const webhooks = await this.workflowRepository.findWebhookBasedActiveWorkflows();

		const activationErrors = await this.activeWorkflowManager.getAllWorkflowActivationErrors();

		return {
			instanceId: this.instanceSettings.instanceId,
			leaderKey,
			isLeader: this.instanceSettings.isLeader,
			activeWorkflows: {
				webhooks, // webhook-based active workflows
				triggersAndPollers, // poller- and trigger-based active workflows
			},
			activationErrors,
		};
	}
}

```
