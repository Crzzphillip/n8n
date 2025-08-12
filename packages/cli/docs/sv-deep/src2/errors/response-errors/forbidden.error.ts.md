## src2/errors/response-errors/forbidden.error.ts

Overview: src2/errors/response-errors/forbidden.error.ts is a core component (ForbiddenError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { ResponseError } from './abstract/response.error';

### Declarations

- Classes: ForbiddenError
- Exports: ForbiddenError

### Recreate

Place this file at `src2/errors/response-errors/forbidden.error.ts` and use the following source:

```ts
import { ResponseError } from './abstract/response.error';

export class ForbiddenError extends ResponseError {
	constructor(message = 'Forbidden', hint?: string) {
		super(message, 403, 403, hint);
	}
}

```
