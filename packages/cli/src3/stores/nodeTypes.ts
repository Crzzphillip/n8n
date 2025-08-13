import { create } from 'zustand';

export type NodeType = {
  name: string;
  displayName: string;
  description?: string;
  group?: string[];
};

type State = {
  types: NodeType[];
  loading: boolean;
  error?: string;
  fetchAll: () => Promise<void>;
  search: (q: string) => NodeType[];
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

export const useNodeTypesStore = create<State>((set, get) => ({
  types: [],
  loading: false,
  async fetchAll() {
    set({ loading: true, error: undefined });
    try {
      const res = await fetchJson<{ nodeTypes: NodeType[] }>(`/api/rest/node-types`);
      const list = (res as any).nodeTypes || (res as any) || [];
      set({ types: list });
    } catch (e: any) {
      set({ error: e?.message || 'Failed to fetch node types' });
    } finally {
      set({ loading: false });
    }
  },
  search(q) {
    const query = q.trim().toLowerCase();
    if (!query) return get().types;
    return get().types.filter((t) =>
      [t.displayName, t.name, t.description || ''].some((s) => s.toLowerCase().includes(query)),
    );
  },
}));