import { create } from 'zustand';

interface EnvironmentVariable {
	id: string;
	name: string;
	value: string;
}

interface EnvironmentsState {
	variables: EnvironmentVariable[];
	loading: boolean;
	error: string | null;
}

interface EnvironmentsStore extends EnvironmentsState {
	setVariables: (variables: EnvironmentVariable[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	fetchAllVariables: () => Promise<void>;
}

export const useEnvironmentsStore = create<EnvironmentsStore>((set) => ({
	variables: [],
	loading: false,
	error: null,

	setVariables: (variables: EnvironmentVariable[]) => set({ variables }),
	setLoading: (loading: boolean) => set({ loading }),
	setError: (error: string | null) => set({ error }),

	fetchAllVariables: async () => {
		set({ loading: true, error: null });
		try {
			const res = await fetch('/api/rest/environments/variables');
			if (!res.ok) throw new Error('Failed to fetch variables');
			const variables = await res.json();
			set({ variables, loading: false });
		} catch (e) {
			set({ loading: false, error: e instanceof Error ? e.message : 'Unknown error' });
		}
	},
}));
