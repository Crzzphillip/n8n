## src2/eventbus/event-message-classes/event-message-workflow.ts

Overview: src2/eventbus/event-message-classes/event-message-workflow.ts is a core component (for) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { IExecutionBase } from '@n8n/db';
- import type { IWorkflowBase, JsonObject } from 'n8n-workflow';
- import { EventMessageTypeNames } from 'n8n-workflow';
- import type { EventNamesWorkflowType } from '.';
- import { AbstractEventMessage, isEventMessageOptionsWithType } from './abstract-event-message';
- import type { AbstractEventMessageOptions } from './abstract-event-message-options';
- import type { AbstractEventPayload } from './abstract-event-payload';

### Declarations

- Classes: for, EventMessageWorkflow
- Exports: EventPayloadWorkflow, EventMessageWorkflowOptions, EventMessageWorkflow

### Recreate

Place this file at `src2/eventbus/event-message-classes/event-message-workflow.ts` and use the following source:

```ts
import type { IExecutionBase } from '@n8n/db';
import type { IWorkflowBase, JsonObject } from 'n8n-workflow';
import { EventMessageTypeNames } from 'n8n-workflow';

import type { EventNamesWorkflowType } from '.';
import { AbstractEventMessage, isEventMessageOptionsWithType } from './abstract-event-message';
import type { AbstractEventMessageOptions } from './abstract-event-message-options';
import type { AbstractEventPayload } from './abstract-event-payload';

// --------------------------------------
// EventMessage class for Workflow events
// --------------------------------------
export interface EventPayloadWorkflow extends AbstractEventPayload {
	msg?: string;

	workflowData?: IWorkflowBase;

	executionId?: IExecutionBase['id'];

	workflowId?: IWorkflowBase['id'];
}

export interface EventMessageWorkflowOptions extends AbstractEventMessageOptions {
	eventName: EventNamesWorkflowType;

	payload?: EventPayloadWorkflow | undefined;
}

export class EventMessageWorkflow extends AbstractEventMessage {
	readonly __type = EventMessageTypeNames.workflow;

	eventName: EventNamesWorkflowType;

	payload: EventPayloadWorkflow;

	constructor(options: EventMessageWorkflowOptions) {
		super(options);
		if (options.payload) this.setPayload(options.payload);
		if (options.anonymize) {
			this.anonymize();
		}
	}

	setPayload(payload: EventPayloadWorkflow): this {
		this.payload = payload;
		return this;
	}

	deserialize(data: JsonObject): this {
		if (isEventMessageOptionsWithType(data, this.__type)) {
			this.setOptionsOrDefault(data);
			if (data.payload) this.setPayload(data.payload as EventPayloadWorkflow);
		}
		return this;
	}
}

```
