import { create } from 'zustand';

export type FocusPanelState = {
  isOpen: boolean;
  selectedNodeIds: string[];
  filterType: 'all' | 'selected' | 'connected' | 'related';
  searchTerm: string;
  showConnections: boolean;
  showParameters: boolean;
  zoomLevel: number;
  position: { x: number; y: number };
};

type State = FocusPanelState & {
  openFocusPanel: () => void;
  closeFocusPanel: () => void;
  toggleFocusPanel: () => void;
  setSelectedNodeIds: (nodeIds: string[]) => void;
  addSelectedNode: (nodeId: string) => void;
  removeSelectedNode: (nodeId: string) => void;
  setFilterType: (type: FocusPanelState['filterType']) => void;
  setSearchTerm: (term: string) => void;
  setShowConnections: (show: boolean) => void;
  setShowParameters: (show: boolean) => void;
  setZoomLevel: (level: number) => void;
  setPosition: (position: { x: number; y: number }) => void;
  reset: () => void;
};

const initialState: FocusPanelState = {
  isOpen: false,
  selectedNodeIds: [],
  filterType: 'all',
  searchTerm: '',
  showConnections: true,
  showParameters: true,
  zoomLevel: 1,
  position: { x: 0, y: 0 },
};

export const useFocusPanelStore = create<State>((set, get) => ({
  ...initialState,

  openFocusPanel() {
    set({ isOpen: true });
  },

  closeFocusPanel() {
    set({ isOpen: false });
  },

  toggleFocusPanel() {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  setSelectedNodeIds(nodeIds) {
    set({ selectedNodeIds: nodeIds });
  },

  addSelectedNode(nodeId) {
    set((state) => ({
      selectedNodeIds: state.selectedNodeIds.includes(nodeId)
        ? state.selectedNodeIds
        : [...state.selectedNodeIds, nodeId],
    }));
  },

  removeSelectedNode(nodeId) {
    set((state) => ({
      selectedNodeIds: state.selectedNodeIds.filter((id) => id !== nodeId),
    }));
  },

  setFilterType(type) {
    set({ filterType: type });
  },

  setSearchTerm(term) {
    set({ searchTerm: term });
  },

  setShowConnections(show) {
    set({ showConnections: show });
  },

  setShowParameters(show) {
    set({ showParameters: show });
  },

  setZoomLevel(level) {
    set({ zoomLevel: Math.max(0.1, Math.min(3, level)) });
  },

  setPosition(position) {
    set({ position });
  },

  reset() {
    set(initialState);
  },
}));