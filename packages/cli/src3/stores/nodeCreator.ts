import { create } from 'zustand';

export type NodeCreatorOpenSource = 
  | 'tab'
  | 'plus_endpoint'
  | 'node_connection_drop'
  | 'node_connection_action'
  | 'trigger_placeholder_button'
  | 'add_evaluation_trigger_button'
  | 'add_evaluation_node_button';

export type NodeFilterType = 'all' | 'actions' | 'triggers' | 'regular';

export type ToggleNodeCreatorOptions = {
  createNodeActive: boolean;
  source?: NodeCreatorOpenSource;
  hasAddedNodes?: boolean;
};

export type NodeCreatorState = {
  isCreateNodeActive: boolean;
  isSelectiveNodeCreatorActive: boolean;
  source: NodeCreatorOpenSource | null;
  selectedNodeType: string | null;
  selectedCategory: string | null;
  searchTerm: string;
  filterType: NodeFilterType;
  connectingNode: {
    nodeId: string;
    connectionType: string;
    connectionIndex: number;
  } | null;
};

type State = NodeCreatorState & {
  setNodeCreatorState: (options: ToggleNodeCreatorOptions) => void;
  openNodeCreatorForTriggerNodes: (source: NodeCreatorOpenSource) => void;
  openNodeCreatorForActions: (nodeType: string, source: NodeCreatorOpenSource) => void;
  openSelectiveNodeCreator: (options: {
    node: string;
    connectionType: string;
    connectionIndex?: number;
    creatorView?: NodeFilterType;
  }) => void;
  openNodeCreatorForConnectingNode: (options: {
    connection: {
      source: string;
      sourceHandle: string;
    };
    eventSource: NodeCreatorOpenSource;
  }) => void;
  setSelectedNodeType: (nodeType: string | null) => void;
  setSelectedCategory: (category: string | null) => void;
  setSearchTerm: (term: string) => void;
  setFilterType: (type: NodeFilterType) => void;
  closeNodeCreator: () => void;
  reset: () => void;
};

const initialState: NodeCreatorState = {
  isCreateNodeActive: false,
  isSelectiveNodeCreatorActive: false,
  source: null,
  selectedNodeType: null,
  selectedCategory: null,
  searchTerm: '',
  filterType: 'all',
  connectingNode: null,
};

export const useNodeCreatorStore = create<State>((set, get) => ({
  ...initialState,

  setNodeCreatorState(options) {
    set({
      isCreateNodeActive: options.createNodeActive,
      source: options.source || null,
      hasAddedNodes: options.hasAddedNodes || false,
    });
  },

  openNodeCreatorForTriggerNodes(source) {
    set({
      isCreateNodeActive: true,
      isSelectiveNodeCreatorActive: false,
      source,
      filterType: 'triggers',
      selectedNodeType: null,
      selectedCategory: null,
      searchTerm: '',
      connectingNode: null,
    });
  },

  openNodeCreatorForActions(nodeType, source) {
    set({
      isCreateNodeActive: true,
      isSelectiveNodeCreatorActive: false,
      source,
      filterType: 'actions',
      selectedNodeType: nodeType,
      selectedCategory: null,
      searchTerm: '',
      connectingNode: null,
    });
  },

  openSelectiveNodeCreator(options) {
    set({
      isCreateNodeActive: false,
      isSelectiveNodeCreatorActive: true,
      source: 'node_connection_action',
      filterType: options.creatorView || 'all',
      selectedNodeType: null,
      selectedCategory: null,
      searchTerm: '',
      connectingNode: {
        nodeId: options.node,
        connectionType: options.connectionType,
        connectionIndex: options.connectionIndex || 0,
      },
    });
  },

  openNodeCreatorForConnectingNode(options) {
    set({
      isCreateNodeActive: true,
      isSelectiveNodeCreatorActive: false,
      source: options.eventSource,
      filterType: 'all',
      selectedNodeType: null,
      selectedCategory: null,
      searchTerm: '',
      connectingNode: {
        nodeId: options.connection.source,
        connectionType: 'output',
        connectionIndex: 0,
      },
    });
  },

  setSelectedNodeType(nodeType) {
    set({ selectedNodeType: nodeType });
  },

  setSelectedCategory(category) {
    set({ selectedCategory: category });
  },

  setSearchTerm(term) {
    set({ searchTerm: term });
  },

  setFilterType(type) {
    set({ filterType: type });
  },

  closeNodeCreator() {
    set({
      isCreateNodeActive: false,
      isSelectiveNodeCreatorActive: false,
      source: null,
      selectedNodeType: null,
      selectedCategory: null,
      searchTerm: '',
      filterType: 'all',
      connectingNode: null,
    });
  },

  reset() {
    set(initialState);
  },
}));