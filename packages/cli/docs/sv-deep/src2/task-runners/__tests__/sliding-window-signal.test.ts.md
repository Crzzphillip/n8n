## src2/task-runners/__tests__/sliding-window-signal.test.ts

Overview: src2/task-runners/__tests__/sliding-window-signal.test.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { TypedEmitter } from '../../typed-emitter';
- import { SlidingWindowSignal } from '../sliding-window-signal';

### Recreate

Place this file at `src2/task-runners/__tests__/sliding-window-signal.test.ts` and use the following source:

```ts
import { TypedEmitter } from '../../typed-emitter';
import { SlidingWindowSignal } from '../sliding-window-signal';

type TestEventMap = {
	testEvent: string;
};

describe('SlidingWindowSignal', () => {
	let eventEmitter: TypedEmitter<TestEventMap>;
	let slidingWindowSignal: SlidingWindowSignal<TestEventMap, 'testEvent'>;

	beforeEach(() => {
		eventEmitter = new TypedEmitter<TestEventMap>();
		slidingWindowSignal = new SlidingWindowSignal(eventEmitter, 'testEvent', {
			windowSizeInMs: 500,
		});
	});

	afterEach(() => {
		jest.clearAllTimers();
		jest.clearAllMocks();
	});

	it('should return the last signal if within window size', async () => {
		const signal = 'testSignal';
		eventEmitter.emit('testEvent', signal);

		const receivedSignal = await slidingWindowSignal.getSignal();

		expect(receivedSignal).toBe(signal);
	});

	it('should return null if there is no signal within the window', async () => {
		jest.useFakeTimers();
		const receivedSignalPromise = slidingWindowSignal.getSignal();
		jest.advanceTimersByTime(600);
		const receivedSignal = await receivedSignalPromise;

		expect(receivedSignal).toBeNull();
		jest.useRealTimers();
	});

	it('should return null if "exit" event is not emitted before timeout', async () => {
		const signal = 'testSignal';
		jest.useFakeTimers();
		const receivedSignalPromise = slidingWindowSignal.getSignal();
		jest.advanceTimersByTime(600);
		eventEmitter.emit('testEvent', signal);

		const receivedSignal = await receivedSignalPromise;
		expect(receivedSignal).toBeNull();
		jest.useRealTimers();
	});

	it('should return the signal emitted on "exit" event before timeout', async () => {
		jest.useFakeTimers();
		const receivedSignalPromise = slidingWindowSignal.getSignal();

		// Emit 'exit' with a signal before timeout
		const exitSignal = 'exitSignal';
		eventEmitter.emit('testEvent', exitSignal);

		// Advance timers enough to go outside the timeout window
		jest.advanceTimersByTime(600);

		const receivedSignal = await receivedSignalPromise;
		expect(receivedSignal).toBe(exitSignal);

		jest.useRealTimers();
	});
});

```
