## src2/errors/response-errors/unprocessable.error.ts

Overview: src2/errors/response-errors/unprocessable.error.ts is a core component (UnprocessableRequestError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { ResponseError } from './abstract/response.error';

### Declarations

- Classes: UnprocessableRequestError
- Exports: UnprocessableRequestError

### Recreate

Place this file at `src2/errors/response-errors/unprocessable.error.ts` and use the following source:

```ts
import { ResponseError } from './abstract/response.error';

export class UnprocessableRequestError extends ResponseError {
	constructor(message: string, hint: string | undefined = undefined) {
		super(message, 422, 422, hint);
	}
}

```
