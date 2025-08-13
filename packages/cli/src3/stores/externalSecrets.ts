import { create } from 'zustand';

interface ExternalSecret {
	id: string;
	name: string;
	provider: string;
}

interface ExternalSecretsState {
	secrets: ExternalSecret[];
	loading: boolean;
	error: string | null;
}

interface ExternalSecretsStore extends ExternalSecretsState {
	setSecrets: (secrets: ExternalSecret[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	fetchAllSecrets: () => Promise<void>;
}

export const useExternalSecretsStore = create<ExternalSecretsStore>((set) => ({
	secrets: [],
	loading: false,
	error: null,

	setSecrets: (secrets: ExternalSecret[]) => set({ secrets }),
	setLoading: (loading: boolean) => set({ loading }),
	setError: (error: string | null) => set({ error }),

	fetchAllSecrets: async () => {
		set({ loading: true, error: null });
		try {
			const res = await fetch('/api/rest/external-secrets');
			if (!res.ok) throw new Error('Failed to fetch external secrets');
			const secrets = await res.json();
			set({ secrets, loading: false });
		} catch (e) {
			set({ loading: false, error: e instanceof Error ? e.message : 'Unknown error' });
		}
	},
}));
