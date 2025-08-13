## src2/errors/shared-workflow-not-found.error.ts

Overview: src2/errors/shared-workflow-not-found.error.ts is a core component (SharedWorkflowNotFoundError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UserError } from 'n8n-workflow';

### Declarations

- Classes: SharedWorkflowNotFoundError
- Exports: SharedWorkflowNotFoundError

### Recreate

Place this file at `src2/errors/shared-workflow-not-found.error.ts` and use the following source:

```ts
import { UserError } from 'n8n-workflow';

export class SharedWorkflowNotFoundError extends UserError {}

```
