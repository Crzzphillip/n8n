import { create } from 'zustand';

export type PushConnectionState = {
  isConnected: boolean;
  isConnecting: boolean;
  connectionId: string | null;
  lastHeartbeat: number | null;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  reconnectDelay: number;
  subscriptions: Set<string>;
  pendingMessages: any[];
  error: string | null;
};

type State = PushConnectionState & {
  connect: () => Promise<void>;
  disconnect: () => void;
  reconnect: () => Promise<void>;
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
  sendMessage: (message: any) => void;
  setConnectionId: (id: string | null) => void;
  setHeartbeat: (timestamp: number) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
};

const initialState: PushConnectionState = {
  isConnected: false,
  isConnecting: false,
  connectionId: null,
  lastHeartbeat: null,
  reconnectAttempts: 0,
  maxReconnectAttempts: 5,
  reconnectDelay: 1000,
  subscriptions: new Set(),
  pendingMessages: [],
  error: null,
};

export const usePushConnectionStore = create<State>((set, get) => ({
  ...initialState,

  async connect() {
    const { isConnected, isConnecting } = get();
    if (isConnected || isConnecting) return;

    set({ isConnecting: true, error: null });

    try {
      // Simulate WebSocket connection
      // In a real implementation, this would create a WebSocket connection
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      const connectionId = Math.random().toString(36).slice(2);
      
      set({
        isConnected: true,
        isConnecting: false,
        connectionId,
        lastHeartbeat: Date.now(),
        reconnectAttempts: 0,
        error: null,
      });

      // Start heartbeat
      const heartbeatInterval = setInterval(() => {
        const { isConnected } = get();
        if (isConnected) {
          set({ lastHeartbeat: Date.now() });
        } else {
          clearInterval(heartbeatInterval);
        }
      }, 30000); // 30 seconds

    } catch (error) {
      set({
        isConnected: false,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      });
    }
  },

  disconnect() {
    set({
      isConnected: false,
      isConnecting: false,
      connectionId: null,
      lastHeartbeat: null,
      subscriptions: new Set(),
      pendingMessages: [],
    });
  },

  async reconnect() {
    const { reconnectAttempts, maxReconnectAttempts, reconnectDelay } = get();
    
    if (reconnectAttempts >= maxReconnectAttempts) {
      set({ error: 'Max reconnection attempts reached' });
      return;
    }

    set({ reconnectAttempts: reconnectAttempts + 1 });

    // Exponential backoff
    const delay = reconnectDelay * Math.pow(2, reconnectAttempts);
    await new Promise((resolve) => setTimeout(resolve, delay));

    await get().connect();
  },

  subscribe(channel) {
    set((state) => ({
      subscriptions: new Set([...state.subscriptions, channel]),
    }));
  },

  unsubscribe(channel) {
    set((state) => {
      const newSubscriptions = new Set(state.subscriptions);
      newSubscriptions.delete(channel);
      return { subscriptions: newSubscriptions };
    });
  },

  sendMessage(message) {
    const { isConnected, pendingMessages } = get();
    
    if (isConnected) {
      // Send message immediately
      console.log('Sending message:', message);
    } else {
      // Queue message for later
      set({ pendingMessages: [...pendingMessages, message] });
    }
  },

  setConnectionId(id) {
    set({ connectionId: id });
  },

  setHeartbeat(timestamp) {
    set({ lastHeartbeat: timestamp });
  },

  setError(error) {
    set({ error });
  },

  clearError() {
    set({ error: null });
  },

  reset() {
    set(initialState);
  },
}));