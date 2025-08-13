import { create } from 'zustand';

type Settings = Record<string, any>;

type State = {
  data?: Settings;
  loading: boolean;
  error?: string;
  fetch: () => Promise<void>;
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

export const useSettingsStore = create<State>((set) => ({
  data: undefined,
  loading: false,
  async fetch() {
    set({ loading: true, error: undefined });
    try {
      const data = await fetchJson<Settings>(`/api/rest/settings`);
      set({ data });
    } catch (e: any) {
      set({ error: e?.message || 'Failed to fetch settings' });
    } finally {
      set({ loading: false });
    }
  },
}));