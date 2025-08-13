import { create } from 'zustand';

type NodeStatus = 'idle' | 'running' | 'success' | 'error' | 'waiting';

type State = {
  nodeStatus: Record<string, NodeStatus>;
  setNodeStatus: (nodeId: string, status: NodeStatus) => void;
  bulkSet: (statuses: Record<string, NodeStatus>) => void;
};

export const useCanvasStore = create<State>((set) => ({
  nodeStatus: {},
  setNodeStatus(nodeId, status) {
    set((s) => ({ nodeStatus: { ...s.nodeStatus, [nodeId]: status } }));
  },
  bulkSet(statuses) {
    set({ nodeStatus: statuses });
  },
}));