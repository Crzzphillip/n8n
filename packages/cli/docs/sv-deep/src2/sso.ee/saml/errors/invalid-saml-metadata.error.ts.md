## src2/sso.ee/saml/errors/invalid-saml-metadata.error.ts

Overview: src2/sso.ee/saml/errors/invalid-saml-metadata.error.ts is a core component (InvalidSamlMetadataError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UserError } from 'n8n-workflow';

### Declarations

- Classes: InvalidSamlMetadataError
- Exports: InvalidSamlMetadataError

### Recreate

Place this file at `src2/sso.ee/saml/errors/invalid-saml-metadata.error.ts` and use the following source:

```ts
import { UserError } from 'n8n-workflow';

export class InvalidSamlMetadataError extends UserError {
	constructor(detail: string = '') {
		super(`Invalid SAML metadata${detail ? ': ' + detail : ''}`);
	}
}

```
