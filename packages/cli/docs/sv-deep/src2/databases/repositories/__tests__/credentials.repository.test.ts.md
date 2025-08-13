## src2/databases/repositories/__tests__/credentials.repository.test.ts

Overview: src2/databases/repositories/__tests__/credentials.repository.test.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { CredentialsEntity, CredentialsRepository } from '@n8n/db';
- import { Container } from '@n8n/di';
- import { mock } from 'jest-mock-extended';
- import { mockEntityManager } from '@test/mocking';

### Recreate

Place this file at `src2/databases/repositories/__tests__/credentials.repository.test.ts` and use the following source:

```ts
import { CredentialsEntity, CredentialsRepository } from '@n8n/db';
import { Container } from '@n8n/di';
import { mock } from 'jest-mock-extended';

import { mockEntityManager } from '@test/mocking';

const entityManager = mockEntityManager(CredentialsEntity);
const repository = Container.get(CredentialsRepository);

describe('findMany', () => {
	const credentialsId = 'cred_123';
	const credential = mock<CredentialsEntity>({ id: credentialsId });

	beforeEach(() => {
		jest.resetAllMocks();
	});

	test('return `data` property if `includeData:true` and select is using the record syntax', async () => {
		// ARRANGE
		entityManager.find.mockResolvedValueOnce([credential]);

		// ACT
		const credentials = await repository.findMany({ includeData: true, select: { id: true } });

		// ASSERT
		expect(credentials).toHaveLength(1);
		expect(credentials[0]).toHaveProperty('data');
	});

	test('return `data` property if `includeData:true` and select is using the record syntax', async () => {
		// ARRANGE
		entityManager.find.mockResolvedValueOnce([credential]);

		// ACT
		const credentials = await repository.findMany({
			includeData: true,
			//TODO: fix this
			// The function's type does not support this but this is what it
			// actually gets from the service because the middlewares are typed
			// loosely.
			select: ['id'] as never,
		});

		// ASSERT
		expect(credentials).toHaveLength(1);
		expect(credentials[0]).toHaveProperty('data');
	});
});

```
