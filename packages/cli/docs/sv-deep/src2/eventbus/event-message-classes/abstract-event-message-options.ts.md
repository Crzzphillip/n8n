## src2/eventbus/event-message-classes/abstract-event-message-options.ts

Overview: src2/eventbus/event-message-classes/abstract-event-message-options.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { DateTime } from 'luxon';
- import type { EventMessageTypeNames } from 'n8n-workflow';
- import type { EventNamesTypes } from '.';
- import type { AbstractEventPayload } from './abstract-event-payload';

### Declarations

- Exports: AbstractEventMessageOptions

### Recreate

Place this file at `src2/eventbus/event-message-classes/abstract-event-message-options.ts` and use the following source:

```ts
import type { DateTime } from 'luxon';
import type { EventMessageTypeNames } from 'n8n-workflow';

import type { EventNamesTypes } from '.';
import type { AbstractEventPayload } from './abstract-event-payload';

export interface AbstractEventMessageOptions {
	__type?: EventMessageTypeNames;
	id?: string;
	ts?: DateTime | string;
	eventName: EventNamesTypes;
	message?: string;
	payload?: AbstractEventPayload;
	anonymize?: boolean;
}

```
