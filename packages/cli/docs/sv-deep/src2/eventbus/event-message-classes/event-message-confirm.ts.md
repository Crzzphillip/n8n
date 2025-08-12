## src2/eventbus/event-message-classes/event-message-confirm.ts

Overview: src2/eventbus/event-message-classes/event-message-confirm.ts is a core component (EventMessageConfirm) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { DateTime } from 'luxon';
- import type { JsonObject, JsonValue } from 'n8n-workflow';
- import { EventMessageTypeNames } from 'n8n-workflow';

### Declarations

- Classes: EventMessageConfirm
- Exports: EventMessageConfirmSource, EventMessageConfirm, isEventMessageConfirm

### Recreate

Place this file at `src2/eventbus/event-message-classes/event-message-confirm.ts` and use the following source:

```ts
import { DateTime } from 'luxon';
import type { JsonObject, JsonValue } from 'n8n-workflow';
import { EventMessageTypeNames } from 'n8n-workflow';

export interface EventMessageConfirmSource extends JsonObject {
	id: string;
	name: string;
}

export class EventMessageConfirm {
	readonly __type = EventMessageTypeNames.confirm;

	readonly confirm: string;

	readonly source?: EventMessageConfirmSource;

	readonly ts: DateTime;

	constructor(confirm: string, source?: EventMessageConfirmSource) {
		this.confirm = confirm;
		this.ts = DateTime.now();
		if (source) this.source = source;
	}

	serialize(): JsonValue {
		// TODO: filter payload for sensitive info here?
		return {
			__type: this.__type,
			confirm: this.confirm,
			ts: this.ts.toISO(),
			source: this.source ?? { name: '', id: '' },
		};
	}
}

export const isEventMessageConfirm = (candidate: unknown): candidate is EventMessageConfirm => {
	const o = candidate as EventMessageConfirm;
	if (!o) return false;
	return o.confirm !== undefined && o.ts !== undefined;
};

```
