import { create } from 'zustand';
import type { IExecutionResponse, ExecutionSummary as IExecutionSummary } from '../types/Interface';

export type ExecutionSummary = {
  id: string;
  status: 'new' | 'running' | 'success' | 'error' | 'waiting' | 'stopped';
  startedAt?: string;
  stoppedAt?: string;
  finished?: boolean;
  waitTill?: boolean;
};

interface ExecutionsState {
  items: ExecutionSummary[];
  activeExecution: ExecutionSummary | null;
  loading: boolean;
  error?: string;
}

interface ExecutionsStore extends ExecutionsState {
  list: () => Promise<void>;
  run: (workflowId: string) => Promise<string>;
  stop: (executionId: string) => Promise<void>;
  fetchExecution: (executionId: string) => Promise<ExecutionSummary>;
  setActiveExecution: (execution: ExecutionSummary | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

export const useExecutionsStore = create<ExecutionsStore>((set, get) => ({
  items: [],
  activeExecution: null,
  loading: false,
  error: undefined,

  async list() {
    set({ loading: true, error: undefined });
    try {
      const res = await fetchJson<{ results: ExecutionSummary[] }>(`/api/rest/executions`);
      const results = (res as any).results || (res as any) || [];
      set({ items: results });
    } catch (e: any) {
      set({ error: e?.message || 'Failed to list executions' });
    } finally {
      set({ loading: false });
    }
  },

  async run(workflowId) {
    const res = await fetchJson<{ id: string }>(`/api/rest/workflows/${workflowId}/run`, {
      method: 'POST',
    });
    return (res as any).id || (res as any);
  },

  async stop(executionId) {
    await fetchJson(`/api/rest/executions/${executionId}/stop`, { method: 'POST' });
  },

  async fetchExecution(executionId: string) {
    set({ loading: true, error: undefined });
    try {
      const execution = await fetchJson<ExecutionSummary>(`/api/rest/executions/${executionId}`);
      set({ loading: false });
      return execution;
    } catch (e: any) {
      set({ loading: false, error: e?.message || 'Failed to fetch execution' });
      throw e;
    }
  },

  setActiveExecution: (execution: ExecutionSummary | null) => {
    set({ activeExecution: execution });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error?: string) => {
    set({ error });
  },
}));