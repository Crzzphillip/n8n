## src2/environments.ee/source-control/types/key-pair-type.ts

Overview: src2/environments.ee/source-control/types/key-pair-type.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Declarations

- Exports: KeyPairType

### Recreate

Place this file at `src2/environments.ee/source-control/types/key-pair-type.ts` and use the following source:

```ts
export type KeyPairType = 'ed25519' | 'rsa';

```
