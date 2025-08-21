import { create } from 'zustand';

type LogEntry = { ts: number; level: 'info' | 'warn' | 'error'; message: string };

interface LogsState {
  byNode: Record<string, LogEntry[]>;
  isOpen: boolean;
  height: number;
  detailsState: 'input' | 'output' | 'both';
  isLogSelectionSyncedWithCanvas: boolean;
}

interface LogsStore extends LogsState {
  add: (nodeId: string, entry: LogEntry) => void;
  trim: (nodeId: string, max?: number) => void;
  toggleOpen: (value?: boolean) => void;
  setHeight: (value: number) => void;
  toggleInputOpen: (open?: boolean) => void;
  toggleOutputOpen: (open?: boolean) => void;
  toggleLogSelectionSync: (value?: boolean) => void;
}

export const useLogsStore = create<LogsStore>((set, get) => ({
  byNode: {},
  isOpen: false,
  height: 0,
  detailsState: 'output',
  isLogSelectionSyncedWithCanvas: true,

  add(nodeId, entry) {
    set((s) => {
      const arr = [...(s.byNode[nodeId] || []), entry];
      return { byNode: { ...s.byNode, [nodeId]: arr } };
    });
  },

  trim(nodeId, max = 50) {
    set((s) => {
      const arr = (s.byNode[nodeId] || []).slice(-max);
      return { byNode: { ...s.byNode, [nodeId]: arr } };
    });
  },

  toggleOpen: (value?: boolean) => {
    set((s) => ({ isOpen: value ?? !s.isOpen }));
  },

  setHeight: (value: number) => {
    set({ height: value });
  },

  toggleInputOpen: (open?: boolean) => {
    const { detailsState } = get();
    const statesWithInput = ['input', 'both'];
    const wasOpen = statesWithInput.includes(detailsState);

    if (open === wasOpen) {
      return;
    }

    set({
      detailsState: wasOpen ? 'output' : 'both',
    });
  },

  toggleOutputOpen: (open?: boolean) => {
    const { detailsState } = get();
    const statesWithOutput = ['output', 'both'];
    const wasOpen = statesWithOutput.includes(detailsState);

    if (open === wasOpen) {
      return;
    }

    set({
      detailsState: wasOpen ? 'input' : 'both',
    });
  },

  toggleLogSelectionSync: (value?: boolean) => {
    set((s) => ({ isLogSelectionSyncedWithCanvas: value ?? !s.isLogSelectionSyncedWithCanvas }));
  },
}));