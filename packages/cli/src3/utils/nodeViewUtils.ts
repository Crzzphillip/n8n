import type { Workflow, WorkflowNode } from '../stores/workflows';

export const MAIN_HEADER_TABS = {
	WORKFLOW: 'workflow',
	EXECUTIONS: 'executions',
	CREDENTIALS: 'credentials',
} as const;

export function getNodeViewTab(searchParams: URLSearchParams): string | null {
	const tab = searchParams.get('tab');
	if (!tab) return MAIN_HEADER_TABS.WORKFLOW;
	if (Object.values(MAIN_HEADER_TABS).includes(tab as any)) return tab;
	return MAIN_HEADER_TABS.WORKFLOW;
}

export function getNewNodePosition(nodes: WorkflowNode[], pos?: { x: number; y: number }) {
	const base = pos || { x: 100, y: 100 };
	// naive avoid overlap by offsetting by 40px per existing node
	const offset = nodes.length * 40;
	return { x: base.x + (offset % 200), y: base.y + (offset % 160) };
}

export function getNodesWithNormalizedPosition(nodes: WorkflowNode[]) {
	return nodes.map((n) => ({ ...n, position: n.position || { x: 100, y: 100 } }));
}

export function getBounds(
	viewport: { x: number; y: number; zoom: number },
	dimensions: { width: number; height: number },
) {
	return {
		minX: viewport.x,
		maxX: viewport.x + dimensions.width,
		minY: viewport.y,
		maxY: viewport.y + dimensions.height,
	};
}
