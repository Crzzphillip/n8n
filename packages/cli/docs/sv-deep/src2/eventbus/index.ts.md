## src2/eventbus/index.ts

Overview: src2/eventbus/index.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/eventbus/index.ts` and use the following source:

```ts
export { EventMessageTypes } from './event-message-classes';
export { EventPayloadWorkflow } from './event-message-classes/event-message-workflow';

```
