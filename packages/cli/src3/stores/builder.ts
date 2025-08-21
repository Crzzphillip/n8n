import { create } from 'zustand';

interface BuilderState {
	isAIBuilderEnabled: boolean;
	isAssistantEnabled: boolean;
	isLoading: boolean;
	error: string | null;
}

interface BuilderStore extends BuilderState {
	setAIBuilderEnabled: (enabled: boolean) => void;
	setAssistantEnabled: (enabled: boolean) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
}

export const useBuilderStore = create<BuilderStore>((set) => ({
	isAIBuilderEnabled: false,
	isAssistantEnabled: false,
	isLoading: false,
	error: null,

	setAIBuilderEnabled: (enabled: boolean) => {
		set({ isAIBuilderEnabled: enabled });
	},

	setAssistantEnabled: (enabled: boolean) => {
		set({ isAssistantEnabled: enabled });
	},

	setLoading: (loading: boolean) => {
		set({ isLoading: loading });
	},

	setError: (error: string | null) => {
		set({ error });
	},
}));