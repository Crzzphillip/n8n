import { create } from 'zustand';

interface Tag {
	id: string;
	name: string;
	color?: string;
}

interface TagsState {
	tags: Tag[];
	loading: boolean;
	error: string | null;
}

interface TagsStore extends TagsState {
	setTags: (tags: Tag[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	fetchTags: () => Promise<void>;
	getTag: (id: string) => Tag | undefined;
	createTag: (tag: Omit<Tag, 'id'>) => Promise<Tag>;
	deleteTag: (id: string) => Promise<void>;
}

export const useTagsStore = create<TagsStore>((set, get) => ({
	tags: [],
	loading: false,
	error: null,

	setTags: (tags: Tag[]) => {
		set({ tags });
	},

	setLoading: (loading: boolean) => {
		set({ loading });
	},

	setError: (error: string | null) => {
		set({ error });
	},

	fetchTags: async () => {
		set({ loading: true, error: null });
		try {
			const response = await fetch('/api/rest/tags');
			if (!response.ok) {
				throw new Error('Failed to fetch tags');
			}
			const tags = await response.json();
			set({ tags, loading: false });
		} catch (error) {
			set({ 
				loading: false, 
				error: error instanceof Error ? error.message : 'Unknown error' 
			});
		}
	},

	getTag: (id: string) => {
		return get().tags.find(t => t.id === id);
	},

	createTag: async (tag: Omit<Tag, 'id'>) => {
		set({ loading: true, error: null });
		try {
			const response = await fetch('/api/rest/tags', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(tag),
			});
			if (!response.ok) {
				throw new Error('Failed to create tag');
			}
			const newTag = await response.json();
			set((state) => ({ 
				tags: [...state.tags, newTag], 
				loading: false 
			}));
			return newTag;
		} catch (error) {
			set({ 
				loading: false, 
				error: error instanceof Error ? error.message : 'Unknown error' 
			});
			throw error;
		}
	},

	deleteTag: async (id: string) => {
		set({ loading: true, error: null });
		try {
			const response = await fetch(`/api/rest/tags/${id}`, {
				method: 'DELETE',
			});
			if (!response.ok) {
				throw new Error('Failed to delete tag');
			}
			set((state) => ({ 
				tags: state.tags.filter(t => t.id !== id), 
				loading: false 
			}));
		} catch (error) {
			set({ 
				loading: false, 
				error: error instanceof Error ? error.message : 'Unknown error' 
			});
			throw error;
		}
	},
}));