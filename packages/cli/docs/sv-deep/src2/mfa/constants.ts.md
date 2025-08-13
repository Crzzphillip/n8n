## src2/mfa/constants.ts

Overview: src2/mfa/constants.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Declarations

- Exports: MFA_FEATURE_ENABLED, MFA_ENFORCE_SETTING

### Recreate

Place this file at `src2/mfa/constants.ts` and use the following source:

```ts
export const MFA_FEATURE_ENABLED = 'mfa.enabled';
export const MFA_ENFORCE_SETTING = 'mfa.enforced';

```
