## src2/errors/invalid-concurrency-limit.error.ts

Overview: src2/errors/invalid-concurrency-limit.error.ts is a core component (InvalidConcurrencyLimitError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UserError } from 'n8n-workflow';

### Declarations

- Classes: InvalidConcurrencyLimitError
- Exports: InvalidConcurrencyLimitError

### Recreate

Place this file at `src2/errors/invalid-concurrency-limit.error.ts` and use the following source:

```ts
import { UserError } from 'n8n-workflow';

export class InvalidConcurrencyLimitError extends UserError {
	constructor(value: number) {
		super('Concurrency limit set to invalid value', { extra: { value } });
	}
}

```
