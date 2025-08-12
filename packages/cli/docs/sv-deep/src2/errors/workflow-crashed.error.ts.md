## src2/errors/workflow-crashed.error.ts

Overview: src2/errors/workflow-crashed.error.ts is a core component (WorkflowCrashedError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { WorkflowOperationError } from 'n8n-workflow';

### Declarations

- Classes: WorkflowCrashedError
- Exports: WorkflowCrashedError

### Recreate

Place this file at `src2/errors/workflow-crashed.error.ts` and use the following source:

```ts
import { WorkflowOperationError } from 'n8n-workflow';

export class WorkflowCrashedError extends WorkflowOperationError {
	constructor() {
		super('Workflow did not finish, possible out-of-memory issue');
	}
}

```
