import { create } from 'zustand';

export type Credential = {
  id: string;
  name: string;
  type: string;
};

type State = {
  items: Credential[];
  loading: boolean;
  error?: string;
  list: () => Promise<void>;
  getById: (id: string) => Promise<Credential | undefined>;
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

export const useCredentialsStore = create<State>((set, get) => ({
  items: [],
  loading: false,
  async list() {
    set({ loading: true, error: undefined });
    try {
      const res = await fetchJson<Credential[]>(`/api/rest/credentials`);
      const list = (res as any).data || (res as any) || [];
      set({ items: list });
    } catch (e: any) {
      set({ error: e?.message || 'Failed to list credentials' });
    } finally {
      set({ loading: false });
    }
  },
  async getById(id) {
    try {
      const res = await fetchJson<Credential>(`/api/rest/credentials/${id}`);
      return (res as any) as Credential;
    } catch {
      return undefined;
    }
  },
}));