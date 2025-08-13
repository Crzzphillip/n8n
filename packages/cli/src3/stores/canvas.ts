import { create } from 'zustand';

export type NodeStatus = 'idle' | 'running' | 'success' | 'error' | 'waiting';

export type CanvasState = {
  nodeStatus: Record<string, NodeStatus>;
  isLoading: boolean;
  loadingText: string | null;
  hasRangeSelection: boolean;
  selectedNodeIds: Set<string>;
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  dimensions: {
    width: number;
    height: number;
  };
  isReadOnly: boolean;
  isExecuting: boolean;
  executionWaitingForWebhook: boolean;
  error: string | null;
};

type State = CanvasState & {
  setNodeStatus: (nodeId: string, status: NodeStatus) => void;
  bulkSetNodeStatus: (statuses: Record<string, NodeStatus>) => void;
  startLoading: (text?: string) => void;
  stopLoading: () => void;
  setLoadingText: (text: string) => void;
  setHasRangeSelection: (hasSelection: boolean) => void;
  setSelectedNodeIds: (nodeIds: string[]) => void;
  addSelectedNode: (nodeId: string) => void;
  removeSelectedNode: (nodeId: string) => void;
  clearSelectedNodes: () => void;
  setViewport: (viewport: { x: number; y: number; zoom: number }) => void;
  setDimensions: (dimensions: { width: number; height: number }) => void;
  setReadOnly: (readOnly: boolean) => void;
  setExecuting: (executing: boolean) => void;
  setExecutionWaitingForWebhook: (waiting: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

const initialState: CanvasState = {
  nodeStatus: {},
  isLoading: false,
  loadingText: null,
  hasRangeSelection: false,
  selectedNodeIds: new Set(),
  viewport: { x: 0, y: 0, zoom: 1 },
  dimensions: { width: 0, height: 0 },
  isReadOnly: false,
  isExecuting: false,
  executionWaitingForWebhook: false,
  error: null,
};

export const useCanvasStore = create<State>((set, get) => ({
  ...initialState,

  setNodeStatus(nodeId, status) {
    set((state) => ({ 
      nodeStatus: { ...state.nodeStatus, [nodeId]: status } 
    }));
  },

  bulkSetNodeStatus(statuses) {
    set((state) => ({ 
      nodeStatus: { ...state.nodeStatus, ...statuses } 
    }));
  },

  startLoading(text) {
    set({ 
      isLoading: true, 
      loadingText: text || null,
      error: null 
    });
  },

  stopLoading() {
    set({ 
      isLoading: false, 
      loadingText: null 
    });
  },

  setLoadingText(text) {
    set({ loadingText: text });
  },

  setHasRangeSelection(hasSelection) {
    set({ hasRangeSelection: hasSelection });
  },

  setSelectedNodeIds(nodeIds) {
    set({ selectedNodeIds: new Set(nodeIds) });
  },

  addSelectedNode(nodeId) {
    set((state) => {
      const newSelectedNodes = new Set(state.selectedNodeIds);
      newSelectedNodes.add(nodeId);
      return { selectedNodeIds: newSelectedNodes };
    });
  },

  removeSelectedNode(nodeId) {
    set((state) => {
      const newSelectedNodes = new Set(state.selectedNodeIds);
      newSelectedNodes.delete(nodeId);
      return { selectedNodeIds: newSelectedNodes };
    });
  },

  clearSelectedNodes() {
    set({ selectedNodeIds: new Set() });
  },

  setViewport(viewport) {
    set({ viewport });
  },

  setDimensions(dimensions) {
    set({ dimensions });
  },

  setReadOnly(readOnly) {
    set({ isReadOnly: readOnly });
  },

  setExecuting(executing) {
    set({ isExecuting: executing });
  },

  setExecutionWaitingForWebhook(waiting) {
    set({ executionWaitingForWebhook: waiting });
  },

  setError(error) {
    set({ error });
  },

  reset() {
    set(initialState);
  },
}));