## src2/errors/cache-errors/malformed-refresh-value.error.ts

Overview: src2/errors/cache-errors/malformed-refresh-value.error.ts is a core component (MalformedRefreshValueError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UnexpectedError } from 'n8n-workflow';

### Declarations

- Classes: MalformedRefreshValueError
- Exports: MalformedRefreshValueError

### Recreate

Place this file at `src2/errors/cache-errors/malformed-refresh-value.error.ts` and use the following source:

```ts
import { UnexpectedError } from 'n8n-workflow';

export class MalformedRefreshValueError extends UnexpectedError {
	constructor() {
		super('Refresh value must have the same number of values as keys');
	}
}

```
