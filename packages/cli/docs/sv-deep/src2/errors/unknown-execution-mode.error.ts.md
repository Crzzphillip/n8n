## src2/errors/unknown-execution-mode.error.ts

Overview: src2/errors/unknown-execution-mode.error.ts is a core component (UnknownExecutionModeError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UnexpectedError } from 'n8n-workflow';

### Declarations

- Classes: UnknownExecutionModeError
- Exports: UnknownExecutionModeError

### Recreate

Place this file at `src2/errors/unknown-execution-mode.error.ts` and use the following source:

```ts
import { UnexpectedError } from 'n8n-workflow';

export class UnknownExecutionModeError extends UnexpectedError {
	constructor(mode: string) {
		super('Unknown execution mode', { extra: { mode } });
	}
}

```
