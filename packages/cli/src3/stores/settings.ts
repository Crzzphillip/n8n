import { create } from 'zustand';

interface SettingsState {
	isPreviewMode: boolean;
	isEnterpriseFeatureEnabled: Record<string, boolean>;
	userManagement: {
		showPersonalizationSurvey: boolean;
	};
}

interface SettingsStore extends SettingsState {
	setIsPreviewMode: (isPreviewMode: boolean) => void;
	setEnterpriseFeatureEnabled: (feature: string, enabled: boolean) => void;
	setShowPersonalizationSurvey: (show: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
	isPreviewMode: false,
	isEnterpriseFeatureEnabled: {
		Variables: false,
		ExternalSecrets: false,
	},
	userManagement: {
		showPersonalizationSurvey: false,
	},

	setIsPreviewMode: (isPreviewMode: boolean) => {
		set({ isPreviewMode });
	},

	setEnterpriseFeatureEnabled: (feature: string, enabled: boolean) => {
		set((state) => ({
			isEnterpriseFeatureEnabled: {
				...state.isEnterpriseFeatureEnabled,
				[feature]: enabled,
			},
		}));
	},

	setShowPersonalizationSurvey: (show: boolean) => {
		set((state) => ({
			userManagement: {
				...state.userManagement,
				showPersonalizationSurvey: show,
			},
		}));
	},
}));