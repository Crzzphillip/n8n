## src2/errors/response-errors/content-too-large.error.ts

Overview: src2/errors/response-errors/content-too-large.error.ts is a core component (ContentTooLargeError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { ResponseError } from './abstract/response.error';

### Declarations

- Classes: ContentTooLargeError
- Exports: ContentTooLargeError

### Recreate

Place this file at `src2/errors/response-errors/content-too-large.error.ts` and use the following source:

```ts
import { ResponseError } from './abstract/response.error';

export class ContentTooLargeError extends ResponseError {
	constructor(message: string, hint: string | undefined = undefined) {
		super(message, 413, 413, hint);
	}
}

```
