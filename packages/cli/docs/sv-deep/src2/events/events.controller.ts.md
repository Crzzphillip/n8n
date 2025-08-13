## src2/events/events.controller.ts

Overview: src2/events/events.controller.ts is a core component (EventsController) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { AuthenticatedRequest } from '@n8n/db';
- import { Get, RestController } from '@n8n/decorators';
- import { EventService } from './event.service';

### Declarations

- Classes: EventsController
- Exports: EventsController

### Recreate

Place this file at `src2/events/events.controller.ts` and use the following source:

```ts
import { AuthenticatedRequest } from '@n8n/db';
import { Get, RestController } from '@n8n/decorators';

import { EventService } from './event.service';

/** This controller holds endpoints that the frontend uses to trigger telemetry events */
@RestController('/events')
export class EventsController {
	constructor(private readonly eventService: EventService) {}

	@Get('/session-started')
	sessionStarted(req: AuthenticatedRequest) {
		const pushRef = req.headers['push-ref'];
		this.eventService.emit('session-started', { pushRef });
	}
}

```
