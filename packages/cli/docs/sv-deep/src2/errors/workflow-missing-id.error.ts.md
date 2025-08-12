## src2/errors/workflow-missing-id.error.ts

Overview: src2/errors/workflow-missing-id.error.ts is a core component (WorkflowMissingIdError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { Workflow, IWorkflowBase } from 'n8n-workflow';
- import { UnexpectedError } from 'n8n-workflow';

### Declarations

- Classes: WorkflowMissingIdError
- Exports: WorkflowMissingIdError

### Recreate

Place this file at `src2/errors/workflow-missing-id.error.ts` and use the following source:

```ts
import type { Workflow, IWorkflowBase } from 'n8n-workflow';
import { UnexpectedError } from 'n8n-workflow';

export class WorkflowMissingIdError extends UnexpectedError {
	constructor(workflow: Workflow | IWorkflowBase) {
		super('Detected ID-less worklfow', { extra: { workflow } });
	}
}

```
