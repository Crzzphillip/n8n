import { useMemo } from 'react';
import { useSourceControlStore } from '../stores/sourceControl';
import { useProjectsStore } from '../stores/projects';
import { useWorkflowStore } from '../stores/workflows';

export function usePermissions() {
	const sourceControlStore = useSourceControlStore();
	const projectsStore = useProjectsStore();
	const workflowStore = useWorkflowStore();

	const permissions = useMemo(() => {
		const branchReadOnly = sourceControlStore.getState().preferences.branchReadOnly;
		const wf: any = workflowStore.getState().current;
		const project: any = projectsStore.getState().currentProject;

		let workflowPermissions: any = wf?.scopes?.workflow ?? {};
		let projectPermissions: any = project?.scopes ?? {};
		try {
			// Attempt to use @n8n/permissions if available
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const perm = require('@n8n/permissions');
			if (perm?.getResourcePermissions) {
				workflowPermissions = perm.getResourcePermissions(wf?.scopes).workflow;
				projectPermissions = perm.getResourcePermissions(project?.scopes);
			}
		} catch {}

		const canUpdateWorkflow = workflowPermissions?.update ?? projectPermissions?.workflow?.update;
		const isCanvasReadOnly = Boolean(
			branchReadOnly || wf?.isArchived || canUpdateWorkflow === false,
		);

		return {
			isCanvasReadOnly,
			workflowPermissions,
			projectPermissions,
		};
	}, [sourceControlStore, projectsStore, workflowStore]);

	return permissions as {
		isCanvasReadOnly: boolean;
		workflowPermissions: any;
		projectPermissions: any;
	};
}
