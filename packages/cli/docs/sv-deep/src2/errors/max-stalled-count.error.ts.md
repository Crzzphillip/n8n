## src2/errors/max-stalled-count.error.ts

Overview: src2/errors/max-stalled-count.error.ts is a core component (MaxStalledCountError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { OperationalError } from 'n8n-workflow';

### Declarations

- Classes: MaxStalledCountError
- Exports: MaxStalledCountError

### Recreate

Place this file at `src2/errors/max-stalled-count.error.ts` and use the following source:

```ts
import { OperationalError } from 'n8n-workflow';

/**
 * @docs https://docs.bullmq.io/guide/workers/stalled-jobs
 */
export class MaxStalledCountError extends OperationalError {
	constructor(cause: Error) {
		super(
			'This execution failed to be processed too many times and will no longer retry. To allow this execution to complete, please break down your workflow or scale up your workers or adjust your worker settings.',
			{
				level: 'warning',
				cause,
			},
		);
	}
}

```
