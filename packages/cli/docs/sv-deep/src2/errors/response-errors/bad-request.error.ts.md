## src2/errors/response-errors/bad-request.error.ts

Overview: src2/errors/response-errors/bad-request.error.ts is a core component (BadRequestError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { ResponseError } from './abstract/response.error';

### Declarations

- Classes: BadRequestError
- Exports: BadRequestError

### Recreate

Place this file at `src2/errors/response-errors/bad-request.error.ts` and use the following source:

```ts
import { ResponseError } from './abstract/response.error';

export class BadRequestError extends ResponseError {
	constructor(message: string, errorCode?: number) {
		super(message, 400, errorCode);
	}
}

```
