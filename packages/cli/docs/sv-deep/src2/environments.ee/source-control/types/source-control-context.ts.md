## src2/environments.ee/source-control/types/source-control-context.ts

Overview: src2/environments.ee/source-control/types/source-control-context.ts is a core component (SourceControlContext) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { User } from '@n8n/db';
- import { hasGlobalScope } from '@n8n/permissions';

### Declarations

- Classes: SourceControlContext
- Exports: SourceControlContext

### Recreate

Place this file at `src2/environments.ee/source-control/types/source-control-context.ts` and use the following source:

```ts
import type { User } from '@n8n/db';
import { hasGlobalScope } from '@n8n/permissions';

export class SourceControlContext {
	constructor(private readonly userInternal: User) {}

	get user() {
		return this.userInternal;
	}

	hasAccessToAllProjects() {
		return hasGlobalScope(this.userInternal, 'project:update');
	}
}

```
