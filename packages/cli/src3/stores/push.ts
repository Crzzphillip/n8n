import { create } from 'zustand';

type Listener = (event: MessageEvent) => void;

type State = {
  connected: boolean;
  lastEventId?: string;
  subscribe: (fn: Listener) => () => void;
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

  return {
    connected: false,
    subscribe,
  } as State;
});