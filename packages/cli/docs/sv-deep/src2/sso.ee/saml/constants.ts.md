## src2/sso.ee/saml/constants.ts

Overview: src2/sso.ee/saml/constants.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Declarations

- Exports: SAML_PREFERENCES_DB_KEY, SAML_LOGIN_LABEL, SAML_LOGIN_ENABLED

### Recreate

Place this file at `src2/sso.ee/saml/constants.ts` and use the following source:

```ts
export const SAML_PREFERENCES_DB_KEY = 'features.saml';
export const SAML_LOGIN_LABEL = 'sso.saml.loginLabel';
export const SAML_LOGIN_ENABLED = 'sso.saml.loginEnabled';

```
