## src2/security-audit/utils.ts

Overview: src2/security-audit/utils.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { IWorkflowBase } from 'n8n-workflow';
- import type { Risk } from '@/security-audit/types';

### Declarations

- Functions: getNodeTypes
- Exports: toFlaggedNode, toReportTitle, getNodeTypes

### Recreate

Place this file at `src2/security-audit/utils.ts` and use the following source:

```ts
import type { IWorkflowBase } from 'n8n-workflow';

import type { Risk } from '@/security-audit/types';

type Node = IWorkflowBase['nodes'][number];

export const toFlaggedNode = ({ node, workflow }: { node: Node; workflow: IWorkflowBase }) => ({
	kind: 'node' as const,
	workflowId: workflow.id,
	workflowName: workflow.name,
	nodeId: node.id,
	nodeName: node.name,
	nodeType: node.type,
});

export const toReportTitle = (riskCategory: Risk.Category) =>
	riskCategory.charAt(0).toUpperCase() + riskCategory.slice(1) + ' Risk Report';

export function getNodeTypes(workflows: IWorkflowBase[], test: (element: Node) => boolean) {
	return workflows.reduce<Risk.NodeLocation[]>((acc, workflow) => {
		workflow.nodes.forEach((node) => {
			if (test(node)) acc.push(toFlaggedNode({ node, workflow }));
		});

		return acc;
	}, []);
}

```
