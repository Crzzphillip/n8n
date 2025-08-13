import { create } from 'zustand';

interface NodeCreatorState {
	isCreateNodeActive: boolean;
	openSource: string;
	selectedView: string;
	showScrim: boolean;
}

interface NodeCreatorStore extends NodeCreatorState {
	setNodeCreatorState: (options: {
		createNodeActive: boolean;
		source?: string;
		nodeCreatorView?: string;
	}) => void;
	setShowScrim: (isVisible: boolean) => void;
	setSelectedView: (view: string) => void;
	setOpenSource: (source: string) => void;
	openNodeCreatorForTriggerNodes: (source: string) => void;
	openNodeCreatorForActions: (node: string, eventSource?: string) => void;
	openSelectiveNodeCreator: (options: {
		connectionType: string;
		node: string;
		creatorView?: string;
		connectionIndex?: number;
	}) => void;
}

export const useNodeCreatorStore = create<NodeCreatorStore>((set, get) => ({
	isCreateNodeActive: false,
	openSource: '',
	selectedView: 'trigger',
	showScrim: false,

	setNodeCreatorState: ({ createNodeActive, source, nodeCreatorView }) => {
		set({
			isCreateNodeActive: createNodeActive,
			openSource: source || '',
			selectedView: nodeCreatorView || 'trigger',
		});
	},

	setShowScrim: (isVisible: boolean) => {
		set({ showScrim: isVisible });
	},

	setSelectedView: (view: string) => {
		set({ selectedView: view });
	},

	setOpenSource: (source: string) => {
		set({ openSource: source });
	},

	openNodeCreatorForTriggerNodes: (source: string) => {
		set({
			isCreateNodeActive: true,
			selectedView: 'trigger',
			openSource: source,
			showScrim: true,
		});
	},

	openNodeCreatorForActions: (node: string, eventSource?: string) => {
		set({
			isCreateNodeActive: true,
			selectedView: 'regular',
			openSource: eventSource || '',
		});
	},

	openSelectiveNodeCreator: ({ connectionType, node, creatorView, connectionIndex = 0 }) => {
		set({
			isCreateNodeActive: true,
			selectedView: creatorView || 'regular',
			openSource: 'selective',
		});
	},
}));