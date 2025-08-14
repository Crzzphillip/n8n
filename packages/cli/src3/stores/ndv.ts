import { create } from 'zustand';
import type { INodeUi } from '../types/Interface';

interface NDVState {
	activeNodeName: string | null;
	activeNode: INodeUi | null;
	isNDVOpen: boolean;
	pushRef: string;
}

interface NDVStore extends NDVState {
	setActiveNodeName: (nodeName: string | null) => void;
	setActiveNode: (node: INodeUi | null) => void;
	setNDVPushRef: () => void;
	resetNDVPushRef: () => void;
}

export const useNDVStore = create<NDVStore>((set, get) => ({
	activeNodeName: null,
	activeNode: null,
	isNDVOpen: false,
	pushRef: '',

	setActiveNodeName: (nodeName: string | null) => {
		set({ 
			activeNodeName: nodeName,
			isNDVOpen: nodeName !== null 
		});
	},

	setActiveNode: (node: INodeUi | null) => {
		set({ 
			activeNode: node,
			activeNodeName: node?.name || null,
			isNDVOpen: node !== null 
		});
	},

	setNDVPushRef: () => {
		const pushRef = `ndv-${Date.now()}-${Math.random().toString(36).slice(2)}`;
		set({ pushRef });
	},

	resetNDVPushRef: () => {
		set({ pushRef: '' });
	},
}));