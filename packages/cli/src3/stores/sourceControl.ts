import { create } from 'zustand';

interface SourceControlPreferences {
	branchReadOnly: boolean;
	branchName: string;
	repositoryUrl?: string;
}

interface SourceControlState {
	preferences: SourceControlPreferences;
	loading: boolean;
	error: string | null;
}

interface SourceControlStore extends SourceControlState {
	setPreferences: (preferences: Partial<SourceControlPreferences>) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	pull: () => Promise<void>;
	push: () => Promise<void>;
	commit: (message: string) => Promise<void>;
}

export const useSourceControlStore = create<SourceControlStore>((set, get) => ({
	preferences: {
		branchReadOnly: false,
		branchName: 'main',
	},
	loading: false,
	error: null,

	setPreferences: (preferences: Partial<SourceControlPreferences>) => {
		set((state) => ({
			preferences: { ...state.preferences, ...preferences },
		}));
	},

	setLoading: (loading: boolean) => {
		set({ loading });
	},

	setError: (error: string | null) => {
		set({ error });
	},

	pull: async () => {
		set({ loading: true, error: null });
		try {
			// In a real implementation, this would call the Git pull API
			await new Promise(resolve => setTimeout(resolve, 1000));
			set({ loading: false });
		} catch (error) {
			set({ 
				loading: false, 
				error: error instanceof Error ? error.message : 'Unknown error' 
			});
		}
	},

	push: async () => {
		set({ loading: true, error: null });
		try {
			// In a real implementation, this would call the Git push API
			await new Promise(resolve => setTimeout(resolve, 1000));
			set({ loading: false });
		} catch (error) {
			set({ 
				loading: false, 
				error: error instanceof Error ? error.message : 'Unknown error' 
			});
		}
	},

	commit: async (message: string) => {
		set({ loading: true, error: null });
		try {
			// In a real implementation, this would call the Git commit API
			await new Promise(resolve => setTimeout(resolve, 1000));
			set({ loading: false });
		} catch (error) {
			set({ 
				loading: false, 
				error: error instanceof Error ? error.message : 'Unknown error' 
			});
		}
	},
}));