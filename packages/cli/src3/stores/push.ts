import { create } from 'zustand';
import { useCanvasStore } from './canvas';

type Listener = (event: MessageEvent) => void;

type State = {
  connected: boolean;
  lastEventId?: string;
  subscribe: (fn: Listener) => () => void;
  subscribeExecutions: () => () => void;
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
          // expected shape: { workflowId, nodeId, status }
          useCanvasStore.getState().setNodeStatus(payload.nodeId, payload.status);
        }
      } catch {}
    });
    return off;
  };

  return {
    connected: false,
    subscribe,
    subscribeExecutions,
  } as State;
});