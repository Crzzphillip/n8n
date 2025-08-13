## src2/errors/response-errors/invalid-mfa-recovery-code-error.ts

Overview: src2/errors/response-errors/invalid-mfa-recovery-code-error.ts is a core component (InvalidMfaRecoveryCodeError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { ForbiddenError } from './forbidden.error';

### Declarations

- Classes: InvalidMfaRecoveryCodeError
- Exports: InvalidMfaRecoveryCodeError

### Recreate

Place this file at `src2/errors/response-errors/invalid-mfa-recovery-code-error.ts` and use the following source:

```ts
import { ForbiddenError } from './forbidden.error';

export class InvalidMfaRecoveryCodeError extends ForbiddenError {
	constructor(hint?: string) {
		super('Invalid MFA recovery code', hint);
	}
}

```
