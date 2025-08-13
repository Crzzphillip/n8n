import { create } from 'zustand';

interface Project {
	id: string;
	name: string;
	description?: string;
	homeProject?: string;
}

interface ProjectsState {
	projects: Project[];
	currentProject: Project | null;
	loading: boolean;
	error: string | null;
}

interface ProjectsStore extends ProjectsState {
	setProjects: (projects: Project[]) => void;
	setCurrentProject: (project: Project | null) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	fetchProjects: () => Promise<void>;
	getProject: (id: string) => Project | undefined;
}

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
	projects: [],
	currentProject: null,
	loading: false,
	error: null,

	setProjects: (projects: Project[]) => {
		set({ projects });
	},

	setCurrentProject: (project: Project | null) => {
		set({ currentProject: project });
	},

	setLoading: (loading: boolean) => {
		set({ loading });
	},

	setError: (error: string | null) => {
		set({ error });
	},

	fetchProjects: async () => {
		set({ loading: true, error: null });
		try {
			const response = await fetch('/api/rest/projects');
			if (!response.ok) {
				throw new Error('Failed to fetch projects');
			}
			const projects = await response.json();
			set({ projects, loading: false });
		} catch (error) {
			set({ 
				loading: false, 
				error: error instanceof Error ? error.message : 'Unknown error' 
			});
		}
	},

	getProject: (id: string) => {
		return get().projects.find(p => p.id === id);
	},
}));