## src2/errors/workflow-history-version-not-found.error.ts

Overview: src2/errors/workflow-history-version-not-found.error.ts is a core component (WorkflowHistoryVersionNotFoundError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UnexpectedError } from 'n8n-workflow';

### Declarations

- Classes: WorkflowHistoryVersionNotFoundError
- Exports: WorkflowHistoryVersionNotFoundError

### Recreate

Place this file at `src2/errors/workflow-history-version-not-found.error.ts` and use the following source:

```ts
import { UnexpectedError } from 'n8n-workflow';

export class WorkflowHistoryVersionNotFoundError extends UnexpectedError {}

```
