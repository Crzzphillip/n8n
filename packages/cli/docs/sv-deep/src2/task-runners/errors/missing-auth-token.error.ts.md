## src2/task-runners/errors/missing-auth-token.error.ts

Overview: src2/task-runners/errors/missing-auth-token.error.ts is a core component (MissingAuthTokenError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Declarations

- Classes: MissingAuthTokenError
- Exports: MissingAuthTokenError

### Recreate

Place this file at `src2/task-runners/errors/missing-auth-token.error.ts` and use the following source:

```ts
export class MissingAuthTokenError extends Error {
	constructor() {
		super(
			'Missing auth token. When `N8N_RUNNERS_MODE` is `external`, it is required to set `N8N_RUNNERS_AUTH_TOKEN`. Its value should be a shared secret between the main instance and the launcher.',
		);
	}
}

```
