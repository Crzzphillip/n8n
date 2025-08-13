## src2/environments.ee/source-control/types/source-control-push.ts

Overview: src2/environments.ee/source-control/types/source-control-push.ts is a core component (SourceControlPush) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { IsBoolean, IsOptional } from 'class-validator';

### Declarations

- Classes: SourceControlPush
- Exports: SourceControlPush

### Recreate

Place this file at `src2/environments.ee/source-control/types/source-control-push.ts` and use the following source:

```ts
import { IsBoolean, IsOptional } from 'class-validator';

export class SourceControlPush {
	@IsBoolean()
	@IsOptional()
	force?: boolean;
}

```
