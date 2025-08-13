## src2/errors/cache-errors/uncacheable-value.error.ts

Overview: src2/errors/cache-errors/uncacheable-value.error.ts is a core component (UncacheableValueError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UnexpectedError } from 'n8n-workflow';

### Declarations

- Classes: UncacheableValueError
- Exports: UncacheableValueError

### Recreate

Place this file at `src2/errors/cache-errors/uncacheable-value.error.ts` and use the following source:

```ts
import { UnexpectedError } from 'n8n-workflow';

export class UncacheableValueError extends UnexpectedError {
	constructor(key: string) {
		super('Value cannot be cached in Redis', {
			extra: { key, hint: 'Does the value contain circular references?' },
		});
	}
}

```
