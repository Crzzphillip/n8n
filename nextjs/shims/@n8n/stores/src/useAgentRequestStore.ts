import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { INodeParameters, NodeParameterValueType } from 'n8n-workflow';

const LOCAL_STORAGE_AGENT_REQUESTS = 'N8N_AGENT_REQUESTS';

export interface IAgentRequest {
	query: INodeParameters | string;
	toolName?: string;
}

export interface IAgentRequestStoreState {
	[workflowId: string]: {
		[nodeName: string]: IAgentRequest;
	};
}

type AgentRequestStore = {
	agentRequests: IAgentRequestStoreState;
	getAgentRequests: (workflowId: string, nodeId: string) => INodeParameters | string;
	getQueryValue: (
		workflowId: string,
		nodeId: string,
		paramName: string,
	) => NodeParameterValueType | undefined;
	setAgentRequestForNode: (
		workflowId: string,
		nodeId: string,
		request: IAgentRequest,
	) => void;
	clearAgentRequests: (workflowId: string, nodeId: string) => void;
	clearAllAgentRequests: (workflowId?: string) => void;
	getAgentRequest: (workflowId: string, nodeId: string) => IAgentRequest | undefined;
};

const ensureWorkflowAndNodeExist = (
	store: IAgentRequestStoreState,
	workflowId: string,
	nodeId: string,
): void => {
	if (!store[workflowId]) {
		store[workflowId] = {};
	}
	if (!store[workflowId][nodeId]) {
		store[workflowId][nodeId] = { query: {} };
	}
};

const noopStorage = {
	getItem: () => null,
	setItem: () => {},
	removeItem: () => {},
} as unknown as Storage;

export const useAgentRequestStore = create<AgentRequestStore>()(
	persist(
		(set, get) => ({
			agentRequests: {},
			getAgentRequests: (workflowId, nodeId) => {
				return get().agentRequests[workflowId]?.[nodeId]?.query || {};
			},
			getQueryValue: (workflowId, nodeId, paramName) => {
				const query = get().agentRequests[workflowId]?.[nodeId]?.query;
				if (typeof query === 'string') return undefined;
				return query?.[paramName];
			},
			setAgentRequestForNode: (workflowId, nodeId, request) => {
				set((state) => {
					const next: IAgentRequestStoreState = { ...state.agentRequests };
					ensureWorkflowAndNodeExist(next, workflowId, nodeId);
					next[workflowId][nodeId] = {
						...request,
						query: typeof request.query === 'string' ? request.query : { ...request.query },
					};
					return { agentRequests: next };
				});
			},
			clearAgentRequests: (workflowId, nodeId) => {
				set((state) => {
					if (!state.agentRequests[workflowId]) return {} as Partial<AgentRequestStore>;
					return {
						agentRequests: {
							...state.agentRequests,
							[workflowId]: {
								...state.agentRequests[workflowId],
								[nodeId]: { query: {} },
							},
						},
					} as Partial<AgentRequestStore>;
				});
			},
			clearAllAgentRequests: (workflowId) => {
				set((state) => {
					if (workflowId) {
						if (!state.agentRequests[workflowId]) return {} as Partial<AgentRequestStore>;
	return {
							agentRequests: {
								...state.agentRequests,
								[workflowId]: {},
							},
						} as Partial<AgentRequestStore>;
					}
					return { agentRequests: {} } as Partial<AgentRequestStore>;
				});
			},
			getAgentRequest: (workflowId, nodeId) => {
				const workflow = get().agentRequests[workflowId];
				return workflow ? workflow[nodeId] : undefined;
			},
		}),
		{
			name: LOCAL_STORAGE_AGENT_REQUESTS,
			partialize: (state) => ({ agentRequests: state.agentRequests }),
			storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : noopStorage)),
		},
	),
);
