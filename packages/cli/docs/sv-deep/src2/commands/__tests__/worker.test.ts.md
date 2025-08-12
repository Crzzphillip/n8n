## src2/commands/__tests__/worker.test.ts

Overview: src2/commands/__tests__/worker.test.ts declares a CLI command.

How it works: Bootstraps configuration, DB, and modules via the base command, then performs its task using shared services.

Why: Centralized boot logic with per-command behavior simplifies maintenance.

### Imports

- import { mockInstance } from '@n8n/backend-test-utils';
- import { Container } from '@n8n/di';
- import { PubSubRegistry } from '@/scaling/pubsub/pubsub.registry';
- import { Subscriber } from '@/scaling/pubsub/subscriber.service';
- import { WorkerStatusService } from '@/scaling/worker-status.service.ee';
- import { RedisClientService } from '@/services/redis-client.service';
- import { Worker } from '../worker';

### Recreate

Place this file at `src2/commands/__tests__/worker.test.ts` and use the following source:

```ts
import { mockInstance } from '@n8n/backend-test-utils';
import { Container } from '@n8n/di';

import { PubSubRegistry } from '@/scaling/pubsub/pubsub.registry';
import { Subscriber } from '@/scaling/pubsub/subscriber.service';
import { WorkerStatusService } from '@/scaling/worker-status.service.ee';
import { RedisClientService } from '@/services/redis-client.service';

import { Worker } from '../worker';

mockInstance(RedisClientService);
mockInstance(PubSubRegistry);
mockInstance(Subscriber);
mockInstance(WorkerStatusService);

test('should instantiate WorkerStatusService during orchestration setup', async () => {
	const containerGetSpy = jest.spyOn(Container, 'get');

	await new Worker().initOrchestration();

	expect(containerGetSpy).toHaveBeenCalledWith(WorkerStatusService);
});

```
