## src2/task-runners/task-broker/errors/task-deferred.error.ts

Overview: src2/task-runners/task-broker/errors/task-deferred.error.ts is a core component (TaskDeferredError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UserError } from 'n8n-workflow';

### Declarations

- Classes: TaskDeferredError
- Exports: TaskDeferredError

### Recreate

Place this file at `src2/task-runners/task-broker/errors/task-deferred.error.ts` and use the following source:

```ts
import { UserError } from 'n8n-workflow';

export class TaskDeferredError extends UserError {
	constructor() {
		super('Task deferred until runner is ready');
	}
}

```
