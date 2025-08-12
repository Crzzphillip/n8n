## src2/environments.ee/source-control/types/source-control-disconnect.ts

Overview: src2/environments.ee/source-control/types/source-control-disconnect.ts is a core component (SourceControlDisconnect) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { IsBoolean, IsOptional } from 'class-validator';

### Declarations

- Classes: SourceControlDisconnect
- Exports: SourceControlDisconnect

### Recreate

Place this file at `src2/environments.ee/source-control/types/source-control-disconnect.ts` and use the following source:

```ts
import { IsBoolean, IsOptional } from 'class-validator';

export class SourceControlDisconnect {
	@IsBoolean()
	@IsOptional()
	keepKeyPair?: boolean;
}

```
