## src2/environments.ee/source-control/types/source-control-set-read-only.ts

Overview: src2/environments.ee/source-control/types/source-control-set-read-only.ts is a core component (SourceControlSetReadOnly) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { IsBoolean } from 'class-validator';

### Declarations

- Classes: SourceControlSetReadOnly
- Exports: SourceControlSetReadOnly

### Recreate

Place this file at `src2/environments.ee/source-control/types/source-control-set-read-only.ts` and use the following source:

```ts
import { IsBoolean } from 'class-validator';

export class SourceControlSetReadOnly {
	@IsBoolean()
	branchReadOnly: boolean;
}

```
