## src2/events/relays/event-relay.ts

Overview: src2/events/relays/event-relay.ts is a core component (EventRelay) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { Service } from '@n8n/di';
- import { EventService } from '@/events/event.service';
- import type { RelayEventMap } from '@/events/maps/relay.event-map';

### Declarations

- Classes: EventRelay
- Exports: EventRelay

### Recreate

Place this file at `src2/events/relays/event-relay.ts` and use the following source:

```ts
import { Service } from '@n8n/di';

import { EventService } from '@/events/event.service';
import type { RelayEventMap } from '@/events/maps/relay.event-map';

@Service()
export class EventRelay {
	constructor(readonly eventService: EventService) {}

	protected setupListeners<EventNames extends keyof RelayEventMap>(
		map: {
			[EventName in EventNames]?: (event: RelayEventMap[EventName]) => void | Promise<void>;
		},
	) {
		for (const [eventName, handler] of Object.entries(map) as Array<
			[EventNames, (event: RelayEventMap[EventNames]) => void | Promise<void>]
		>) {
			this.eventService.on(eventName, async (event) => {
				await handler(event);
			});
		}
	}
}

```
