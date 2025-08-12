## src2/services/__tests__/credentials-tester.service.test.ts

Overview: src2/services/__tests__/credentials-tester.service.test.ts provides a service encapsulating domain logic and integrations.

How it works: Injected via DI, composes repositories, utilities, and external APIs into cohesive operations.

Why: Keeps controllers/commands thin and enables unit testing with dependency mocks.

### Imports

- import mock from 'jest-mock-extended/lib/Mock';
- import type { ICredentialType, INodeType } from 'n8n-workflow';
- import type { CredentialTypes } from '@/credential-types';
- import type { NodeTypes } from '@/node-types';
- import { CredentialsTester } from '@/services/credentials-tester.service';

### Recreate

Place this file at `src2/services/__tests__/credentials-tester.service.test.ts` and use the following source:

```ts
import mock from 'jest-mock-extended/lib/Mock';
import type { ICredentialType, INodeType } from 'n8n-workflow';

import type { CredentialTypes } from '@/credential-types';
import type { NodeTypes } from '@/node-types';
import { CredentialsTester } from '@/services/credentials-tester.service';

describe('CredentialsTester', () => {
	const credentialTypes = mock<CredentialTypes>();
	const nodeTypes = mock<NodeTypes>();
	const credentialsTester = new CredentialsTester(
		mock(),
		mock(),
		credentialTypes,
		nodeTypes,
		mock(),
	);

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should find the OAuth2 credential test for a generic OAuth2 API credential', () => {
		credentialTypes.getByName.mockReturnValue(mock<ICredentialType>({ test: undefined }));
		credentialTypes.getSupportedNodes.mockReturnValue(['oAuth2Api']);
		credentialTypes.getParentTypes.mockReturnValue([]);
		nodeTypes.getByName.mockReturnValue(
			mock<INodeType>({
				description: { credentials: [{ name: 'oAuth2Api' }] },
			}),
		);

		const testFn = credentialsTester.getCredentialTestFunction('oAuth2Api');

		if (typeof testFn !== 'function') fail();

		expect(testFn.name).toBe('oauth2CredTest');
	});
});

```
