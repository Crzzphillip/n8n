## src2/utlity.types.ts

Overview: src2/utlity.types.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Declarations

- Exports: Resolve

### Recreate

Place this file at `src2/utlity.types.ts` and use the following source:

```ts
/**
 * Display an intersection type without implementation details.
 * @doc https://effectivetypescript.com/2022/02/25/gentips-4-display/
 */
// eslint-disable-next-line @typescript-eslint/no-restricted-types
export type Resolve<T> = T extends Function ? T : { [K in keyof T]: T[K] };

```
