## src2/controllers/workflow-statistics.types.ts

Overview: src2/controllers/workflow-statistics.types.ts defines an HTTP controller that exposes Express routes for a focused domain.

How it works: Registered via the ControllerRegistry during server bootstrap. Each handler delegates to services and applies DTO validation, returning sanitized responses.

Why: Separation of transport and domain logic improves testability and consistency of route registration.

### Imports

- import type { ExecutionRequest } from '@/executions/execution.types';

### Declarations

- Exports: GetOne

### Recreate

Place this file at `src2/controllers/workflow-statistics.types.ts` and use the following source:

```ts
import type { ExecutionRequest } from '@/executions/execution.types';

export namespace StatisticsRequest {
	export type GetOne = ExecutionRequest.GetOne;
}

```
