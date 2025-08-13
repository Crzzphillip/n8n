## src2/eventbus/event-message-classes/event-message-generic.ts

Overview: src2/eventbus/event-message-classes/event-message-generic.ts is a core component (EventMessageGeneric) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { JsonObject } from 'n8n-workflow';
- import { EventMessageTypeNames } from 'n8n-workflow';
- import { AbstractEventMessage, isEventMessageOptionsWithType } from './abstract-event-message';
- import type { AbstractEventMessageOptions } from './abstract-event-message-options';
- import type { AbstractEventPayload } from './abstract-event-payload';

### Declarations

- Classes: EventMessageGeneric
- Exports: eventMessageGenericDestinationTestEvent, EventPayloadGeneric, EventMessageGenericOptions, EventMessageGeneric

### Recreate

Place this file at `src2/eventbus/event-message-classes/event-message-generic.ts` and use the following source:

```ts
import type { JsonObject } from 'n8n-workflow';
import { EventMessageTypeNames } from 'n8n-workflow';

import { AbstractEventMessage, isEventMessageOptionsWithType } from './abstract-event-message';
import type { AbstractEventMessageOptions } from './abstract-event-message-options';
import type { AbstractEventPayload } from './abstract-event-payload';

export const eventMessageGenericDestinationTestEvent = 'n8n.destination.test';

export interface EventPayloadGeneric extends AbstractEventPayload {
	msg?: string;
}

export interface EventMessageGenericOptions extends AbstractEventMessageOptions {
	payload?: EventPayloadGeneric;
}

export class EventMessageGeneric extends AbstractEventMessage {
	readonly __type = EventMessageTypeNames.generic;

	payload: EventPayloadGeneric;

	constructor(options: EventMessageGenericOptions) {
		super(options);
		if (options.payload) this.setPayload(options.payload);
		if (options.anonymize) {
			this.anonymize();
		}
	}

	setPayload(payload: EventPayloadGeneric): this {
		this.payload = payload;
		return this;
	}

	deserialize(data: JsonObject): this {
		if (isEventMessageOptionsWithType(data, this.__type)) {
			this.setOptionsOrDefault(data);
			if (data.payload) this.setPayload(data.payload as EventPayloadGeneric);
		}
		return this;
	}
}

```
