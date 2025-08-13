import { useCallback } from 'react';

const en: Record<string, string> = {
	'nodeView.loading': 'Loading…',
	'nodeView.readOnlyEnv': 'Read-only environment',
	'nodeView.error.initData': 'Failed to initialize data',
	'nodeView.error.envVars': 'Failed to load environment variables',
	'nodeView.error.externalSecrets': 'Failed to load external secrets',
	'nodeView.success.pull': 'Successfully pulled latest changes',
	'nodeView.error.pull': 'Failed to pull changes',
	'nodeView.success.workflowSaved': 'Workflow saved',
	'nodeView.success.savedFromNDV': 'Saved from Node panel',
	'nodeView.error.importTemplate': 'Failed to import template',
	'nodeView.error.loadWorkflow': 'Failed to load workflow',
	'nodeView.toast.readOnly.title': 'Read-only environment',
	'nodeView.toast.readOnly.message': 'You cannot edit or run workflows on this branch.',
	'ndv.preview.banner': 'This is a production execution preview',
	'ndv.saveParameters': 'Save parameters',
	'ndv.openConnectionCreator': 'Open connection node creator',
	'ndv.switchSelectedNode': 'Switch selected node',
	'ndv.noNodeSelected': 'No node selected',
	'ndv.credential': 'Credential',
	'nodeView.import.confirmTitle': 'Import',
	'nodeView.import.confirmMessage': 'Import workflow from URL?\n{{url}}',
};

function interpolate(template: string, vars?: Record<string, string | number>) {
	if (!vars) return template;
	return template.replace(/\{\{(.*?)\}\}/g, (_, key) => String(vars[key.trim()] ?? ''));
}

export function useI18n() {
	const t = useCallback((key: string, vars?: Record<string, string | number>) => {
		const str = en[key] ?? key;
		return interpolate(str, vars);
	}, []);
	return { t };
}
