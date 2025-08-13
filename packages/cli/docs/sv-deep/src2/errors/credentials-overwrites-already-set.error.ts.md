## src2/errors/credentials-overwrites-already-set.error.ts

Overview: src2/errors/credentials-overwrites-already-set.error.ts is a core component (CredentialsOverwritesAlreadySetError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UserError } from 'n8n-workflow';

### Declarations

- Classes: CredentialsOverwritesAlreadySetError
- Exports: CredentialsOverwritesAlreadySetError

### Recreate

Place this file at `src2/errors/credentials-overwrites-already-set.error.ts` and use the following source:

```ts
import { UserError } from 'n8n-workflow';

export class CredentialsOverwritesAlreadySetError extends UserError {
	constructor() {
		super('Credentials overwrites may not be set more than once.');
	}
}

```
