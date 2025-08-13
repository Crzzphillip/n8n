## src2/events/event.service.ts

Overview: src2/events/event.service.ts is a core component (EventService) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { Service } from '@n8n/di';
- import { TypedEmitter } from '@/typed-emitter';
- import type { AiEventMap } from './maps/ai.event-map';
- import type { QueueMetricsEventMap } from './maps/queue-metrics.event-map';
- import type { RelayEventMap } from './maps/relay.event-map';

### Declarations

- Classes: EventService
- Exports: EventService

### Recreate

Place this file at `src2/events/event.service.ts` and use the following source:

```ts
import { Service } from '@n8n/di';

import { TypedEmitter } from '@/typed-emitter';

import type { AiEventMap } from './maps/ai.event-map';
import type { QueueMetricsEventMap } from './maps/queue-metrics.event-map';
import type { RelayEventMap } from './maps/relay.event-map';

type EventMap = RelayEventMap & QueueMetricsEventMap & AiEventMap;

@Service()
export class EventService extends TypedEmitter<EventMap> {}

```
