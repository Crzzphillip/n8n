## src2/errors/execution-not-found-error.ts

Overview: src2/errors/execution-not-found-error.ts is a core component (ExecutionNotFoundError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UnexpectedError } from 'n8n-workflow';

### Declarations

- Classes: ExecutionNotFoundError
- Exports: ExecutionNotFoundError

### Recreate

Place this file at `src2/errors/execution-not-found-error.ts` and use the following source:

```ts
import { UnexpectedError } from 'n8n-workflow';

export class ExecutionNotFoundError extends UnexpectedError {
	constructor(executionId: string) {
		super('No active execution found', { extra: { executionId } });
	}
}

```
