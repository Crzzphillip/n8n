## src2/evaluation.ee/test-runs.types.ee.ts

Overview: src2/evaluation.ee/test-runs.types.ee.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { AuthenticatedRequest } from '@n8n/db';
- import type { ListQuery } from '@/requests';

### Recreate

Place this file at `src2/evaluation.ee/test-runs.types.ee.ts` and use the following source:

```ts
import type { AuthenticatedRequest } from '@n8n/db';

import type { ListQuery } from '@/requests';

export declare namespace TestRunsRequest {
	namespace RouteParams {
		type WorkflowId = {
			workflowId: string;
		};

		type TestRunId = {
			id: string;
		};
	}

	type Create = AuthenticatedRequest<RouteParams.WorkflowId>;

	type GetMany = AuthenticatedRequest<RouteParams.WorkflowId, {}, {}, ListQuery.Params> & {
		listQueryOptions: ListQuery.Options;
	};

	type GetOne = AuthenticatedRequest<RouteParams.WorkflowId & RouteParams.TestRunId>;

	type Delete = AuthenticatedRequest<RouteParams.WorkflowId & RouteParams.TestRunId>;

	type Cancel = AuthenticatedRequest<RouteParams.WorkflowId & RouteParams.TestRunId>;

	type GetCases = AuthenticatedRequest<RouteParams.WorkflowId & RouteParams.TestRunId>;
}

```
