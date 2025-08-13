## src2/environments.ee/source-control/types/resource-owner.ts

Overview: src2/environments.ee/source-control/types/resource-owner.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Declarations

- Exports: RemoteResourceOwner, StatusResourceOwner

### Recreate

Place this file at `src2/environments.ee/source-control/types/resource-owner.ts` and use the following source:

```ts
export type RemoteResourceOwner =
	| string
	| {
			type: 'personal';
			projectId?: string; // Optional for retrocompatibility
			projectName?: string; // Optional for retrocompatibility
			personalEmail: string;
	  }
	| {
			type: 'team';
			teamId: string;
			teamName: string;
	  };

export type StatusResourceOwner = {
	type: 'personal' | 'team';
	projectId: string;
	projectName: string;
};

```
