import { create } from 'zustand';

interface User {
	id: string;
	email: string;
	firstName?: string;
	lastName?: string;
	role: string;
}

interface UsersState {
	currentUser: User | null;
	users: User[];
	loading: boolean;
	error: string | null;
}

interface UsersStore extends UsersState {
	setCurrentUser: (user: User | null) => void;
	setUsers: (users: User[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	fetchCurrentUser: () => Promise<void>;
	showPersonalizationSurvey: () => void;
}

export const useUsersStore = create<UsersStore>((set) => ({
	currentUser: null,
	users: [],
	loading: false,
	error: null,

	setCurrentUser: (user: User | null) => {
		set({ currentUser: user });
	},

	setUsers: (users: User[]) => {
		set({ users });
	},

	setLoading: (loading: boolean) => {
		set({ loading });
	},

	setError: (error: string | null) => {
		set({ error });
	},

	fetchCurrentUser: async () => {
		set({ loading: true, error: null });
		try {
			const response = await fetch('/api/rest/users/me');
			if (!response.ok) {
				throw new Error('Failed to fetch current user');
			}
			const user = await response.json();
			set({ currentUser: user, loading: false });
		} catch (error) {
			set({ 
				loading: false, 
				error: error instanceof Error ? error.message : 'Unknown error' 
			});
		}
	},

	showPersonalizationSurvey: () => {
		// In a real implementation, this would show a personalization survey
		console.log('Showing personalization survey');
	},
}));