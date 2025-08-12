## src2/task-runners/sliding-window-signal.ts

Overview: src2/task-runners/sliding-window-signal.ts is a core component (that) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { TypedEmitter } from '../typed-emitter';

### Declarations

- Classes: that, SlidingWindowSignal
- Exports: SlidingWindowSignalOpts, SlidingWindowSignal

### Recreate

Place this file at `src2/task-runners/sliding-window-signal.ts` and use the following source:

```ts
import type { TypedEmitter } from '../typed-emitter';

export type SlidingWindowSignalOpts = {
	windowSizeInMs?: number;
};

/**
 * A class that listens for a specific event on an emitter (signal) and
 * provides a sliding window of the last event that was emitted.
 */
export class SlidingWindowSignal<TEvents, TEventName extends keyof TEvents & string> {
	private lastSignal: TEvents[TEventName] | null = null;

	private lastSignalTime: number = 0;

	private windowSizeInMs: number;

	constructor(
		private readonly eventEmitter: TypedEmitter<TEvents>,
		private readonly eventName: TEventName,
		opts: SlidingWindowSignalOpts = {},
	) {
		const { windowSizeInMs = 500 } = opts;

		this.windowSizeInMs = windowSizeInMs;

		eventEmitter.on(eventName, (signal: TEvents[TEventName]) => {
			this.lastSignal = signal;
			this.lastSignalTime = Date.now();
		});
	}

	/**
	 * If an event has been emitted within the last `windowSize` milliseconds,
	 * that event is returned. Otherwise it will wait for up to `windowSize`
	 * milliseconds for the event to be emitted. `null` is returned
	 * if no event is emitted within the window.
	 */
	async getSignal(): Promise<TEvents[TEventName] | null> {
		const timeSinceLastEvent = Date.now() - this.lastSignalTime;
		if (timeSinceLastEvent <= this.windowSizeInMs) return this.lastSignal;

		return await new Promise<TEvents[TEventName] | null>((resolve) => {
			let timeoutTimerId: NodeJS.Timeout | null = null;

			const onExit = (signal: TEvents[TEventName]) => {
				if (timeoutTimerId) clearTimeout(timeoutTimerId);
				resolve(signal);
			};

			timeoutTimerId = setTimeout(() => {
				this.eventEmitter.off(this.eventName, onExit);
				resolve(null);
			});

			this.eventEmitter.once(this.eventName, onExit);
		});
	}
}

```
