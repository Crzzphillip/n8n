import { create } from 'zustand';

export type Tag = { id: string; name: string; }; 

type State = {
  items: Tag[];
  loading: boolean;
  error?: string;
  list: () => Promise<void>;
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

export const useTagsStore = create<State>((set) => ({
  items: [],
  loading: false,
  async list() {
    set({ loading: true, error: undefined });
    try {
      const res = await fetchJson<Tag[]>(`/api/rest/tags`);
      const list = (res as any).data || (res as any) || [];
      set({ items: list });
    } catch (e: any) {
      set({ error: e?.message || 'Failed to list tags' });
    } finally {
      set({ loading: false });
    }
  },
}));