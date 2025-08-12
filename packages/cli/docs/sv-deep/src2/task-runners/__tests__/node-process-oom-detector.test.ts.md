## src2/task-runners/__tests__/node-process-oom-detector.test.ts

Overview: src2/task-runners/__tests__/node-process-oom-detector.test.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { spawn } from 'node:child_process';
- import { NodeProcessOomDetector } from '../node-process-oom-detector';

### Recreate

Place this file at `src2/task-runners/__tests__/node-process-oom-detector.test.ts` and use the following source:

```ts
import { spawn } from 'node:child_process';

import { NodeProcessOomDetector } from '../node-process-oom-detector';

describe('NodeProcessOomDetector', () => {
	test('should detect an out-of-memory error in a monitored process', (done) => {
		const childProcess = spawn(process.execPath, [
			// set low memory limit
			'--max-old-space-size=20',
			'-e',
			`
      const data = [];
			// fill memory until it crashes
      while (true) data.push(Array.from({ length: 10_000 }).map(() => Math.random().toString()).join());
      `,
		]);

		const detector = new NodeProcessOomDetector(childProcess);

		childProcess.on('exit', (code) => {
			expect(detector.didProcessOom).toBe(true);
			expect(code).not.toBe(0);
			done();
		});
	});

	test('should not detect an out-of-memory error in a process that exits normally', (done) => {
		const childProcess = spawn(process.execPath, [
			'-e',
			`
      console.log("Hello, World!");
      `,
		]);

		const detector = new NodeProcessOomDetector(childProcess);

		childProcess.on('exit', (code) => {
			expect(detector.didProcessOom).toBe(false);
			expect(code).toBe(0);
			done();
		});
	});
});

```
