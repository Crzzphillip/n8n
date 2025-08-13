## src2/modules/external-secrets.ee/errors/unknown-auth-type.error.ts

Overview: src2/modules/external-secrets.ee/errors/unknown-auth-type.error.ts is a core component (UnknownAuthTypeError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UnexpectedError } from 'n8n-workflow';

### Declarations

- Classes: UnknownAuthTypeError
- Exports: UnknownAuthTypeError

### Recreate

Place this file at `src2/modules/external-secrets.ee/errors/unknown-auth-type.error.ts` and use the following source:

```ts
import { UnexpectedError } from 'n8n-workflow';

export class UnknownAuthTypeError extends UnexpectedError {
	constructor(authType: string) {
		super('Unknown auth type', { extra: { authType } });
	}
}

```
