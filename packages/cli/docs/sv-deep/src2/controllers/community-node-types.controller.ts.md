## src2/controllers/community-node-types.controller.ts

Overview: src2/controllers/community-node-types.controller.ts defines an HTTP controller (CommunityNodeTypesController) that exposes Express routes for a focused domain. Base route: `/community-node-types`.

How it works: Registered via the ControllerRegistry during server bootstrap. Each handler delegates to services and applies DTO validation, returning sanitized responses.

Why: Separation of transport and domain logic improves testability and consistency of route registration.

### Imports

- import type { CommunityNodeType } from '@n8n/api-types';
- import { Get, RestController } from '@n8n/decorators';
- import { Request } from 'express';
- import { CommunityNodeTypesService } from '@/services/community-node-types.service';

### Declarations

- Classes: CommunityNodeTypesController
- Exports: CommunityNodeTypesController

### Recreate

Place this file at `src2/controllers/community-node-types.controller.ts` and use the following source:

```ts
import type { CommunityNodeType } from '@n8n/api-types';
import { Get, RestController } from '@n8n/decorators';
import { Request } from 'express';

import { CommunityNodeTypesService } from '@/services/community-node-types.service';

@RestController('/community-node-types')
export class CommunityNodeTypesController {
	constructor(private readonly communityNodeTypesService: CommunityNodeTypesService) {}

	@Get('/:name')
	async getCommunityNodeType(req: Request): Promise<CommunityNodeType | null> {
		return await this.communityNodeTypesService.getCommunityNodeType(req.params.name);
	}

	@Get('/')
	async getCommunityNodeTypes() {
		return await this.communityNodeTypesService.getCommunityNodeTypes();
	}
}

```
