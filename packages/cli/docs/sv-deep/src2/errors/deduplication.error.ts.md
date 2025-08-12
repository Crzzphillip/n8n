## src2/errors/deduplication.error.ts

Overview: src2/errors/deduplication.error.ts is a core component (DeduplicationError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UnexpectedError } from 'n8n-workflow';

### Declarations

- Classes: DeduplicationError
- Exports: DeduplicationError

### Recreate

Place this file at `src2/errors/deduplication.error.ts` and use the following source:

```ts
import { UnexpectedError } from 'n8n-workflow';

export class DeduplicationError extends UnexpectedError {
	constructor(message: string) {
		super(`Deduplication Failed: ${message}`);
	}
}

```
