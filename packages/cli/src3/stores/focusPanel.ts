import { create } from 'zustand';

interface FocusPanelState {
	isOpen: boolean;
	isLoading: boolean;
	content: string;
}

interface FocusPanelStore extends FocusPanelState {
	toggleFocusPanel: () => void;
	setIsOpen: (isOpen: boolean) => void;
	setIsLoading: (isLoading: boolean) => void;
	setContent: (content: string) => void;
}

export const useFocusPanelStore = create<FocusPanelStore>((set) => ({
	isOpen: false,
	isLoading: false,
	content: '',

	toggleFocusPanel: () => {
		set((s) => ({ isOpen: !s.isOpen }));
	},

	setIsOpen: (isOpen: boolean) => {
		set({ isOpen });
	},

	setIsLoading: (isLoading: boolean) => {
		set({ isLoading });
	},

	setContent: (content: string) => {
		set({ content });
	},
}));