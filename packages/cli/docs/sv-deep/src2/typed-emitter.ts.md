## src2/typed-emitter.ts

Overview: src2/typed-emitter.ts is a core component (TypedEmitter) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import debounce from 'lodash/debounce';
- import { EventEmitter } from 'node:events';

### Declarations

- Classes: TypedEmitter
- Exports: TypedEmitter

### Recreate

Place this file at `src2/typed-emitter.ts` and use the following source:

```ts
import debounce from 'lodash/debounce';
import { EventEmitter } from 'node:events';

type Payloads<ListenerMap> = {
	[E in keyof ListenerMap]: unknown;
};

type Listener<Payload> = (payload: Payload) => void;

export class TypedEmitter<ListenerMap extends Payloads<ListenerMap>> extends EventEmitter {
	private debounceWait = 300; // milliseconds

	override on<EventName extends keyof ListenerMap & string>(
		eventName: EventName,
		listener: Listener<ListenerMap[EventName]>,
	) {
		return super.on(eventName, listener);
	}

	override once<EventName extends keyof ListenerMap & string>(
		eventName: EventName,
		listener: Listener<ListenerMap[EventName]>,
	) {
		return super.once(eventName, listener);
	}

	override off<EventName extends keyof ListenerMap & string>(
		eventName: EventName,
		listener: Listener<ListenerMap[EventName]>,
	) {
		return super.off(eventName, listener);
	}

	override emit<EventName extends keyof ListenerMap & string>(
		eventName: EventName,
		payload?: ListenerMap[EventName],
	): boolean {
		return super.emit(eventName, payload);
	}

	protected debouncedEmit = debounce(
		<EventName extends keyof ListenerMap & string>(
			eventName: EventName,
			payload?: ListenerMap[EventName],
		) => super.emit(eventName, payload),
		this.debounceWait,
	);
}

```
