## src2/jest.d.ts

Overview: src2/jest.d.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/jest.d.ts` and use the following source:

```ts
namespace jest {
	interface Matchers<R, T> {
		toBeEmptyArray(): T;
		toBeEmptySet(): T;
		toBeSetContaining(...items: string[]): T;
	}
}

```
