## src2/sso.ee/saml/types.ts

Overview: src2/sso.ee/saml/types.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { SamlPreferences } from '@n8n/api-types';

### Declarations

- Exports: SamlLoginBinding, SamlAttributeMapping, SamlUserAttributes

### Recreate

Place this file at `src2/sso.ee/saml/types.ts` and use the following source:

```ts
import type { SamlPreferences } from '@n8n/api-types';

export type SamlLoginBinding = SamlPreferences['loginBinding'];
export type SamlAttributeMapping = NonNullable<SamlPreferences['mapping']>;
export type SamlUserAttributes = SamlAttributeMapping;

```
