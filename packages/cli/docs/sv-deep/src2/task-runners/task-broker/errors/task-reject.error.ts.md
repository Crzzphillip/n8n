## src2/task-runners/task-broker/errors/task-reject.error.ts

Overview: src2/task-runners/task-broker/errors/task-reject.error.ts is a core component (TaskRejectError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UserError } from 'n8n-workflow';

### Declarations

- Classes: TaskRejectError
- Exports: TaskRejectError

### Recreate

Place this file at `src2/task-runners/task-broker/errors/task-reject.error.ts` and use the following source:

```ts
import { UserError } from 'n8n-workflow';

export class TaskRejectError extends UserError {
	constructor(public reason: string) {
		super(`Task rejected with reason: ${reason}`);
	}
}

```
