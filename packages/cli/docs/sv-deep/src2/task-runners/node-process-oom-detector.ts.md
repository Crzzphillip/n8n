## src2/task-runners/node-process-oom-detector.ts

Overview: src2/task-runners/node-process-oom-detector.ts is a core component (NodeProcessOomDetector) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import * as a from 'node:assert/strict';
- import type { ChildProcess } from 'node:child_process';

### Declarations

- Classes: NodeProcessOomDetector
- Exports: NodeProcessOomDetector

### Recreate

Place this file at `src2/task-runners/node-process-oom-detector.ts` and use the following source:

```ts
import * as a from 'node:assert/strict';
import type { ChildProcess } from 'node:child_process';

/**
 * Class to monitor a nodejs process and detect if it runs out of
 * memory (OOMs).
 */
export class NodeProcessOomDetector {
	get didProcessOom() {
		return this._didProcessOom;
	}

	private _didProcessOom = false;

	constructor(processToMonitor: ChildProcess) {
		this.monitorProcess(processToMonitor);
	}

	private monitorProcess(processToMonitor: ChildProcess) {
		a.ok(processToMonitor.stderr, "Can't monitor a process without stderr");

		processToMonitor.stderr.on('data', this.onStderr);

		processToMonitor.once('exit', () => {
			processToMonitor.stderr?.off('data', this.onStderr);
		});
	}

	private onStderr = (data: Buffer) => {
		if (data.includes('JavaScript heap out of memory')) {
			this._didProcessOom = true;
		}
	};
}

```
