## src2/auth/index.ts

Overview: src2/auth/index.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/auth/index.ts` and use the following source:

```ts
export * from './methods/email';

```
