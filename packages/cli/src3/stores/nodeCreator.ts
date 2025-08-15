import { create } from 'zustand';
import { useUIStore } from './ui';
import { useExternalHooks } from '../hooks/useExternalHooks';
import { useTelemetry } from '../hooks/useTelemetry';
import {
	createCanvasConnectionHandleString,
	parseCanvasConnectionHandleString,
} from '../utils/canvasUtils';
import { AI_UNCATEGORIZED_CATEGORY } from '../constants';

interface NodeCreatorState {
	isCreateNodeActive: boolean;
	openSource: string;
	selectedView: string;
	showScrim: boolean;
	connectionType?: string;
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

let nodePanelSessionId = '';
function resetNodesPanelSession() {
	nodePanelSessionId = `nodes_panel_session_${Date.now()}`;
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
			if (createNodeActive) resetNodesPanelSession();
			useTelemetry().track('User opened node creator', {
				source,
				mode: nodeCreatorView || 'trigger',
				nodes_panel_session_id: nodePanelSessionId,
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
			resetNodesPanelSession();
			useTelemetry().track('User opened node creator', {
				source,
				mode: 'trigger',
				nodes_panel_session_id: nodePanelSessionId,
			});
		} catch {}
	},

	openNodeCreatorForActions: (node: string, eventSource?: string) => {
		set({
			isCreateNodeActive: true,
			selectedView: 'regular',
			openSource: eventSource || '',
		});
		try {
			resetNodesPanelSession();
			useTelemetry().track('User opened node creator', {
				source: eventSource || '',
				mode: 'regular',
				nodes_panel_session_id: nodePanelSessionId,
			});
		} catch {}
	},

	openSelectiveNodeCreator: ({ connectionType, node, creatorView, connectionIndex = 0 }) => {
		// In a fuller implementation, node and connectionType would be used to set filters
		const isScoped = connectionType && connectionType !== 'main';
		set({
			isCreateNodeActive: true,
			selectedView: isScoped ? AI_UNCATEGORIZED_CATEGORY : creatorView || 'regular',
			openSource: 'selective',
			showScrim: true,
			connectionType,
		});
		try {
			resetNodesPanelSession();
			useTelemetry().track('User opened node creator', {
				source: 'selective',
				mode: isScoped ? AI_UNCATEGORIZED_CATEGORY : creatorView || 'regular',
				nodes_panel_session_id: nodePanelSessionId,
			});
		} catch {}
	},

	openNodeCreatorForConnectingNode: ({ connection, eventSource }) => {
		// Persist interaction metadata for downstream placement/connection
		try {
			const ui = useUIStore.getState();
			ui.setLastInteractedWithNodeId(connection.source);
			ui.setLastInteractedWithNodeHandle(connection.sourceHandle ?? null);
		} catch {}
		const { type } = parseCanvasConnectionHandleString(connection.sourceHandle);
		const isScoped = type && type !== 'main';
		set({
			isCreateNodeActive: true,
			selectedView: isScoped ? AI_UNCATEGORIZED_CATEGORY : 'regular',
			openSource: eventSource,
			showScrim: true,
			connectionType: type,
		});
		try {
			resetNodesPanelSession();
			useTelemetry().track('User opened node creator', {
				source: eventSource,
				mode: isScoped ? AI_UNCATEGORIZED_CATEGORY : 'regular',
				nodes_panel_session_id: nodePanelSessionId,
			});
		} catch {}
	},
}));
