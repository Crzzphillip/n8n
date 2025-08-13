import { create } from 'zustand';

type LogEntry = { ts: number; level: 'info' | 'warn' | 'error'; message: string };

type State = {
  byNode: Record<string, LogEntry[]>;
  add: (nodeId: string, entry: LogEntry) => void;
  trim: (nodeId: string, max?: number) => void;
};

export const useLogsStore = create<State>((set) => ({
  byNode: {},
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
}));