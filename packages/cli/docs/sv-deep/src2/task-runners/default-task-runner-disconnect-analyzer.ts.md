## src2/task-runners/default-task-runner-disconnect-analyzer.ts

Overview: src2/task-runners/default-task-runner-disconnect-analyzer.ts is a core component (DefaultTaskRunnerDisconnectAnalyzer) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { GlobalConfig } from '@n8n/config';
- import { Container, Service } from '@n8n/di';
- import type {
- import { TaskRunnerDisconnectedError } from './errors/task-runner-disconnected-error';
- import { TaskRunnerFailedHeartbeatError } from './errors/task-runner-failed-heartbeat.error';

### Declarations

- Classes: DefaultTaskRunnerDisconnectAnalyzer
- Exports: DefaultTaskRunnerDisconnectAnalyzer

### Recreate

Place this file at `src2/task-runners/default-task-runner-disconnect-analyzer.ts` and use the following source:

```ts
import { GlobalConfig } from '@n8n/config';
import { Container, Service } from '@n8n/di';

import type {
	DisconnectAnalyzer,
	DisconnectErrorOptions,
} from '@/task-runners/task-broker/task-broker-types';

import { TaskRunnerDisconnectedError } from './errors/task-runner-disconnected-error';
import { TaskRunnerFailedHeartbeatError } from './errors/task-runner-failed-heartbeat.error';

/**
 * Analyzes the disconnect reason of a task runner to provide a more
 * meaningful error message to the user.
 */
@Service()
export class DefaultTaskRunnerDisconnectAnalyzer implements DisconnectAnalyzer {
	get isCloudDeployment() {
		return Container.get(GlobalConfig).deployment.type === 'cloud';
	}

	async toDisconnectError(opts: DisconnectErrorOptions): Promise<Error> {
		const { reason, heartbeatInterval } = opts;

		if (reason === 'failed-heartbeat-check' && heartbeatInterval) {
			return new TaskRunnerFailedHeartbeatError(
				heartbeatInterval,
				Container.get(GlobalConfig).deployment.type !== 'cloud',
			);
		}

		return new TaskRunnerDisconnectedError(
			opts.runnerId ?? 'Unknown runner ID',
			this.isCloudDeployment,
		);
	}
}

```
