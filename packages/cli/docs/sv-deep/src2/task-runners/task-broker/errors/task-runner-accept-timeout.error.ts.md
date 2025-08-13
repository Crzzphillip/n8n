## src2/task-runners/task-broker/errors/task-runner-accept-timeout.error.ts

Overview: src2/task-runners/task-broker/errors/task-runner-accept-timeout.error.ts is a core component (TaskRunnerAcceptTimeoutError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { OperationalError } from 'n8n-workflow';

### Declarations

- Classes: TaskRunnerAcceptTimeoutError
- Exports: TaskRunnerAcceptTimeoutError

### Recreate

Place this file at `src2/task-runners/task-broker/errors/task-runner-accept-timeout.error.ts` and use the following source:

```ts
import { OperationalError } from 'n8n-workflow';

export class TaskRunnerAcceptTimeoutError extends OperationalError {
	constructor(taskId: string, runnerId: string) {
		super(`Runner (${runnerId}) took too long to acknowledge acceptance of task (${taskId})`, {
			level: 'warning',
		});
	}
}

```
