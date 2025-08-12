## src2/sso.ee/oidc/constants.ts

Overview: src2/sso.ee/oidc/constants.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Declarations

- Exports: OIDC_PREFERENCES_DB_KEY, OIDC_LOGIN_ENABLED, OIDC_CLIENT_SECRET_REDACTED_VALUE

### Recreate

Place this file at `src2/sso.ee/oidc/constants.ts` and use the following source:

```ts
export const OIDC_PREFERENCES_DB_KEY = 'features.oidc';
export const OIDC_LOGIN_ENABLED = 'sso.oidc.loginEnabled';
export const OIDC_CLIENT_SECRET_REDACTED_VALUE =
	'__n8n_CLIENT_SECRET_VALUE_e5362baf-c777-4d57-a609-6eaf1f9e87f6';

```
