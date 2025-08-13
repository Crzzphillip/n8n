## src2/services/__tests__/naming.service.test.ts

Overview: src2/services/__tests__/naming.service.test.ts provides a service encapsulating domain logic and integrations.

How it works: Injected via DI, composes repositories, utilities, and external APIs into cohesive operations.

Why: Keeps controllers/commands thin and enables unit testing with dependency mocks.

### Imports

- import { mockInstance } from '@n8n/backend-test-utils';
- import type { CredentialsEntity, WorkflowEntity } from '@n8n/db';
- import { CredentialsRepository, WorkflowRepository } from '@n8n/db';
- import { NamingService } from '@/services/naming.service';

### Recreate

Place this file at `src2/services/__tests__/naming.service.test.ts` and use the following source:

```ts
import { mockInstance } from '@n8n/backend-test-utils';
import type { CredentialsEntity, WorkflowEntity } from '@n8n/db';
import { CredentialsRepository, WorkflowRepository } from '@n8n/db';

import { NamingService } from '@/services/naming.service';

describe('NamingService', () => {
	const workflowRepository = mockInstance(WorkflowRepository);
	const credentialsRepository = mockInstance(CredentialsRepository);

	const namingService = new NamingService(workflowRepository, credentialsRepository);

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	describe('getUniqueWorkflowName()', () => {
		test('should return requested name if already unique', async () => {
			workflowRepository.findStartingWith.mockResolvedValue([]);

			const name = await namingService.getUniqueWorkflowName('foo');

			expect(name).toEqual('foo');
		});

		test('should return requested name suffixed if already existing once', async () => {
			workflowRepository.findStartingWith.mockResolvedValue([{ name: 'foo' }] as WorkflowEntity[]);

			const name = await namingService.getUniqueWorkflowName('foo');

			expect(name).toEqual('foo 2');
		});

		test('should return requested name with incremented suffix if already suffixed', async () => {
			const existingNames = [{ name: 'foo' }, { name: 'foo 2' }] as WorkflowEntity[];

			workflowRepository.findStartingWith.mockResolvedValue(existingNames);

			const name = await namingService.getUniqueWorkflowName('foo');

			expect(name).toEqual('foo 3');

			existingNames.push({ name: 'foo 3' } as WorkflowEntity);

			const _name = await namingService.getUniqueWorkflowName('foo');

			expect(_name).toEqual('foo 4');
		});
	});

	describe('getUniqueCredentialName()', () => {
		test('should return requested name if already unique', async () => {
			credentialsRepository.findStartingWith.mockResolvedValue([]);

			const name = await namingService.getUniqueCredentialName('foo');

			expect(name).toEqual('foo');
		});

		test('should return requested name suffixed if already existing once', async () => {
			credentialsRepository.findStartingWith.mockResolvedValue([
				{ name: 'foo' },
			] as CredentialsEntity[]);

			const name = await namingService.getUniqueCredentialName('foo');

			expect(name).toEqual('foo 2');
		});

		test('should return requested name with incremented suffix if already suffixed', async () => {
			const existingNames = [{ name: 'foo' }, { name: 'foo 2' }] as CredentialsEntity[];

			credentialsRepository.findStartingWith.mockResolvedValue(existingNames);

			const name = await namingService.getUniqueCredentialName('foo');

			expect(name).toEqual('foo 3');

			existingNames.push({ name: 'foo 3' } as CredentialsEntity);

			const _name = await namingService.getUniqueCredentialName('foo');

			expect(_name).toEqual('foo 4');
		});
	});
});

```
