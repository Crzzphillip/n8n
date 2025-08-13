import { create } from 'zustand';

interface Template {
	id: string;
	name: string;
	description?: string;
	workflow: any;
}

interface TemplatesState {
	templates: Template[];
	loading: boolean;
	error: string | null;
	previousSessionId: string | null;
}

interface TemplatesStore extends TemplatesState {
	setTemplates: (templates: Template[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	setPreviousSessionId: (sessionId: string | null) => void;
	getTemplate: (id: string) => Template | undefined;
	fetchTemplate: (id: string) => Promise<Template>;
}

export const useTemplatesStore = create<TemplatesStore>((set, get) => ({
	templates: [],
	loading: false,
	error: null,
	previousSessionId: null,

	setTemplates: (templates: Template[]) => {
		set({ templates });
	},

	setLoading: (loading: boolean) => {
		set({ loading });
	},

	setError: (error: string | null) => {
		set({ error });
	},

	setPreviousSessionId: (sessionId: string | null) => {
		set({ previousSessionId: sessionId });
	},

	getTemplate: (id: string) => {
		return get().templates.find(t => t.id === id);
	},

	fetchTemplate: async (id: string) => {
		set({ loading: true, error: null });
		try {
			const response = await fetch(`/api/rest/templates/${id}`);
			if (!response.ok) {
				throw new Error('Failed to fetch template');
			}
			const template = await response.json();
			set({ loading: false });
			return template;
		} catch (error) {
			set({ loading: false, error: error instanceof Error ? error.message : 'Unknown error' });
			throw error;
		}
	},
}));