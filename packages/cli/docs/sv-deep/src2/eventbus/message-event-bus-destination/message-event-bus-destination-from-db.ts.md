## src2/eventbus/message-event-bus-destination/message-event-bus-destination-from-db.ts

Overview: src2/eventbus/message-event-bus-destination/message-event-bus-destination-from-db.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { Logger } from '@n8n/backend-common';
- import type { EventDestinations } from '@n8n/db';
- import { Container } from '@n8n/di';
- import { MessageEventBusDestinationTypeNames } from 'n8n-workflow';
- import { MessageEventBusDestinationSentry } from './message-event-bus-destination-sentry.ee';
- import { MessageEventBusDestinationSyslog } from './message-event-bus-destination-syslog.ee';
- import { MessageEventBusDestinationWebhook } from './message-event-bus-destination-webhook.ee';
- import type { MessageEventBusDestination } from './message-event-bus-destination.ee';
- import type { MessageEventBus } from '../message-event-bus/message-event-bus';

### Declarations

- Functions: messageEventBusDestinationFromDb
- Exports: messageEventBusDestinationFromDb

### Recreate

Place this file at `src2/eventbus/message-event-bus-destination/message-event-bus-destination-from-db.ts` and use the following source:

```ts
import { Logger } from '@n8n/backend-common';
import type { EventDestinations } from '@n8n/db';
import { Container } from '@n8n/di';
import { MessageEventBusDestinationTypeNames } from 'n8n-workflow';

import { MessageEventBusDestinationSentry } from './message-event-bus-destination-sentry.ee';
import { MessageEventBusDestinationSyslog } from './message-event-bus-destination-syslog.ee';
import { MessageEventBusDestinationWebhook } from './message-event-bus-destination-webhook.ee';
import type { MessageEventBusDestination } from './message-event-bus-destination.ee';
import type { MessageEventBus } from '../message-event-bus/message-event-bus';

export function messageEventBusDestinationFromDb(
	eventBusInstance: MessageEventBus,
	dbData: EventDestinations,
): MessageEventBusDestination | null {
	const destinationData = dbData.destination;
	if ('__type' in destinationData) {
		switch (destinationData.__type) {
			case MessageEventBusDestinationTypeNames.sentry:
				return MessageEventBusDestinationSentry.deserialize(eventBusInstance, destinationData);
			case MessageEventBusDestinationTypeNames.syslog:
				return MessageEventBusDestinationSyslog.deserialize(eventBusInstance, destinationData);
			case MessageEventBusDestinationTypeNames.webhook:
				return MessageEventBusDestinationWebhook.deserialize(eventBusInstance, destinationData);
			default:
				Container.get(Logger).debug('MessageEventBusDestination __type unknown');
		}
	}
	return null;
}

```
