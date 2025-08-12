## src2/controllers/user-settings.controller.ts

Overview: src2/controllers/user-settings.controller.ts defines an HTTP controller (UserSettingsController) that exposes Express routes for a focused domain. Base route: `/user-settings`.

How it works: Registered via the ControllerRegistry during server bootstrap. Each handler delegates to services and applies DTO validation, returning sanitized responses.

Why: Separation of transport and domain logic improves testability and consistency of route registration.

### Imports

- import { Patch, RestController } from '@n8n/decorators';
- import type { NpsSurveyState } from 'n8n-workflow';
- import { BadRequestError } from '@/errors/response-errors/bad-request.error';
- import { NpsSurveyRequest } from '@/requests';
- import { UserService } from '@/services/user.service';

### Declarations

- Classes: UserSettingsController
- Functions: getNpsSurveyState
- Exports: UserSettingsController

### Recreate

Place this file at `src2/controllers/user-settings.controller.ts` and use the following source:

```ts
import { Patch, RestController } from '@n8n/decorators';
import type { NpsSurveyState } from 'n8n-workflow';

import { BadRequestError } from '@/errors/response-errors/bad-request.error';
import { NpsSurveyRequest } from '@/requests';
import { UserService } from '@/services/user.service';

function getNpsSurveyState(state: unknown): NpsSurveyState | undefined {
	if (typeof state !== 'object' || state === null) {
		return;
	}
	if (!('lastShownAt' in state) || typeof state.lastShownAt !== 'number') {
		return;
	}
	if ('responded' in state && state.responded === true) {
		return {
			responded: true,
			lastShownAt: state.lastShownAt,
		};
	}

	if (
		'waitingForResponse' in state &&
		state.waitingForResponse === true &&
		'ignoredCount' in state &&
		typeof state.ignoredCount === 'number'
	) {
		return {
			waitingForResponse: true,
			ignoredCount: state.ignoredCount,
			lastShownAt: state.lastShownAt,
		};
	}

	return;
}

@RestController('/user-settings')
export class UserSettingsController {
	constructor(private readonly userService: UserService) {}

	@Patch('/nps-survey')
	async updateNpsSurvey(req: NpsSurveyRequest.NpsSurveyUpdate): Promise<void> {
		const state = getNpsSurveyState(req.body);
		if (!state) {
			throw new BadRequestError('Invalid nps survey state structure');
		}

		await this.userService.updateSettings(req.user.id, {
			npsSurvey: state,
		});
	}
}

```
