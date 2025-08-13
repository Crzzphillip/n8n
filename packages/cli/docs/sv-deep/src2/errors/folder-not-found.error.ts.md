## src2/errors/folder-not-found.error.ts

Overview: src2/errors/folder-not-found.error.ts is a core component (FolderNotFoundError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { OperationalError } from 'n8n-workflow';

### Declarations

- Classes: FolderNotFoundError
- Exports: FolderNotFoundError

### Recreate

Place this file at `src2/errors/folder-not-found.error.ts` and use the following source:

```ts
import { OperationalError } from 'n8n-workflow';

export class FolderNotFoundError extends OperationalError {
	constructor(folderId: string) {
		super(`Could not find the folder: ${folderId}`, {
			level: 'warning',
		});
	}
}

```
