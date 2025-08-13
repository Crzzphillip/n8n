## src2/task-runners/__tests__/task-runner-process-restart-loop-detector.test.ts

Overview: src2/task-runners/__tests__/task-runner-process-restart-loop-detector.test.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { Logger } from '@n8n/backend-common';
- import { TaskRunnersConfig } from '@n8n/config';
- import { mock } from 'jest-mock-extended';
- import { TaskRunnerRestartLoopError } from '@/task-runners/errors/task-runner-restart-loop-error';
- import type { TaskBrokerAuthService } from '@/task-runners/task-broker/auth/task-broker-auth.service';
- import { TaskRunnerLifecycleEvents } from '@/task-runners/task-runner-lifecycle-events';
- import { TaskRunnerProcess } from '@/task-runners/task-runner-process';
- import { TaskRunnerProcessRestartLoopDetector } from '@/task-runners/task-runner-process-restart-loop-detector';

### Recreate

Place this file at `src2/task-runners/__tests__/task-runner-process-restart-loop-detector.test.ts` and use the following source:

```ts
import type { Logger } from '@n8n/backend-common';
import { TaskRunnersConfig } from '@n8n/config';
import { mock } from 'jest-mock-extended';

import { TaskRunnerRestartLoopError } from '@/task-runners/errors/task-runner-restart-loop-error';
import type { TaskBrokerAuthService } from '@/task-runners/task-broker/auth/task-broker-auth.service';
import { TaskRunnerLifecycleEvents } from '@/task-runners/task-runner-lifecycle-events';
import { TaskRunnerProcess } from '@/task-runners/task-runner-process';
import { TaskRunnerProcessRestartLoopDetector } from '@/task-runners/task-runner-process-restart-loop-detector';

describe('TaskRunnerProcessRestartLoopDetector', () => {
	const mockLogger = mock<Logger>();
	const mockAuthService = mock<TaskBrokerAuthService>();
	const runnerConfig = new TaskRunnersConfig();
	const taskRunnerProcess = new TaskRunnerProcess(
		mockLogger,
		runnerConfig,
		mockAuthService,
		new TaskRunnerLifecycleEvents(),
	);

	it('should detect a restart loop if process exits 5 times within 5s', () => {
		const restartLoopDetector = new TaskRunnerProcessRestartLoopDetector(taskRunnerProcess);
		let emittedError: TaskRunnerRestartLoopError | undefined = undefined;
		restartLoopDetector.on('restart-loop-detected', (error) => {
			emittedError = error;
		});

		taskRunnerProcess.emit('exit');
		taskRunnerProcess.emit('exit');
		taskRunnerProcess.emit('exit');
		taskRunnerProcess.emit('exit');
		taskRunnerProcess.emit('exit');

		expect(emittedError).toBeInstanceOf(TaskRunnerRestartLoopError);
	});

	it('should not detect a restart loop if process exits less than 5 times within 5s', () => {
		jest.useFakeTimers();
		const restartLoopDetector = new TaskRunnerProcessRestartLoopDetector(taskRunnerProcess);
		let emittedError: TaskRunnerRestartLoopError | undefined = undefined;
		restartLoopDetector.on('restart-loop-detected', (error) => {
			emittedError = error;
		});

		taskRunnerProcess.emit('exit');
		taskRunnerProcess.emit('exit');
		taskRunnerProcess.emit('exit');
		taskRunnerProcess.emit('exit');

		jest.advanceTimersByTime(5010);

		taskRunnerProcess.emit('exit');

		expect(emittedError).toBeUndefined();
	});
});

```
