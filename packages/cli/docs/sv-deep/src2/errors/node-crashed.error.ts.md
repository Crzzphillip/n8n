## src2/errors/node-crashed.error.ts

Overview: src2/errors/node-crashed.error.ts is a core component (NodeCrashedError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { INode } from 'n8n-workflow';
- import { NodeOperationError } from 'n8n-workflow';

### Declarations

- Classes: NodeCrashedError
- Exports: NodeCrashedError

### Recreate

Place this file at `src2/errors/node-crashed.error.ts` and use the following source:

```ts
import type { INode } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class NodeCrashedError extends NodeOperationError {
	constructor(node: INode) {
		super(node, 'Node crashed, possible out-of-memory issue', {
			message: 'Execution stopped at this node',
			description:
				"sv may have run out of memory while running this execution. More context and tips on how to avoid this <a href='https://docs.n8n.io/hosting/scaling/memory-errors/' target='_blank'>in the docs</a>",
		});
	}
}

```
