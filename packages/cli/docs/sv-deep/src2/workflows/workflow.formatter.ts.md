## src2/workflows/workflow.formatter.ts

Overview: src2/workflows/workflow.formatter.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { IWorkflowBase } from 'n8n-workflow';

### Declarations

- Functions: formatWorkflow
- Exports: formatWorkflow

### Recreate

Place this file at `src2/workflows/workflow.formatter.ts` and use the following source:

```ts
import type { IWorkflowBase } from 'n8n-workflow';

/**
 * Display a workflow in a user-friendly format
 */
export function formatWorkflow(workflow: IWorkflowBase) {
	return `"${workflow.name}" (ID: ${workflow.id})`;
}

```
