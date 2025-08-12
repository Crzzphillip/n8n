## src2/events/maps/ai.event-map.ts

Overview: src2/events/maps/ai.event-map.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Declarations

- Exports: AiEventPayload, AiEventMap

### Recreate

Place this file at `src2/events/maps/ai.event-map.ts` and use the following source:

```ts
export type AiEventPayload = {
	msg: string;
	workflowName: string;
	executionId: string;
	nodeName: string;
	workflowId?: string;
	nodeType?: string;
};

export type AiEventMap = {
	'ai-messages-retrieved-from-memory': AiEventPayload;

	'ai-message-added-to-memory': AiEventPayload;

	'ai-output-parsed': AiEventPayload;

	'ai-documents-retrieved': AiEventPayload;

	'ai-document-embedded': AiEventPayload;

	'ai-query-embedded': AiEventPayload;

	'ai-document-processed': AiEventPayload;

	'ai-text-split': AiEventPayload;

	'ai-tool-called': AiEventPayload;

	'ai-vector-store-searched': AiEventPayload;

	'ai-llm-generated-output': AiEventPayload;

	'ai-llm-errored': AiEventPayload;

	'ai-vector-store-populated': AiEventPayload;

	'ai-vector-store-updated': AiEventPayload;
};

```
