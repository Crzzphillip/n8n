## src2/errors/response-errors/not-found.error.ts

Overview: src2/errors/response-errors/not-found.error.ts is a core component (NotFoundError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { ResponseError } from './abstract/response.error';

### Declarations

- Classes: NotFoundError
- Exports: NotFoundError

### Recreate

Place this file at `src2/errors/response-errors/not-found.error.ts` and use the following source:

```ts
import { ResponseError } from './abstract/response.error';

export class NotFoundError extends ResponseError {
	static isDefinedAndNotNull<T>(
		value: T | undefined | null,
		message: string,
		hint?: string,
	): asserts value is T {
		if (value === undefined || value === null) {
			throw new NotFoundError(message, hint);
		}
	}

	constructor(message: string, hint: string | undefined = undefined) {
		super(message, 404, 404, hint);
	}
}

```
