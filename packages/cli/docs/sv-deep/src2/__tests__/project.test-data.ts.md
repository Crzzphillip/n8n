## src2/__tests__/project.test-data.ts

Overview: src2/__tests__/project.test-data.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { Project } from '@n8n/db';
- import { nanoId, date, firstName, lastName, email } from 'minifaker';
- import 'minifaker/locales/en';

### Declarations

- Exports: createRawProjectData

### Recreate

Place this file at `src2/__tests__/project.test-data.ts` and use the following source:

```ts
import type { Project } from '@n8n/db';
import { nanoId, date, firstName, lastName, email } from 'minifaker';
import 'minifaker/locales/en';

type RawProjectData = Pick<Project, 'name' | 'type' | 'createdAt' | 'updatedAt' | 'id'>;

const projectName = `${firstName()} ${lastName()} <${email}>`;

export const createRawProjectData = (payload: Partial<RawProjectData>): Project => {
	return {
		createdAt: date(),
		updatedAt: date(),
		id: nanoId.nanoid(),
		name: projectName,
		type: 'personal',
		...payload,
	} as Project;
};

```
