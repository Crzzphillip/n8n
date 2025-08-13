## src2/services/__tests__/credentials-finder.service.test.ts

Overview: src2/services/__tests__/credentials-finder.service.test.ts provides a service encapsulating domain logic and integrations.

How it works: Injected via DI, composes repositories, utilities, and external APIs into cohesive operations.

Why: Keeps controllers/commands thin and enables unit testing with dependency mocks.

### Imports

- import { SharedCredentials } from '@n8n/db';
- import type { CredentialsEntity, User } from '@n8n/db';
- import { Container } from '@n8n/di';
- import { In } from '@n8n/typeorm';
- import { mock } from 'jest-mock-extended';
- import { CredentialsFinderService } from '@/credentials/credentials-finder.service';
- import { mockEntityManager } from '@test/mocking';

### Recreate

Place this file at `src2/services/__tests__/credentials-finder.service.test.ts` and use the following source:

```ts
import { SharedCredentials } from '@n8n/db';
import type { CredentialsEntity, User } from '@n8n/db';
import { Container } from '@n8n/di';
import { In } from '@n8n/typeorm';
import { mock } from 'jest-mock-extended';

import { CredentialsFinderService } from '@/credentials/credentials-finder.service';
import { mockEntityManager } from '@test/mocking';

describe('CredentialsFinderService', () => {
	const entityManager = mockEntityManager(SharedCredentials);
	const credentialsFinderService = Container.get(CredentialsFinderService);

	describe('findCredentialForUser', () => {
		const credentialsId = 'cred_123';
		const sharedCredential = mock<SharedCredentials>();
		sharedCredential.credentials = mock<CredentialsEntity>({ id: credentialsId });
		const owner = mock<User>({
			role: 'global:owner',
		});
		const member = mock<User>({
			role: 'global:member',
			id: 'test',
		});

		beforeEach(() => {
			jest.resetAllMocks();
		});

		test('should allow instance owner access to all credentials', async () => {
			entityManager.findOne.mockResolvedValueOnce(sharedCredential);
			const credential = await credentialsFinderService.findCredentialForUser(
				credentialsId,
				owner,
				['credential:read'],
			);
			expect(entityManager.findOne).toHaveBeenCalledWith(SharedCredentials, {
				relations: { credentials: { shared: { project: { projectRelations: { user: true } } } } },
				where: { credentialsId },
			});
			expect(credential).toEqual(sharedCredential.credentials);
		});

		test('should allow members', async () => {
			entityManager.findOne.mockResolvedValueOnce(sharedCredential);
			const credential = await credentialsFinderService.findCredentialForUser(
				credentialsId,
				member,
				['credential:read'],
			);
			expect(entityManager.findOne).toHaveBeenCalledWith(SharedCredentials, {
				relations: { credentials: { shared: { project: { projectRelations: { user: true } } } } },
				where: {
					credentialsId,
					role: In(['credential:owner', 'credential:user']),
					project: {
						projectRelations: {
							role: In([
								'project:admin',
								'project:personalOwner',
								'project:editor',
								'project:viewer',
							]),
							userId: member.id,
						},
					},
				},
			});
			expect(credential).toEqual(sharedCredential.credentials);
		});

		test('should return null when no shared credential is found', async () => {
			entityManager.findOne.mockResolvedValueOnce(null);
			const credential = await credentialsFinderService.findCredentialForUser(
				credentialsId,
				member,
				['credential:read'],
			);
			expect(entityManager.findOne).toHaveBeenCalledWith(SharedCredentials, {
				relations: { credentials: { shared: { project: { projectRelations: { user: true } } } } },
				where: {
					credentialsId,
					role: In(['credential:owner', 'credential:user']),
					project: {
						projectRelations: {
							role: In([
								'project:admin',
								'project:personalOwner',
								'project:editor',
								'project:viewer',
							]),
							userId: member.id,
						},
					},
				},
			});
			expect(credential).toEqual(null);
		});
	});
});

```
