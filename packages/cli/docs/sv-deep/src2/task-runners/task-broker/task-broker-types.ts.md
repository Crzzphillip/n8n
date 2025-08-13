## src2/task-runners/task-broker/task-broker-types.ts

Overview: src2/task-runners/task-broker/task-broker-types.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { TaskRunner } from '@n8n/task-runner';
- import type { Response } from 'express';
- import type WebSocket from 'ws';
- import type { AuthlessRequest } from '../../requests';

### Declarations

- Exports: DisconnectAnalyzer, TaskBrokerServerInitRequest, TaskBrokerServerInitResponse, DisconnectReason, DisconnectErrorOptions

### Recreate

Place this file at `src2/task-runners/task-broker/task-broker-types.ts` and use the following source:

```ts
import type { TaskRunner } from '@n8n/task-runner';
import type { Response } from 'express';
import type WebSocket from 'ws';

import type { AuthlessRequest } from '../../requests';

export interface DisconnectAnalyzer {
	isCloudDeployment: boolean;

	toDisconnectError(opts: DisconnectErrorOptions): Promise<Error>;
}

export interface TaskBrokerServerInitRequest
	extends AuthlessRequest<{}, {}, {}, { id: TaskRunner['id']; token?: string }> {
	ws: WebSocket;
}

export type TaskBrokerServerInitResponse = Response & { req: TaskBrokerServerInitRequest };

export type DisconnectReason = 'shutting-down' | 'failed-heartbeat-check' | 'unknown';

export type DisconnectErrorOptions = {
	runnerId?: TaskRunner['id'];
	reason?: DisconnectReason;
	heartbeatInterval?: number;
};

```
