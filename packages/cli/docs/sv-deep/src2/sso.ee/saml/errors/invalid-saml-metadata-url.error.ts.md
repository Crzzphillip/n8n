## src2/sso.ee/saml/errors/invalid-saml-metadata-url.error.ts

Overview: src2/sso.ee/saml/errors/invalid-saml-metadata-url.error.ts is a core component (InvalidSamlMetadataUrlError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UserError } from 'n8n-workflow';

### Declarations

- Classes: InvalidSamlMetadataUrlError
- Exports: InvalidSamlMetadataUrlError

### Recreate

Place this file at `src2/sso.ee/saml/errors/invalid-saml-metadata-url.error.ts` and use the following source:

```ts
import { UserError } from 'n8n-workflow';

export class InvalidSamlMetadataUrlError extends UserError {
	constructor(url: string) {
		super(`Failed to produce valid SAML metadata from ${url}`);
	}
}

```
