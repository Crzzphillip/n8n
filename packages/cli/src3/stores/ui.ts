import { create } from 'zustand';

interface UIState {
	stateIsDirty: boolean;
	nodeViewInitialized: boolean;
	activeModals: string[];
	lastSelectedNode: string | null;
	lastInteractedWithNodeId: string | null;
	lastInteractedWithNodeHandle: string | null;
	lastCancelledConnectionPosition: [number, number] | null;
	nodeViewOffsetPosition: [number, number];
	addFirstStepOnLoad: boolean;
	focusPanelEnabled: boolean;
	lastClickPosition: [number, number] | null;
}

interface UIStore extends UIState {
	setStateIsDirty: (dirty: boolean) => void;
	setNodeViewInitialized: (initialized: boolean) => void;
	openModal: (modalName: string) => void;
	closeModal: (modalName: string) => void;
	setLastSelectedNode: (nodeName: string | null) => void;
	setLastInteractedWithNodeId: (nodeId: string | null) => void;
	setLastInteractedWithNodeHandle: (handle: string | null) => void;
	setLastCancelledConnectionPosition: (position: [number, number] | null) => void;
	setNodeViewOffsetPosition: (position: [number, number]) => void;
	setAddFirstStepOnLoad: (add: boolean) => void;
	resetLastInteractedWith: () => void;
	toggleFocusPanel: () => void;
	setLastClickPosition: (position: [number, number] | null) => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
	stateIsDirty: false,
	nodeViewInitialized: false,
	activeModals: [],
	lastSelectedNode: null,
	lastInteractedWithNodeId: null,
	lastInteractedWithNodeHandle: null,
	lastCancelledConnectionPosition: null,
	nodeViewOffsetPosition: [0, 0],
	addFirstStepOnLoad: false,
	focusPanelEnabled: true,
	lastClickPosition: null,

	setStateIsDirty: (dirty: boolean) => {
		set({ stateIsDirty: dirty });
	},

	setNodeViewInitialized: (initialized: boolean) => {
		set({ nodeViewInitialized: initialized });
	},

	openModal: (modalName: string) => {
		set((state) => ({
			activeModals: [...state.activeModals, modalName],
		}));
	},

	closeModal: (modalName: string) => {
		set((state) => ({
			activeModals: state.activeModals.filter((modal) => modal !== modalName),
		}));
	},

	setLastSelectedNode: (nodeName: string | null) => {
		set({ lastSelectedNode: nodeName });
	},

	setLastInteractedWithNodeId: (nodeId: string | null) => {
		set({ lastInteractedWithNodeId: nodeId });
	},

	setLastInteractedWithNodeHandle: (handle: string | null) => {
		set({ lastInteractedWithNodeHandle: handle });
	},

	setLastCancelledConnectionPosition: (position: [number, number] | null) => {
		set({ lastCancelledConnectionPosition: position });
	},

	setNodeViewOffsetPosition: (position: [number, number]) => {
		set({ nodeViewOffsetPosition: position });
	},

	setAddFirstStepOnLoad: (add: boolean) => {
		set({ addFirstStepOnLoad: add });
	},

	resetLastInteractedWith: () => {
		set({
			lastInteractedWithNodeId: null,
			lastInteractedWithNodeHandle: null,
			lastCancelledConnectionPosition: null,
		});
	},

	toggleFocusPanel: () => {
		set((s) => ({ focusPanelEnabled: !s.focusPanelEnabled }));
	},

	setLastClickPosition: (position: [number, number] | null) => {
		set({ lastClickPosition: position });
	},
}));
