## src2/task-runners/errors/task-runner-oom-error.ts

Overview: src2/task-runners/errors/task-runner-oom-error.ts is a core component (TaskRunnerOomError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UserError } from 'n8n-workflow';
- import type { TaskRunner } from '@/task-runners/task-broker/task-broker.service';

### Declarations

- Classes: TaskRunnerOomError
- Exports: TaskRunnerOomError

### Recreate

Place this file at `src2/task-runners/errors/task-runner-oom-error.ts` and use the following source:

```ts
import { UserError } from 'n8n-workflow';

import type { TaskRunner } from '@/task-runners/task-broker/task-broker.service';

export class TaskRunnerOomError extends UserError {
	description: string;

	constructor(
		readonly runnerId: TaskRunner['id'],
		isCloudDeployment: boolean,
	) {
		super('Node ran out of memory');

		const fixSuggestions = {
			reduceItems:
				'Reduce the number of items processed at a time, by batching them using a loop node',
			increaseMemory:
				"Increase the memory available to the task runner with 'N8N_RUNNERS_MAX_OLD_SPACE_SIZE' environment variable",
			upgradePlan: 'Upgrade your cloud plan to increase the available memory',
		};

		const subtitle =
			'This usually happens when there are too many items to process. You can try the following:';
		const suggestions = isCloudDeployment
			? [fixSuggestions.reduceItems, fixSuggestions.upgradePlan]
			: [fixSuggestions.reduceItems, fixSuggestions.increaseMemory];
		const suggestionsText = suggestions
			.map((suggestion, index) => `${index + 1}. ${suggestion}`)
			.join('<br/>');

		const description = `${subtitle}<br/><br/>${suggestionsText}`;

		this.description = description;
	}
}

```
