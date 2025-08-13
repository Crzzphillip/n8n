## src2/eventbus/event-message-classes/event-message-runner.ts

Overview: src2/eventbus/event-message-classes/event-message-runner.ts is a core component (EventMessageRunner) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { JsonObject } from 'n8n-workflow';
- import { EventMessageTypeNames } from 'n8n-workflow';
- import { AbstractEventMessage, isEventMessageOptionsWithType } from './abstract-event-message';
- import type { AbstractEventMessageOptions } from './abstract-event-message-options';
- import type { AbstractEventPayload } from './abstract-event-payload';

### Declarations

- Classes: EventMessageRunner
- Exports: EventPayloadRunner, EventMessageRunnerOptions, EventMessageRunner

### Recreate

Place this file at `src2/eventbus/event-message-classes/event-message-runner.ts` and use the following source:

```ts
import type { JsonObject } from 'n8n-workflow';
import { EventMessageTypeNames } from 'n8n-workflow';

import { AbstractEventMessage, isEventMessageOptionsWithType } from './abstract-event-message';
import type { AbstractEventMessageOptions } from './abstract-event-message-options';
import type { AbstractEventPayload } from './abstract-event-payload';

export interface EventPayloadRunner extends AbstractEventPayload {
	taskId: string;
	nodeId: string;
	executionId: string;
	workflowId: string;
}

export interface EventMessageRunnerOptions extends AbstractEventMessageOptions {
	payload?: EventPayloadRunner;
}

export class EventMessageRunner extends AbstractEventMessage {
	readonly __type = EventMessageTypeNames.runner;

	payload: EventPayloadRunner;

	constructor(options: EventMessageRunnerOptions) {
		super(options);
		if (options.payload) this.setPayload(options.payload);
		if (options.anonymize) {
			this.anonymize();
		}
	}

	setPayload(payload: EventPayloadRunner): this {
		this.payload = payload;
		return this;
	}

	deserialize(data: JsonObject): this {
		if (isEventMessageOptionsWithType(data, this.__type)) {
			this.setOptionsOrDefault(data);
			if (data.payload) this.setPayload(data.payload as EventPayloadRunner);
		}
		return this;
	}
}

```
