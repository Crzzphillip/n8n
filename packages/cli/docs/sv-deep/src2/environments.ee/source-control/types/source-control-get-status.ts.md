## src2/environments.ee/source-control/types/source-control-get-status.ts

Overview: src2/environments.ee/source-control/types/source-control-get-status.ts is a core component (SourceControlGetStatus) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { IsBoolean, IsOptional, IsString } from 'class-validator';

### Declarations

- Classes: SourceControlGetStatus
- Functions: booleanFromString
- Exports: SourceControlGetStatus

### Recreate

Place this file at `src2/environments.ee/source-control/types/source-control-get-status.ts` and use the following source:

```ts
import { IsBoolean, IsOptional, IsString } from 'class-validator';

function booleanFromString(value: string | boolean): boolean {
	if (typeof value === 'boolean') {
		return value;
	}
	return value === 'true';
}

export class SourceControlGetStatus {
	@IsString()
	@IsOptional()
	direction: 'push' | 'pull';

	@IsBoolean()
	@IsOptional()
	preferLocalVersion: boolean;

	@IsBoolean()
	@IsOptional()
	verbose: boolean;

	constructor(values: {
		direction: 'push' | 'pull';
		preferLocalVersion: string | boolean;
		verbose: string | boolean;
	}) {
		this.direction = values.direction || 'push';
		this.preferLocalVersion = booleanFromString(values.preferLocalVersion) || true;
		this.verbose = booleanFromString(values.verbose) || false;
	}
}

```
