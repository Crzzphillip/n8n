import { create } from 'zustand';

interface AgentRequest {
	id: string;
	workflowId: string;
	nodeId: string;
	status: 'pending' | 'completed' | 'failed';
	data?: any;
	error?: string;
}

interface AgentRequestState {
	requests: Record<string, AgentRequest[]>;
	loading: boolean;
	error: string | null;
}

interface AgentRequestStore extends AgentRequestState {
	addRequest: (workflowId: string, nodeId: string, request: AgentRequest) => void;
	updateRequest: (workflowId: string, nodeId: string, requestId: string, updates: Partial<AgentRequest>) => void;
	clearAgentRequests: (workflowId: string, nodeId: string) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	getRequests: (workflowId: string, nodeId: string) => AgentRequest[];
}

export const useAgentRequestStore = create<AgentRequestStore>((set, get) => ({
	requests: {},
	loading: false,
	error: null,

	addRequest: (workflowId: string, nodeId: string, request: AgentRequest) => {
		const key = `${workflowId}-${nodeId}`;
		set((s) => ({
			requests: {
				...s.requests,
				[key]: [...(s.requests[key] || []), request],
			},
		}));
	},

	updateRequest: (workflowId: string, nodeId: string, requestId: string, updates: Partial<AgentRequest>) => {
		const key = `${workflowId}-${nodeId}`;
		set((s) => ({
			requests: {
				...s.requests,
				[key]: (s.requests[key] || []).map((req) =>
					req.id === requestId ? { ...req, ...updates } : req
				),
			},
		}));
	},

	clearAgentRequests: (workflowId: string, nodeId: string) => {
		const key = `${workflowId}-${nodeId}`;
		set((s) => {
			const newRequests = { ...s.requests };
			delete newRequests[key];
			return { requests: newRequests };
		});
	},

	setLoading: (loading: boolean) => {
		set({ loading });
	},

	setError: (error: string | null) => {
		set({ error });
	},

	getRequests: (workflowId: string, nodeId: string) => {
		const key = `${workflowId}-${nodeId}`;
		return get().requests[key] || [];
	},
}));