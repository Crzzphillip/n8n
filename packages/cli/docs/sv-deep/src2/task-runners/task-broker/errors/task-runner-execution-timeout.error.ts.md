## src2/task-runners/task-broker/errors/task-runner-execution-timeout.error.ts

Overview: src2/task-runners/task-broker/errors/task-runner-execution-timeout.error.ts is a core component (TaskRunnerExecutionTimeoutError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { TaskRunnerMode } from '@n8n/config/src/configs/runners.config';
- import { OperationalError } from 'n8n-workflow';

### Declarations

- Classes: TaskRunnerExecutionTimeoutError
- Exports: TaskRunnerExecutionTimeoutError

### Recreate

Place this file at `src2/task-runners/task-broker/errors/task-runner-execution-timeout.error.ts` and use the following source:

```ts
import type { TaskRunnerMode } from '@n8n/config/src/configs/runners.config';
import { OperationalError } from 'n8n-workflow';

export class TaskRunnerExecutionTimeoutError extends OperationalError {
	description: string;

	constructor({
		taskTimeout,
		isSelfHosted,
		mode,
	}: { taskTimeout: number; isSelfHosted: boolean; mode: TaskRunnerMode }) {
		super(
			`Task execution timed out after ${taskTimeout} ${taskTimeout === 1 ? 'second' : 'seconds'}`,
		);

		const subtitles = {
			internal:
				'The task runner was taking too long on this task, so it was suspected of being unresponsive and restarted, and the task was aborted.',
			external: 'The task runner was taking too long on this task, so the task was aborted.',
		};

		const fixes = {
			optimizeScript:
				'Optimize your script to prevent long-running tasks, e.g. by processing data in smaller batches.',
			ensureTermination:
				'Ensure that all paths in your script are able to terminate, i.e. no infinite loops.',
			increaseTimeout: `If your task can reasonably take more than ${taskTimeout} ${taskTimeout === 1 ? 'second' : 'seconds'}, increase the timeout using the N8N_RUNNERS_TASK_TIMEOUT environment variable.`,
		};

		const suggestions = [fixes.optimizeScript, fixes.ensureTermination];

		if (isSelfHosted) suggestions.push(fixes.increaseTimeout);

		const suggestionsText = suggestions
			.map((suggestion, index) => `${index + 1}. ${suggestion}`)
			.join('<br/>');

		const description = `${mode === 'internal' ? subtitles.internal : subtitles.external} You can try the following:<br/><br/>${suggestionsText}`;

		this.description = description;
	}
}

```
