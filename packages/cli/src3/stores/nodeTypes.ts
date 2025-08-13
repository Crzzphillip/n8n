import { create } from 'zustand';

interface NodeType {
	id: string;
	name: string;
	displayName: string;
	description?: string;
	icon?: string;
	group?: string[];
	version: number;
	defaults?: Record<string, any>;
	inputs?: string[];
	outputs?: string[];
	properties?: Record<string, any>;
	credentials?: string[];
	trigger?: boolean;
	webhook?: boolean;
}

interface NodeTypesState {
	allNodeTypes: NodeType[];
	loading: boolean;
	error: string | null;
}

interface NodeTypesStore extends NodeTypesState {
	setNodeTypes: (nodeTypes: NodeType[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	getNodeType: (type: string, version?: number) => NodeType | undefined;
	getNodeTypes: () => Promise<void>;
	isTriggerNode: (type: string) => boolean;
}

export const useNodeTypesStore = create<NodeTypesStore>((set, get) => ({
	allNodeTypes: [],
	loading: false,
	error: null,

	setNodeTypes: (nodeTypes: NodeType[]) => {
		set({ allNodeTypes: nodeTypes });
	},

	setLoading: (loading: boolean) => {
		set({ loading });
	},

	setError: (error: string | null) => {
		set({ error });
	},

	getNodeType: (type: string, version?: number) => {
		const { allNodeTypes } = get();
		return allNodeTypes.find(nt => 
			nt.name === type && (version === undefined || nt.version === version)
		);
	},

	getNodeTypes: async () => {
		set({ loading: true, error: null });
		try {
			const response = await fetch('/api/rest/node-types');
			if (!response.ok) {
				throw new Error('Failed to fetch node types');
			}
			const nodeTypes = await response.json();
			set({ allNodeTypes: nodeTypes, loading: false });
		} catch (error) {
			set({ 
				loading: false, 
				error: error instanceof Error ? error.message : 'Unknown error' 
			});
		}
	},

	isTriggerNode: (type: string) => {
		const nodeType = get().getNodeType(type);
		return nodeType?.trigger === true;
	},
}));