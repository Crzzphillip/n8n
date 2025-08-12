## src2/controllers/cta.controller.ts

Overview: src2/controllers/cta.controller.ts defines an HTTP controller (CtaController) that exposes Express routes for a focused domain. Base route: `/cta`.

How it works: Registered via the ControllerRegistry during server bootstrap. Each handler delegates to services and applies DTO validation, returning sanitized responses.

Why: Separation of transport and domain logic improves testability and consistency of route registration.

### Imports

- import { AuthenticatedRequest } from '@n8n/db';
- import { Get, RestController } from '@n8n/decorators';
- import express from 'express';
- import { CtaService } from '@/services/cta.service';

### Declarations

- Classes: CtaController
- Exports: CtaController

### Recreate

Place this file at `src2/controllers/cta.controller.ts` and use the following source:

```ts
import { AuthenticatedRequest } from '@n8n/db';
import { Get, RestController } from '@n8n/decorators';
import express from 'express';

import { CtaService } from '@/services/cta.service';

/**
 * Controller for Call to Action (CTA) endpoints. CTAs are certain
 * messages that are shown to users in the UI.
 */
@RestController('/cta')
export class CtaController {
	constructor(private readonly ctaService: CtaService) {}

	@Get('/become-creator')
	async getCta(req: AuthenticatedRequest, res: express.Response) {
		const becomeCreator = await this.ctaService.getBecomeCreatorCta(req.user.id);

		res.json(becomeCreator);
	}
}

```
