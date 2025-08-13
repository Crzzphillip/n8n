## src2/webhooks/webhooks.controller.ts

Overview: src2/webhooks/webhooks.controller.ts is a core component (WebhooksController) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { Post, RestController } from '@n8n/decorators';
- import { Request } from 'express';
- import get from 'lodash/get';
- import { WebhookService } from './webhook.service';
- import type { Method } from './webhook.types';

### Declarations

- Classes: WebhooksController
- Exports: WebhooksController

### Recreate

Place this file at `src2/webhooks/webhooks.controller.ts` and use the following source:

```ts
import { Post, RestController } from '@n8n/decorators';
import { Request } from 'express';
import get from 'lodash/get';

import { WebhookService } from './webhook.service';
import type { Method } from './webhook.types';

@RestController('/webhooks')
export class WebhooksController {
	constructor(private readonly webhookService: WebhookService) {}

	@Post('/find')
	async findWebhook(req: Request) {
		const body = get(req, 'body', {}) as { path: string; method: Method };

		try {
			const webhook = await this.webhookService.findWebhook(body.method, body.path);
			return webhook;
		} catch (error) {
			return null;
		}
	}
}

```
