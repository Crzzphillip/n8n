import { create } from 'zustand';

export type Project = { id: string; name: string };

type State = {
  items: Project[];
  loading: boolean;
  error?: string;
  list: () => Promise<void>;
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

export const useProjectsStore = create<State>((set) => ({
  items: [],
  loading: false,
  async list() {
    set({ loading: true, error: undefined });
    try {
      const res = await fetchJson<Project[]>(`/api/rest/projects`);
      const list = (res as any).data || (res as any) || [];
      set({ items: list });
    } catch (e: any) {
      set({ error: e?.message || 'Failed to list projects' });
    } finally {
      set({ loading: false });
    }
  },
}));