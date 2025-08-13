## src2/executions/validation.ts

Overview: src2/executions/validation.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { z } from 'zod';
- import { BadRequestError } from '@/errors/response-errors/bad-request.error';
- import type { ExecutionRequest } from '@/executions/execution.types';

### Declarations

- Functions: validateExecutionUpdatePayload
- Exports: validateExecutionUpdatePayload

### Recreate

Place this file at `src2/executions/validation.ts` and use the following source:

```ts
import { z } from 'zod';

import { BadRequestError } from '@/errors/response-errors/bad-request.error';
import type { ExecutionRequest } from '@/executions/execution.types';

const executionUpdateSchema = z.object({
	tags: z.array(z.string()).optional(),
	vote: z.enum(['up', 'down']).nullable().optional(),
});

export function validateExecutionUpdatePayload(
	payload: unknown,
): ExecutionRequest.ExecutionUpdatePayload {
	try {
		const validatedPayload = executionUpdateSchema.parse(payload);

		// Additional check to ensure that at least one property is provided
		const { tags, vote } = validatedPayload;
		if (!tags && vote === undefined) {
			throw new BadRequestError('No annotation provided');
		}

		return validatedPayload;
	} catch (e) {
		if (e instanceof z.ZodError) {
			throw new BadRequestError(e.message);
		}

		throw e;
	}
}

```
