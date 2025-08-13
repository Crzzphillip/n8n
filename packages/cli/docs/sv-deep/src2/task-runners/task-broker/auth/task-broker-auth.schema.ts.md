## src2/task-runners/task-broker/auth/task-broker-auth.schema.ts

Overview: src2/task-runners/task-broker/auth/task-broker-auth.schema.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { z } from 'zod';

### Declarations

- Exports: taskBrokerAuthRequestBodySchema

### Recreate

Place this file at `src2/task-runners/task-broker/auth/task-broker-auth.schema.ts` and use the following source:

```ts
import { z } from 'zod';

export const taskBrokerAuthRequestBodySchema = z.object({
	token: z.string().min(1),
});

```
