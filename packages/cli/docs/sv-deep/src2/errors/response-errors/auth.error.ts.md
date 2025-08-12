## src2/errors/response-errors/auth.error.ts

Overview: src2/errors/response-errors/auth.error.ts is a core component (AuthError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { ResponseError } from './abstract/response.error';

### Declarations

- Classes: AuthError
- Exports: AuthError

### Recreate

Place this file at `src2/errors/response-errors/auth.error.ts` and use the following source:

```ts
import { ResponseError } from './abstract/response.error';

export class AuthError extends ResponseError {
	constructor(message: string, errorCode?: number) {
		super(message, 401, errorCode);
	}
}

```
