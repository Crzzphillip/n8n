## src2/errors/variable-count-limit-reached.error.ts

Overview: src2/errors/variable-count-limit-reached.error.ts is a core component (VariableCountLimitReachedError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UserError } from 'n8n-workflow';

### Declarations

- Classes: VariableCountLimitReachedError
- Exports: VariableCountLimitReachedError

### Recreate

Place this file at `src2/errors/variable-count-limit-reached.error.ts` and use the following source:

```ts
import { UserError } from 'n8n-workflow';

export class VariableCountLimitReachedError extends UserError {}

```
