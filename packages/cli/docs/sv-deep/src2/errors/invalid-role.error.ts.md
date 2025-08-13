## src2/errors/invalid-role.error.ts

Overview: src2/errors/invalid-role.error.ts is a core component (InvalidRoleError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UnexpectedError } from 'n8n-workflow';

### Declarations

- Classes: InvalidRoleError
- Exports: InvalidRoleError

### Recreate

Place this file at `src2/errors/invalid-role.error.ts` and use the following source:

```ts
import { UnexpectedError } from 'n8n-workflow';

export class InvalidRoleError extends UnexpectedError {}

```
