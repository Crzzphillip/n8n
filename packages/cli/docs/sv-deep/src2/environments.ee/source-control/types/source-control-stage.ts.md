## src2/environments.ee/source-control/types/source-control-stage.ts

Overview: src2/environments.ee/source-control/types/source-control-stage.ts is a core component (SourceControlStage) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { IsOptional, IsString } from 'class-validator';

### Declarations

- Classes: SourceControlStage
- Exports: SourceControlStage

### Recreate

Place this file at `src2/environments.ee/source-control/types/source-control-stage.ts` and use the following source:

```ts
import { IsOptional, IsString } from 'class-validator';

export class SourceControlStage {
	@IsString({ each: true })
	@IsOptional()
	fileNames?: Set<string>;

	@IsString({ each: true })
	@IsOptional()
	workflowIds?: Set<string>;

	@IsString({ each: true })
	@IsOptional()
	credentialIds?: Set<string>;
}

```
