## src2/errors/response-errors/invalid-mfa-code.error.ts

Overview: src2/errors/response-errors/invalid-mfa-code.error.ts is a core component (InvalidMfaCodeError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { ForbiddenError } from './forbidden.error';

### Declarations

- Classes: InvalidMfaCodeError
- Exports: InvalidMfaCodeError

### Recreate

Place this file at `src2/errors/response-errors/invalid-mfa-code.error.ts` and use the following source:

```ts
import { ForbiddenError } from './forbidden.error';

export class InvalidMfaCodeError extends ForbiddenError {
	constructor(hint?: string) {
		super('Invalid two-factor code.', hint);
	}
}

```
