import { create } from 'zustand';

interface NpsSurveyState {
	enabled: boolean;
	lastPromptAt?: number;
}

interface NpsSurveyStore extends NpsSurveyState {
	setupOnLogin: (userId: string, settings?: any) => void;
	fetchPromptsData: () => Promise<void>;
	resetOnLogout: () => void;
}

export const useNpsSurveyStore = create<NpsSurveyStore>((set, get) => ({
	enabled: true,
	lastPromptAt: undefined,

	setupOnLogin: (userId: string, settings?: any) => {
		set({ enabled: true });
	},

	fetchPromptsData: async () => {
		try {
			// Placeholder: would fetch prompts based on user/time windows
			set({ lastPromptAt: Date.now() });
		} catch {}
	},

	resetOnLogout: () => set({ enabled: false, lastPromptAt: undefined }),
}));
