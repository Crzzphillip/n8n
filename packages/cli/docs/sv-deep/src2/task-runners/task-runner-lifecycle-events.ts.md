## src2/task-runners/task-runner-lifecycle-events.ts

Overview: src2/task-runners/task-runner-lifecycle-events.ts is a core component (TaskRunnerLifecycleEvents) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { Service } from '@n8n/di';
- import { TypedEmitter } from '@/typed-emitter';

### Declarations

- Classes: TaskRunnerLifecycleEvents
- Exports: TaskRunnerLifecycleEvents

### Recreate

Place this file at `src2/task-runners/task-runner-lifecycle-events.ts` and use the following source:

```ts
import { Service } from '@n8n/di';

import { TypedEmitter } from '@/typed-emitter';

type TaskRunnerLifecycleEventMap = {
	'runner:failed-heartbeat-check': never;
	'runner:timed-out-during-task': never;
};

@Service()
export class TaskRunnerLifecycleEvents extends TypedEmitter<TaskRunnerLifecycleEventMap> {}

```
