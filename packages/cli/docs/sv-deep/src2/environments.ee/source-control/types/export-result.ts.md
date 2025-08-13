## src2/environments.ee/source-control/types/export-result.ts

Overview: src2/environments.ee/source-control/types/export-result.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Declarations

- Exports: ExportResult

### Recreate

Place this file at `src2/environments.ee/source-control/types/export-result.ts` and use the following source:

```ts
export interface ExportResult {
	count: number;
	folder: string;
	files: Array<{
		id: string;
		name: string;
	}>;
	removedFiles?: string[];
	missingIds?: string[];
}

```
