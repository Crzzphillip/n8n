import { create } from 'zustand';
import { useCanvasStore } from './canvas';
import { useLogsStore } from './logs';

type Listener = (event: MessageEvent) => void;

type State = {
	connected: boolean;
	lastEventId?: string;
	subscribe: (fn: Listener) => () => void;
	subscribeExecutions: () => () => void;
	pushConnect: () => void;
	pushDisconnect: () => void;
};

export const usePushStore = create<State>((set, get) => {
	let source: EventSource | undefined;
	let listeners: Set<Listener> = new Set();

	const connect = () => {
		if (source) return;
		try {
			source = new EventSource('/api/rest/events');
			source.onopen = () => set({ connected: true });
			source.onmessage = (e) => {
				set({ lastEventId: e.lastEventId || e.type });
				listeners.forEach((fn) => fn(e));
			};
			source.onerror = () => {
				set({ connected: false });
			};
		} catch {
			set({ connected: false });
		}
	};

	const disconnect = () => {
		try {
			if (source) {
				source.close();
				source = undefined;
			}
		} finally {
			set({ connected: false });
		}
	};

	const subscribe = (fn: Listener) => {
		listeners.add(fn);
		connect();
		return () => listeners.delete(fn);
	};

	const subscribeExecutions = () => {
		const off = subscribe((e) => {
			try {
				const payload = JSON.parse(e.data);
				if (payload?.type === 'execution:node-status') {
					useCanvasStore.getState().setNodeStatus(payload.nodeId, payload.status);
				} else if (payload?.type === 'execution:log') {
					useLogsStore
						.getState()
						.add(payload.nodeId, {
							ts: Date.now(),
							level: payload.level || 'info',
							message: payload.message,
						});
					useLogsStore.getState().trim(payload.nodeId, 50);
				}
			} catch {}
		});
		return off;
	};

	return {
		connected: false,
		subscribe,
		subscribeExecutions,
		pushConnect: connect,
		pushDisconnect: disconnect,
	} as State;
});
