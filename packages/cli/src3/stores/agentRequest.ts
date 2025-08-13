import { create } from 'zustand';

export type AgentRequestState = {
  requests: Record<string, AgentRequest[]>;
  activeRequests: Set<string>;
  pendingRequests: Set<string>;
  completedRequests: Set<string>;
  failedRequests: Set<string>;
  requestHistory: AgentRequest[];
  maxHistorySize: number;
};

export type AgentRequest = {
  id: string;
  workflowId: string;
  nodeId: string;
  nodeName: string;
  type: 'parameter' | 'execution' | 'debug' | 'optimization';
  status: 'pending' | 'active' | 'completed' | 'failed';
  prompt: string;
  response?: string;
  error?: string;
  timestamp: number;
  duration?: number;
  metadata?: Record<string, any>;
};

type State = AgentRequestState & {
  createRequest: (request: Omit<AgentRequest, 'id' | 'timestamp' | 'status'>) => string;
  updateRequest: (id: string, updates: Partial<AgentRequest>) => void;
  completeRequest: (id: string, response: string, metadata?: Record<string, any>) => void;
  failRequest: (id: string, error: string) => void;
  cancelRequest: (id: string) => void;
  clearRequests: (workflowId?: string) => void;
  getRequestsByWorkflow: (workflowId: string) => AgentRequest[];
  getRequestsByNode: (workflowId: string, nodeId: string) => AgentRequest[];
  getActiveRequests: () => AgentRequest[];
  getPendingRequests: () => AgentRequest[];
  getCompletedRequests: () => AgentRequest[];
  getFailedRequests: () => AgentRequest[];
  reset: () => void;
};

const initialState: AgentRequestState = {
  requests: {},
  activeRequests: new Set(),
  pendingRequests: new Set(),
  completedRequests: new Set(),
  failedRequests: new Set(),
  requestHistory: [],
  maxHistorySize: 100,
};

export const useAgentRequestStore = create<State>((set, get) => ({
  ...initialState,

  createRequest(request) {
    const id = Math.random().toString(36).slice(2);
    const newRequest: AgentRequest = {
      ...request,
      id,
      timestamp: Date.now(),
      status: 'pending',
    };

    set((state) => {
      const workflowRequests = state.requests[request.workflowId] || [];
      const newRequests = {
        ...state.requests,
        [request.workflowId]: [...workflowRequests, newRequest],
      };

      const newPendingRequests = new Set(state.pendingRequests);
      newPendingRequests.add(id);

      const newHistory = [...state.requestHistory, newRequest];
      if (newHistory.length > state.maxHistorySize) {
        newHistory.splice(0, newHistory.length - state.maxHistorySize);
      }

      return {
        requests: newRequests,
        pendingRequests: newPendingRequests,
        requestHistory: newHistory,
      };
    });

    return id;
  },

  updateRequest(id, updates) {
    set((state) => {
      const newRequests = { ...state.requests };
      let requestFound = false;

      // Update request in all workflows
      Object.keys(newRequests).forEach((workflowId) => {
        const workflowRequests = newRequests[workflowId];
        const requestIndex = workflowRequests.findIndex((req) => req.id === id);
        
        if (requestIndex !== -1) {
          requestFound = true;
          newRequests[workflowId] = workflowRequests.map((req, index) =>
            index === requestIndex ? { ...req, ...updates } : req
          );
        }
      });

      // Update status sets
      const newActiveRequests = new Set(state.activeRequests);
      const newPendingRequests = new Set(state.pendingRequests);
      const newCompletedRequests = new Set(state.completedRequests);
      const newFailedRequests = new Set(state.failedRequests);

      if (updates.status) {
        newActiveRequests.delete(id);
        newPendingRequests.delete(id);
        newCompletedRequests.delete(id);
        newFailedRequests.delete(id);

        switch (updates.status) {
          case 'active':
            newActiveRequests.add(id);
            break;
          case 'pending':
            newPendingRequests.add(id);
            break;
          case 'completed':
            newCompletedRequests.add(id);
            break;
          case 'failed':
            newFailedRequests.add(id);
            break;
        }
      }

      // Update history
      const newHistory = state.requestHistory.map((req) =>
        req.id === id ? { ...req, ...updates } : req
      );

      return {
        requests: newRequests,
        activeRequests: newActiveRequests,
        pendingRequests: newPendingRequests,
        completedRequests: newCompletedRequests,
        failedRequests: newFailedRequests,
        requestHistory: newHistory,
      };
    });
  },

  completeRequest(id, response, metadata) {
    const { updateRequest } = get();
    updateRequest(id, {
      status: 'completed',
      response,
      metadata,
      duration: Date.now() - (get().requestHistory.find((req) => req.id === id)?.timestamp || Date.now()),
    });
  },

  failRequest(id, error) {
    const { updateRequest } = get();
    updateRequest(id, {
      status: 'failed',
      error,
      duration: Date.now() - (get().requestHistory.find((req) => req.id === id)?.timestamp || Date.now()),
    });
  },

  cancelRequest(id) {
    const { updateRequest } = get();
    updateRequest(id, { status: 'failed', error: 'Request cancelled' });
  },

  clearRequests(workflowId) {
    set((state) => {
      if (workflowId) {
        const newRequests = { ...state.requests };
        delete newRequests[workflowId];
        return { requests: newRequests };
      } else {
        return { requests: {} };
      }
    });
  },

  getRequestsByWorkflow(workflowId) {
    return get().requests[workflowId] || [];
  },

  getRequestsByNode(workflowId, nodeId) {
    const workflowRequests = get().requests[workflowId] || [];
    return workflowRequests.filter((req) => req.nodeId === nodeId);
  },

  getActiveRequests() {
    const { requestHistory, activeRequests } = get();
    return requestHistory.filter((req) => activeRequests.has(req.id));
  },

  getPendingRequests() {
    const { requestHistory, pendingRequests } = get();
    return requestHistory.filter((req) => pendingRequests.has(req.id));
  },

  getCompletedRequests() {
    const { requestHistory, completedRequests } = get();
    return requestHistory.filter((req) => completedRequests.has(req.id));
  },

  getFailedRequests() {
    const { requestHistory, failedRequests } = get();
    return requestHistory.filter((req) => failedRequests.has(req.id));
  },

  reset() {
    set(initialState);
  },
}));