import { create } from 'zustand';

type NodeStatus = 'idle' | 'running' | 'success' | 'error' | 'waiting';

interface CanvasState {
  nodeStatus: Record<string, NodeStatus>;
  isLoading: boolean;
  loadingText: string;
  hasRangeSelection: boolean;
}

interface CanvasStore extends CanvasState {
  setNodeStatus: (nodeId: string, status: NodeStatus) => void;
  bulkSet: (statuses: Record<string, NodeStatus>) => void;
  startLoading: () => void;
  stopLoading: () => void;
  setLoadingText: (text: string) => void;
  setHasRangeSelection: (hasRangeSelection: boolean) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  nodeStatus: {},
  isLoading: false,
  loadingText: '',
  hasRangeSelection: false,

  setNodeStatus(nodeId, status) {
    set((s) => ({ nodeStatus: { ...s.nodeStatus, [nodeId]: status } }));
  },

  bulkSet(statuses) {
    set({ nodeStatus: statuses });
  },

  startLoading: () => {
    set({ isLoading: true });
  },

  stopLoading: () => {
    set({ isLoading: false, loadingText: '' });
  },

  setLoadingText: (text: string) => {
    set({ loadingText: text });
  },

  setHasRangeSelection: (hasRangeSelection: boolean) => {
    set({ hasRangeSelection });
  },
}));