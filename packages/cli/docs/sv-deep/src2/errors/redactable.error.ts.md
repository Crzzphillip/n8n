## src2/errors/redactable.error.ts

Overview: src2/errors/redactable.error.ts is a core component (RedactableError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UnexpectedError } from 'n8n-workflow';

### Declarations

- Classes: RedactableError
- Exports: RedactableError

### Recreate

Place this file at `src2/errors/redactable.error.ts` and use the following source:

```ts
import { UnexpectedError } from 'n8n-workflow';

export class RedactableError extends UnexpectedError {
	constructor(fieldName: string, args: string) {
		super(
			`Failed to find "${fieldName}" property in argument "${args.toString()}". Please set the decorator \`@Redactable()\` only on \`LogStreamingEventRelay\` methods where the argument contains a "${fieldName}" property.`,
		);
	}
}

```
