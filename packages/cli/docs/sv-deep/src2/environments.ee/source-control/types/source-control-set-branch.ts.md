## src2/environments.ee/source-control/types/source-control-set-branch.ts

Overview: src2/environments.ee/source-control/types/source-control-set-branch.ts is a core component (SourceControlSetBranch) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { IsString } from 'class-validator';

### Declarations

- Classes: SourceControlSetBranch
- Exports: SourceControlSetBranch

### Recreate

Place this file at `src2/environments.ee/source-control/types/source-control-set-branch.ts` and use the following source:

```ts
import { IsString } from 'class-validator';

export class SourceControlSetBranch {
	@IsString()
	branch: string;
}

```
