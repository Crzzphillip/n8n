## src2/environments.ee/source-control/types/exportable-credential.ts

Overview: src2/environments.ee/source-control/types/exportable-credential.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { ICredentialDataDecryptedObject } from 'n8n-workflow';
- import type { RemoteResourceOwner, StatusResourceOwner } from './resource-owner';

### Declarations

- Exports: ExportableCredential, StatusExportableCredential

### Recreate

Place this file at `src2/environments.ee/source-control/types/exportable-credential.ts` and use the following source:

```ts
import type { ICredentialDataDecryptedObject } from 'n8n-workflow';

import type { RemoteResourceOwner, StatusResourceOwner } from './resource-owner';

export interface ExportableCredential {
	id: string;
	name: string;
	type: string;
	data: ICredentialDataDecryptedObject;

	/**
	 * Email of the user who owns this credential at the source instance.
	 * Ownership is mirrored at target instance if user is also present there.
	 */
	ownedBy: RemoteResourceOwner | null;
}

export type StatusExportableCredential = ExportableCredential & {
	filename: string;
	ownedBy?: StatusResourceOwner;
};

```
