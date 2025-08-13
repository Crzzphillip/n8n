import { create } from 'zustand';

export type ExecutionSummary = {
  id: string;
  status: 'new' | 'running' | 'success' | 'error' | 'waiting' | 'stopped';
  startedAt?: string;
  stoppedAt?: string;
};

type State = {
  items: ExecutionSummary[];
  loading: boolean;
  error?: string;
  list: () => Promise<void>;
  run: (workflowId: string) => Promise<string>;
  stop: (executionId: string) => Promise<void>;
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

export const useExecutionsStore = create<State>((set, get) => ({
  items: [],
  loading: false,
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
}));