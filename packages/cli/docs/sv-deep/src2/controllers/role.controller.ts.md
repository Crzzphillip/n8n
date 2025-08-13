## src2/controllers/role.controller.ts

Overview: src2/controllers/role.controller.ts defines an HTTP controller (RoleController) that exposes Express routes for a focused domain. Base route: `/roles`.

How it works: Registered via the ControllerRegistry during server bootstrap. Each handler delegates to services and applies DTO validation, returning sanitized responses.

Why: Separation of transport and domain logic improves testability and consistency of route registration.

### Imports

- import { Get, RestController } from '@n8n/decorators';
- import { RoleService } from '@/services/role.service';

### Declarations

- Classes: RoleController
- Exports: RoleController

### Recreate

Place this file at `src2/controllers/role.controller.ts` and use the following source:

```ts
import { Get, RestController } from '@n8n/decorators';

import { RoleService } from '@/services/role.service';

@RestController('/roles')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Get('/')
	getAllRoles() {
		return this.roleService.getAllRoles();
	}
}

```
