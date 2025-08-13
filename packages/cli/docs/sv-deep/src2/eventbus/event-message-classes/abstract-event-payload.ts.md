## src2/eventbus/event-message-classes/abstract-event-payload.ts

Overview: src2/eventbus/event-message-classes/abstract-event-payload.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { IWorkflowBase, JsonValue } from 'n8n-workflow';

### Declarations

- Exports: AbstractEventPayload

### Recreate

Place this file at `src2/eventbus/event-message-classes/abstract-event-payload.ts` and use the following source:

```ts
import type { IWorkflowBase, JsonValue } from 'n8n-workflow';

export interface AbstractEventPayload {
	[key: string]: JsonValue | IWorkflowBase | undefined;
}

```
