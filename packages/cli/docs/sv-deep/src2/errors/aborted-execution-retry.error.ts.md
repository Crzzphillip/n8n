## src2/errors/aborted-execution-retry.error.ts

Overview: src2/errors/aborted-execution-retry.error.ts is a core component (AbortedExecutionRetryError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UnexpectedError } from 'n8n-workflow';

### Declarations

- Classes: AbortedExecutionRetryError
- Exports: AbortedExecutionRetryError

### Recreate

Place this file at `src2/errors/aborted-execution-retry.error.ts` and use the following source:

```ts
import { UnexpectedError } from 'n8n-workflow';

export class AbortedExecutionRetryError extends UnexpectedError {
	constructor() {
		super('The execution was aborted before starting, so it cannot be retried');
	}
}

```
