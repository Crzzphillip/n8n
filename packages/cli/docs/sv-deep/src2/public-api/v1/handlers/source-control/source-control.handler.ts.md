## src2/public-api/v1/handlers/source-control/source-control.handler.ts

Overview: src2/public-api/v1/handlers/source-control/source-control.handler.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { PullWorkFolderRequestDto } from '@n8n/api-types';
- import type { AuthenticatedRequest } from '@n8n/db';
- import { Container } from '@n8n/di';
- import type express from 'express';
- import type { StatusResult } from 'simple-git';
- import {
- import { SourceControlPreferencesService } from '@/environments.ee/source-control/source-control-preferences.service.ee';
- import { SourceControlService } from '@/environments.ee/source-control/source-control.service.ee';
- import type { ImportResult } from '@/environments.ee/source-control/types/import-result';
- import { EventService } from '@/events/event.service';
- import { apiKeyHasScopeWithGlobalScopeFallback } from '../../shared/middlewares/global.middleware';

### Recreate

Place this file at `src2/public-api/v1/handlers/source-control/source-control.handler.ts` and use the following source:

```ts
import { PullWorkFolderRequestDto } from '@n8n/api-types';
import type { AuthenticatedRequest } from '@n8n/db';
import { Container } from '@n8n/di';
import type express from 'express';
import type { StatusResult } from 'simple-git';

import {
	getTrackingInformationFromPullResult,
	isSourceControlLicensed,
} from '@/environments.ee/source-control/source-control-helper.ee';
import { SourceControlPreferencesService } from '@/environments.ee/source-control/source-control-preferences.service.ee';
import { SourceControlService } from '@/environments.ee/source-control/source-control.service.ee';
import type { ImportResult } from '@/environments.ee/source-control/types/import-result';
import { EventService } from '@/events/event.service';

import { apiKeyHasScopeWithGlobalScopeFallback } from '../../shared/middlewares/global.middleware';

export = {
	pull: [
		apiKeyHasScopeWithGlobalScopeFallback({ scope: 'sourceControl:pull' }),
		async (
			req: AuthenticatedRequest,
			res: express.Response,
		): Promise<ImportResult | StatusResult | Promise<express.Response>> => {
			const sourceControlPreferencesService = Container.get(SourceControlPreferencesService);
			if (!isSourceControlLicensed()) {
				return res
					.status(401)
					.json({ status: 'Error', message: 'Source Control feature is not licensed' });
			}
			if (!sourceControlPreferencesService.isSourceControlConnected()) {
				return res
					.status(400)
					.json({ status: 'Error', message: 'Source Control is not connected to a repository' });
			}
			try {
				const payload = PullWorkFolderRequestDto.parse(req.body);
				const sourceControlService = Container.get(SourceControlService);
				const result = await sourceControlService.pullWorkfolder(req.user, payload);

				if (result.statusCode === 200) {
					Container.get(EventService).emit('source-control-user-pulled-api', {
						...getTrackingInformationFromPullResult(req.user.id, result.statusResult),
						forced: payload.force ?? false,
					});
					return res.status(200).send(result.statusResult);
				} else {
					return res.status(409).send(result.statusResult);
				}
			} catch (error) {
				return res.status(400).send((error as { message: string }).message);
			}
		},
	],
};

```
