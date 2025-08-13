import { useMemo } from 'react';
import { useSourceControlStore } from '../stores/sourceControl';
import { useProjectsStore } from '../stores/projects';
import { useWorkflowStore } from '../stores/workflows';

export function usePermissions() {
	const sourceControlStore = useSourceControlStore();
	const projectsStore = useProjectsStore();
	const workflowStore = useWorkflowStore();

	const isCanvasReadOnly = useMemo(() => {
		const branchReadOnly = sourceControlStore.getState().preferences.branchReadOnly;
		if (branchReadOnly) return true;
		const wf: any = workflowStore.getState().current;
		const project: any = projectsStore.getState().currentProject;
		const workflowScopes = wf?.scopes?.workflow;
		const projectScopes = project?.scopes?.workflow;
		const canUpdate = workflowScopes?.update ?? projectScopes?.update;
		if (canUpdate === false) return true;
		if (wf?.isArchived) return true;
		return false;
	}, [sourceControlStore, projectsStore, workflowStore]);

	return { isCanvasReadOnly };
}
