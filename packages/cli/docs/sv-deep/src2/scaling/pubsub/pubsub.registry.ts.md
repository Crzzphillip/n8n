## src2/scaling/pubsub/pubsub.registry.ts

Overview: src2/scaling/pubsub/pubsub.registry.ts is a core component (PubSubRegistry) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { Logger } from '@n8n/backend-common';
- import { PubSubMetadata } from '@n8n/decorators';
- import { Container, Service } from '@n8n/di';
- import { InstanceSettings } from 'n8n-core';
- import { PubSubEventBus } from './pubsub.eventbus';

### Declarations

- Classes: PubSubRegistry
- Exports: PubSubRegistry

### Recreate

Place this file at `src2/scaling/pubsub/pubsub.registry.ts` and use the following source:

```ts
import { Logger } from '@n8n/backend-common';
import { PubSubMetadata } from '@n8n/decorators';
import { Container, Service } from '@n8n/di';
import { InstanceSettings } from 'n8n-core';

import { PubSubEventBus } from './pubsub.eventbus';

@Service()
export class PubSubRegistry {
	constructor(
		private readonly logger: Logger,
		private readonly instanceSettings: InstanceSettings,
		private readonly pubSubMetadata: PubSubMetadata,
		private readonly pubsubEventBus: PubSubEventBus,
	) {
		this.logger = this.logger.scoped('pubsub');
	}

	init() {
		const { instanceSettings, pubSubMetadata } = this;
		const handlers = pubSubMetadata.getHandlers();
		for (const { eventHandlerClass, methodName, eventName, filter } of handlers) {
			const handlerClass = Container.get(eventHandlerClass);
			if (!filter?.instanceType || filter.instanceType === instanceSettings.instanceType) {
				this.logger.debug(
					`Registered a "${eventName}" event handler on ${eventHandlerClass.name}#${methodName}`,
				);
				this.pubsubEventBus.on(eventName, async (...args: unknown[]) => {
					// Since the instance role can change, this check needs to be in the event listener
					const shouldTrigger =
						filter?.instanceType !== 'main' ||
						!filter.instanceRole ||
						filter.instanceRole === instanceSettings.instanceRole;
					if (shouldTrigger) await handlerClass[methodName].call(handlerClass, ...args);
				});
			}
		}
	}
}

```
