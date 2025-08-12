## src2/controllers/__tests__/translation.controller.test.ts

Overview: src2/controllers/__tests__/translation.controller.test.ts defines an HTTP controller that exposes Express routes for a focused domain.

How it works: Registered via the ControllerRegistry during server bootstrap. Each handler delegates to services and applies DTO validation, returning sanitized responses.

Why: Separation of transport and domain logic improves testability and consistency of route registration.

### Imports

- import type { GlobalConfig } from '@n8n/config';
- import { mock } from 'jest-mock-extended';
- import type { TranslationRequest } from '@/controllers/translation.controller';
- import {
- import type { CredentialTypes } from '@/credential-types';
- import { BadRequestError } from '@/errors/response-errors/bad-request.error';

### Recreate

Place this file at `src2/controllers/__tests__/translation.controller.test.ts` and use the following source:

```ts
import type { GlobalConfig } from '@n8n/config';
import { mock } from 'jest-mock-extended';

import type { TranslationRequest } from '@/controllers/translation.controller';
import {
	TranslationController,
	CREDENTIAL_TRANSLATIONS_DIR,
} from '@/controllers/translation.controller';
import type { CredentialTypes } from '@/credential-types';
import { BadRequestError } from '@/errors/response-errors/bad-request.error';

describe('TranslationController', () => {
	const credentialTypes = mock<CredentialTypes>();
	const controller = new TranslationController(
		credentialTypes,
		mock<GlobalConfig>({ defaultLocale: 'de' }),
	);

	describe('getCredentialTranslation', () => {
		it('should throw 400 on invalid credential types', async () => {
			const credentialType = 'not-a-valid-credential-type';
			const req = mock<TranslationRequest.Credential>({ query: { credentialType } });
			credentialTypes.recognizes.calledWith(credentialType).mockReturnValue(false);

			await expect(controller.getCredentialTranslation(req)).rejects.toThrowError(
				new BadRequestError(`Invalid Credential type: "${credentialType}"`),
			);
		});

		it('should return translation json on valid credential types', async () => {
			const credentialType = 'credential-type';
			const req = mock<TranslationRequest.Credential>({ query: { credentialType } });
			credentialTypes.recognizes.calledWith(credentialType).mockReturnValue(true);
			const response = { translation: 'string' };
			jest.mock(`${CREDENTIAL_TRANSLATIONS_DIR}/de/credential-type.json`, () => response, {
				virtual: true,
			});

			expect(await controller.getCredentialTranslation(req)).toEqual(response);
		});
	});
});

```
