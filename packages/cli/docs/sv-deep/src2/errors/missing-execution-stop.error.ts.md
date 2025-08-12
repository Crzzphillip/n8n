## src2/errors/missing-execution-stop.error.ts

Overview: src2/errors/missing-execution-stop.error.ts is a core component (MissingExecutionStopError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UserError } from 'n8n-workflow';

### Declarations

- Classes: MissingExecutionStopError
- Exports: MissingExecutionStopError

### Recreate

Place this file at `src2/errors/missing-execution-stop.error.ts` and use the following source:

```ts
import { UserError } from 'n8n-workflow';

export class MissingExecutionStopError extends UserError {
	constructor(executionId: string) {
		super('Failed to find execution to stop', { extra: { executionId } });
	}
}

```
