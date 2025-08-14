import { create } from 'zustand';

interface Folder {
	id: string;
	name: string;
	parentFolder?: string;
}

interface FoldersState {
	byId: Record<string, Folder>;
	pathCache: Record<string, Folder[]>;
	loading: boolean;
	error: string | null;
}

interface FoldersStore extends FoldersState {
	setFolder: (folder: Folder) => void;
	setPath: (folderId: string, path: Folder[]) => void;
	getFolder: (id: string) => Folder | undefined;
	getFolderPath: (projectId: string, folderId: string) => Promise<Folder[]>;
}

export const useFoldersStore = create<FoldersStore>((set, get) => ({
	byId: {},
	pathCache: {},
	loading: false,
	error: null,

	setFolder: (folder: Folder) => set((s) => ({ byId: { ...s.byId, [folder.id]: folder } })),
	setPath: (folderId: string, path: Folder[]) =>
		set((s) => ({ pathCache: { ...s.pathCache, [folderId]: path } })),
	getFolder: (id: string) => get().byId[id],

	getFolderPath: async (projectId: string, folderId: string) => {
		set({ loading: true, error: null });
		try {
			const res = await fetch(`/api/rest/projects/${projectId}/folders/${folderId}/path`);
			if (!res.ok) throw new Error('Failed to fetch folder path');
			const path = await res.json();
			set({ loading: false });
			return path as Folder[];
		} catch (e) {
			set({ loading: false, error: e instanceof Error ? e.message : 'Unknown error' });
			return [];
		}
	},
}));
