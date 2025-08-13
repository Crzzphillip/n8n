import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

const resources = {
	en: {
		translation: {
			nodeView: {
				loading: 'Loading…',
				readOnlyEnv: 'Read-only environment',
				error: {
					initData: 'Failed to initialize data',
					envVars: 'Failed to load environment variables',
					externalSecrets: 'Failed to load external secrets',
					importTemplate: 'Failed to import template',
					loadWorkflow: 'Failed to load workflow',
				},
				success: {
					pull: 'Successfully pulled latest changes',
					workflowSaved: 'Workflow saved',
					savedFromNDV: 'Saved from Node panel',
				},
				toast: {
					readOnly: {
						title: 'Read-only environment',
						message: 'You cannot edit or run workflows on this branch.',
					},
				},
				import: {
					confirmTitle: 'Import',
					confirmMessage: 'Import workflow from URL?\n{{url}}',
				},
			},
			ndv: {
				preview: { banner: 'This is a production execution preview' },
				saveParameters: 'Save parameters',
				openConnectionCreator: 'Open connection node creator',
				switchSelectedNode: 'Switch selected node',
				noNodeSelected: 'No node selected',
				credential: 'Credential',
			},
		},
	},
};

if (!i18n.isInitialized) {
	i18n.use(initReactI18next).init({
		resources,
		lng: 'en',
		fallbackLng: 'en',
		interpolation: { escapeValue: false },
	});
}

export function useI18n() {
	const { t } = useTranslation();
	return { t };
}
