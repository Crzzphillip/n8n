## src2/crash-journal.ts

Overview: src2/crash-journal.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { inProduction, Logger } from '@n8n/backend-common';
- import { Container } from '@n8n/di';
- import { existsSync } from 'fs';
- import { mkdir, utimes, open, rm } from 'fs/promises';
- import { InstanceSettings } from 'n8n-core';
- import { sleep } from 'n8n-workflow';
- import { join, dirname } from 'path';

### Declarations

- Exports: touchFile, init, cleanup

### Recreate

Place this file at `src2/crash-journal.ts` and use the following source:

```ts
import { inProduction, Logger } from '@n8n/backend-common';
import { Container } from '@n8n/di';
import { existsSync } from 'fs';
import { mkdir, utimes, open, rm } from 'fs/promises';
import { InstanceSettings } from 'n8n-core';
import { sleep } from 'n8n-workflow';
import { join, dirname } from 'path';

export const touchFile = async (filePath: string): Promise<void> => {
	await mkdir(dirname(filePath), { recursive: true });
	const time = new Date();
	try {
		await utimes(filePath, time, time);
	} catch {
		const fd = await open(filePath, 'w');
		await fd.close();
	}
};

const { n8nFolder } = Container.get(InstanceSettings);
const journalFile = join(n8nFolder, 'crash.journal');

export const init = async () => {
	if (!inProduction) return;

	if (existsSync(journalFile)) {
		// Crash detected
		Container.get(Logger).error('Last session crashed');
		// add a 10 seconds pause to slow down crash-looping
		await sleep(10_000);
	}
	await touchFile(journalFile);
};

export const cleanup = async () => {
	await rm(journalFile, { force: true });
};

```
