## src2/errors/response-errors/conflict.error.ts

Overview: src2/errors/response-errors/conflict.error.ts is a core component (ConflictError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { ResponseError } from './abstract/response.error';

### Declarations

- Classes: ConflictError
- Exports: ConflictError

### Recreate

Place this file at `src2/errors/response-errors/conflict.error.ts` and use the following source:

```ts
import { ResponseError } from './abstract/response.error';

export class ConflictError extends ResponseError {
	constructor(message: string, hint: string | undefined = undefined) {
		super(message, 409, 409, hint);
	}
}

```
