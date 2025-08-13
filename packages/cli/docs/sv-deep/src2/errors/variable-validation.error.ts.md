## src2/errors/variable-validation.error.ts

Overview: src2/errors/variable-validation.error.ts is a core component (VariableValidationError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UnexpectedError } from 'n8n-workflow';

### Declarations

- Classes: VariableValidationError
- Exports: VariableValidationError

### Recreate

Place this file at `src2/errors/variable-validation.error.ts` and use the following source:

```ts
import { UnexpectedError } from 'n8n-workflow';

export class VariableValidationError extends UnexpectedError {}

```
