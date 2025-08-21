import { create } from 'zustand';

interface PosthogState {
	variants: Record<string, string>;
}

interface PosthogStore extends PosthogState {
	setVariant: (name: string, variant: string) => void;
	isVariantEnabled: (name: string, variant: string) => boolean;
}

export const usePostHog = create<PosthogStore>((set, get) => ({
	variants: {},
	setVariant: (name: string, variant: string) =>
		set((s) => ({ variants: { ...s.variants, [name]: variant } })),
	isVariantEnabled: (name: string, variant: string) => get().variants[name] === variant,
}));
