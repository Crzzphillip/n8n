## src2/errors/response-errors/unauthenticated.error.ts

Overview: src2/errors/response-errors/unauthenticated.error.ts is a core component (UnauthenticatedError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { ResponseError } from './abstract/response.error';

### Declarations

- Classes: UnauthenticatedError
- Exports: UnauthenticatedError

### Recreate

Place this file at `src2/errors/response-errors/unauthenticated.error.ts` and use the following source:

```ts
import { ResponseError } from './abstract/response.error';

export class UnauthenticatedError extends ResponseError {
	constructor(message = 'Unauthenticated', hint?: string) {
		super(message, 401, 401, hint);
	}
}

```
