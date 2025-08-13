import { create } from 'zustand';

export type NDVState = {
  activeNodeName: string | null;
  activeNodeId: string | null;
  isOpen: boolean;
  isReadOnly: boolean;
  isProductionExecutionPreview: boolean;
  pushRef: string | null;
  selectedTab: string;
  isRenaming: boolean;
  isExecuting: boolean;
  executionData: any | null;
  nodeParameters: Record<string, any>;
  nodeCredentials: Record<string, any>;
  nodeConnections: {
    inputs: Record<string, any[]>;
    outputs: Record<string, any[]>;
  };
};

type State = NDVState & {
  setActiveNode: (nodeName: string | null, nodeId?: string | null) => void;
  openNDV: (nodeName: string, nodeId?: string) => void;
  closeNDV: () => void;
  setReadOnly: (readOnly: boolean) => void;
  setProductionExecutionPreview: (isPreview: boolean) => void;
  setPushRef: (ref: string | null) => void;
  setSelectedTab: (tab: string) => void;
  setRenaming: (isRenaming: boolean) => void;
  setExecuting: (isExecuting: boolean) => void;
  setExecutionData: (data: any | null) => void;
  setNodeParameters: (parameters: Record<string, any>) => void;
  updateNodeParameter: (key: string, value: any) => void;
  setNodeCredentials: (credentials: Record<string, any>) => void;
  setNodeConnections: (connections: {
    inputs: Record<string, any[]>;
    outputs: Record<string, any[]>;
  }) => void;
  reset: () => void;
};

const initialState: NDVState = {
  activeNodeName: null,
  activeNodeId: null,
  isOpen: false,
  isReadOnly: false,
  isProductionExecutionPreview: false,
  pushRef: null,
  selectedTab: 'parameters',
  isRenaming: false,
  isExecuting: false,
  executionData: null,
  nodeParameters: {},
  nodeCredentials: {},
  nodeConnections: {
    inputs: {},
    outputs: {},
  },
};

export const useNDVStore = create<State>((set, get) => ({
  ...initialState,

  setActiveNode(nodeName, nodeId = null) {
    set({
      activeNodeName: nodeName,
      activeNodeId: nodeId,
      isOpen: !!nodeName,
    });
  },

  openNDV(nodeName, nodeId) {
    set({
      activeNodeName: nodeName,
      activeNodeId: nodeId,
      isOpen: true,
      selectedTab: 'parameters',
    });
  },

  closeNDV() {
    set({
      activeNodeName: null,
      activeNodeId: null,
      isOpen: false,
      selectedTab: 'parameters',
      isRenaming: false,
      isExecuting: false,
      executionData: null,
      nodeParameters: {},
      nodeCredentials: {},
      nodeConnections: {
        inputs: {},
        outputs: {},
      },
    });
  },

  setReadOnly(readOnly) {
    set({ isReadOnly: readOnly });
  },

  setProductionExecutionPreview(isPreview) {
    set({ isProductionExecutionPreview: isPreview });
  },

  setPushRef(ref) {
    set({ pushRef: ref });
  },

  setSelectedTab(tab) {
    set({ selectedTab: tab });
  },

  setRenaming(isRenaming) {
    set({ isRenaming });
  },

  setExecuting(isExecuting) {
    set({ isExecuting });
  },

  setExecutionData(data) {
    set({ executionData: data });
  },

  setNodeParameters(parameters) {
    set({ nodeParameters: parameters });
  },

  updateNodeParameter(key, value) {
    set((state) => ({
      nodeParameters: {
        ...state.nodeParameters,
        [key]: value,
      },
    }));
  },

  setNodeCredentials(credentials) {
    set({ nodeCredentials: credentials });
  },

  setNodeConnections(connections) {
    set({ nodeConnections: connections });
  },

  reset() {
    set(initialState);
  },
}));