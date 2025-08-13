import { create } from 'zustand';

interface Credential {
	id: string;
	name: string;
	type: string;
	data?: Record<string, any>;
}

interface CredentialType {
	name: string;
	displayName: string;
	documentationUrl?: string;
	properties?: Record<string, any>;
}

interface CredentialsState {
	credentials: Credential[];
	credentialTypes: CredentialType[];
	loading: boolean;
	error: string | null;
}

interface CredentialsStore extends CredentialsState {
	setCredentials: (credentials: Credential[]) => void;
	setCredentialTypes: (types: CredentialType[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	fetchAllCredentials: () => Promise<void>;
	fetchCredentialTypes: (force?: boolean) => Promise<void>;
	getCredential: (id: string) => Credential | undefined;
	getCredentialType: (type: string) => CredentialType | undefined;
}

export const useCredentialsStore = create<CredentialsStore>((set, get) => ({
	credentials: [],
	credentialTypes: [],
	loading: false,
	error: null,

	setCredentials: (credentials: Credential[]) => {
		set({ credentials });
	},

	setCredentialTypes: (types: CredentialType[]) => {
		set({ credentialTypes: types });
	},

	setLoading: (loading: boolean) => {
		set({ loading });
	},

	setError: (error: string | null) => {
		set({ error });
	},

	fetchAllCredentials: async () => {
		set({ loading: true, error: null });
		try {
			const response = await fetch('/api/rest/credentials');
			if (!response.ok) {
				throw new Error('Failed to fetch credentials');
			}
			const credentials = await response.json();
			set({ credentials, loading: false });
		} catch (error) {
			set({ 
				loading: false, 
				error: error instanceof Error ? error.message : 'Unknown error' 
			});
		}
	},

	fetchCredentialTypes: async (force = false) => {
		if (!force && get().credentialTypes.length > 0) return;
		
		set({ loading: true, error: null });
		try {
			const response = await fetch('/api/rest/credential-types');
			if (!response.ok) {
				throw new Error('Failed to fetch credential types');
			}
			const types = await response.json();
			set({ credentialTypes: types, loading: false });
		} catch (error) {
			set({ 
				loading: false, 
				error: error instanceof Error ? error.message : 'Unknown error' 
			});
		}
	},

	getCredential: (id: string) => {
		return get().credentials.find(c => c.id === id);
	},

	getCredentialType: (type: string) => {
		return get().credentialTypes.find(ct => ct.name === type);
	},
}));