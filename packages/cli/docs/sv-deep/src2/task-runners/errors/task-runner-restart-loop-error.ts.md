## src2/task-runners/errors/task-runner-restart-loop-error.ts

Overview: src2/task-runners/errors/task-runner-restart-loop-error.ts is a core component (TaskRunnerRestartLoopError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UnexpectedError } from 'n8n-workflow';

### Declarations

- Classes: TaskRunnerRestartLoopError
- Exports: TaskRunnerRestartLoopError

### Recreate

Place this file at `src2/task-runners/errors/task-runner-restart-loop-error.ts` and use the following source:

```ts
import { UnexpectedError } from 'n8n-workflow';

export class TaskRunnerRestartLoopError extends UnexpectedError {
	constructor(
		readonly howManyTimes: number,
		readonly timePeriodMs: number,
	) {
		const message = `Task runner has restarted ${howManyTimes} times within ${timePeriodMs / 1000} seconds. This is an abnormally high restart rate that suggests a bug or other issue is preventing your runner process from starting up. If this issues persists, please file a report at: https://github.com/n8n-io/n8n/issues`;

		super(message);
	}
}

```
