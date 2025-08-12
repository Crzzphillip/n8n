## src2/eventbus/event-message-classes/event-message-audit.ts

Overview: src2/eventbus/event-message-classes/event-message-audit.ts is a core component (for) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { EventMessageTypeNames } from 'n8n-workflow';
- import type { JsonObject, JsonValue } from 'n8n-workflow';
- import type { EventNamesAuditType } from '.';
- import { AbstractEventMessage, isEventMessageOptionsWithType } from './abstract-event-message';
- import type { AbstractEventMessageOptions } from './abstract-event-message-options';
- import type { AbstractEventPayload } from './abstract-event-payload';

### Declarations

- Classes: for, EventMessageAudit
- Exports: EventPayloadAudit, EventMessageAuditOptions, EventMessageAudit

### Recreate

Place this file at `src2/eventbus/event-message-classes/event-message-audit.ts` and use the following source:

```ts
import { EventMessageTypeNames } from 'n8n-workflow';
import type { JsonObject, JsonValue } from 'n8n-workflow';

import type { EventNamesAuditType } from '.';
import { AbstractEventMessage, isEventMessageOptionsWithType } from './abstract-event-message';
import type { AbstractEventMessageOptions } from './abstract-event-message-options';
import type { AbstractEventPayload } from './abstract-event-payload';

// --------------------------------------
// EventMessage class for Audit events
// --------------------------------------
export interface EventPayloadAudit extends AbstractEventPayload {
	msg?: JsonValue;
	userId?: string;
	userEmail?: string;
	firstName?: string;
	lastName?: string;
	credentialName?: string;
	credentialType?: string;
	credentialId?: string;
	workflowId?: string;
	workflowName?: string;
}

export interface EventMessageAuditOptions extends AbstractEventMessageOptions {
	eventName: EventNamesAuditType;

	payload?: EventPayloadAudit;
}

export class EventMessageAudit extends AbstractEventMessage {
	readonly __type = EventMessageTypeNames.audit;

	eventName: EventNamesAuditType;

	payload: EventPayloadAudit;

	constructor(options: EventMessageAuditOptions) {
		super(options);
		if (options.payload) this.setPayload(options.payload);
		if (options.anonymize) {
			this.anonymize();
		}
	}

	setPayload(payload: EventPayloadAudit): this {
		this.payload = payload;
		return this;
	}

	deserialize(data: JsonObject): this {
		if (isEventMessageOptionsWithType(data, this.__type)) {
			this.setOptionsOrDefault(data);
			if (data.payload) this.setPayload(data.payload as EventPayloadAudit);
		}
		return this;
	}
}

```
