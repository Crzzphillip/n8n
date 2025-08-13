import { create } from 'zustand';

export type User = { id: string; email: string; firstName?: string; lastName?: string };

type State = {
  me?: User;
  loading: boolean;
  error?: string;
  fetchMe: () => Promise<void>;
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

export const useUsersStore = create<State>((set) => ({
  me: undefined,
  loading: false,
  async fetchMe() {
    set({ loading: true, error: undefined });
    try {
      const me = await fetchJson<User>(`/api/rest/me`);
      set({ me });
    } catch (e: any) {
      set({ error: e?.message || 'Failed to fetch user' });
    } finally {
      set({ loading: false });
    }
  },
}));