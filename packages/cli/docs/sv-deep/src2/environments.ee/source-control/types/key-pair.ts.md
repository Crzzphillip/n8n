## src2/environments.ee/source-control/types/key-pair.ts

Overview: src2/environments.ee/source-control/types/key-pair.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Declarations

- Exports: KeyPair

### Recreate

Place this file at `src2/environments.ee/source-control/types/key-pair.ts` and use the following source:

```ts
export interface KeyPair {
	privateKey: string;
	publicKey: string;
}

```
