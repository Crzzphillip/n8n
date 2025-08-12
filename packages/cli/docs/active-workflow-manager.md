## Active Workflow Manager

File: `src/active-workflow-manager.ts`

### Responsibilities
- Track, activate, and remove active workflows, coordinating with `ActiveWorkflows` (in-memory), DB, and external services (webhooks, pub/sub, push).
- Queue and debounce activations with exponential backoff on failures; handle reactivation and error recording (`ActivationErrorsService`).
- Register/unregister webhooks for trigger/poller nodes via `WebhookService` and persist webhook metadata to storage.
- Emit error-workflow executions when configured and orchestrate execution handoff through `WorkflowExecutionService`.

### Key flows
- `init()` loads active workflows from memory and storage, then runs external hooks.
- `addWebhooks()` extracts webhooks from a `Workflow` and stores + registers them, normalizing paths and dynamic webhook IDs.
- `removeAll()` and `allActiveInMemory()` support cleanup and inspection.

### Why this design works
- Centralizes activation behavior and error handling, ensuring consistency during startup, updates, and shutdown.
- Separates memory vs. storage state while deduplicating IDs.