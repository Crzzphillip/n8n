import { create } from 'zustand';
import { useUIStore } from './ui';
import { useExternalHooks } from '../hooks/useExternalHooks';
import { useTelemetry } from '../hooks/useTelemetry';
import {
	createCanvasConnectionHandleString,
	parseCanvasConnectionHandleString,
} from '../utils/canvasUtils';

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
	openNodeCreatorForConnectingNode: (options: {
		connection: { source: string; sourceHandle: string };
		eventSource: string;
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
		try {
			void useExternalHooks().run('nodeView.createNodeActiveChanged', {
				source,
				mode: nodeCreatorView || 'trigger',
				createNodeActive,
			});
			useTelemetry().track('User opened node creator', {
				source,
				mode: nodeCreatorView || 'trigger',
			});
		} catch {}
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
		try {
			useTelemetry().track('User opened node creator', { source, mode: 'trigger' });
		} catch {}
	},

	openNodeCreatorForActions: (node: string, eventSource?: string) => {
		set({
			isCreateNodeActive: true,
			selectedView: 'regular',
			openSource: eventSource || '',
		});
		try {
			useTelemetry().track('User opened node creator', {
				source: eventSource || '',
				mode: 'regular',
			});
		} catch {}
	},

	openSelectiveNodeCreator: ({ connectionType, node, creatorView, connectionIndex = 0 }) => {
		// In a fuller implementation, node and connectionType would be used to set filters
		set({
			isCreateNodeActive: true,
			selectedView: creatorView || 'regular',
			openSource: 'selective',
			showScrim: true,
		});
	},

	openNodeCreatorForConnectingNode: ({ connection, eventSource }) => {
		// Persist interaction metadata for downstream placement/connection
		try {
			const ui = useUIStore.getState();
			ui.setLastInteractedWithNodeId(connection.source);
			ui.setLastInteractedWithNodeHandle(connection.sourceHandle ?? null);
		} catch {}
		set({
			isCreateNodeActive: true,
			selectedView: 'regular',
			openSource: eventSource,
			showScrim: true,
		});
		try {
			useTelemetry().track('User opened node creator', { source: eventSource, mode: 'regular' });
		} catch {}
	},
}));
