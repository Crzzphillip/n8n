## src2/environments.ee/source-control/types/exportable-folders.ts

Overview: src2/environments.ee/source-control/types/exportable-folders.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Declarations

- Exports: ExportableFolder, ExportedFolders

### Recreate

Place this file at `src2/environments.ee/source-control/types/exportable-folders.ts` and use the following source:

```ts
export type ExportableFolder = {
	id: string;
	name: string;
	parentFolderId: string | null;
	homeProjectId: string;
	createdAt: string;
	updatedAt: string;
};

export type ExportedFolders = {
	folders: ExportableFolder[];
};

```
