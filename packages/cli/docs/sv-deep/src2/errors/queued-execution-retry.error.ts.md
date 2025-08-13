## src2/errors/queued-execution-retry.error.ts

Overview: src2/errors/queued-execution-retry.error.ts is a core component (QueuedExecutionRetryError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UnexpectedError } from 'n8n-workflow';

### Declarations

- Classes: QueuedExecutionRetryError
- Exports: QueuedExecutionRetryError

### Recreate

Place this file at `src2/errors/queued-execution-retry.error.ts` and use the following source:

```ts
import { UnexpectedError } from 'n8n-workflow';

export class QueuedExecutionRetryError extends UnexpectedError {
	constructor() {
		super('Execution is queued to run (not yet started) so it cannot be retried');
	}
}

```
