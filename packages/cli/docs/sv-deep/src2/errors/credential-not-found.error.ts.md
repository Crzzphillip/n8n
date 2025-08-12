## src2/errors/credential-not-found.error.ts

Overview: src2/errors/credential-not-found.error.ts is a core component (CredentialNotFoundError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UserError } from 'n8n-workflow';

### Declarations

- Classes: CredentialNotFoundError
- Exports: CredentialNotFoundError

### Recreate

Place this file at `src2/errors/credential-not-found.error.ts` and use the following source:

```ts
import { UserError } from 'n8n-workflow';

export class CredentialNotFoundError extends UserError {
	constructor(credentialId: string, credentialType: string) {
		super(`Credential with ID "${credentialId}" does not exist for type "${credentialType}".`);
	}
}

```
