## src2/workflows/workflow-history.ee/workflow-history-manager.ee.ts

Overview: src2/workflows/workflow-history.ee/workflow-history-manager.ee.ts is a core component (WorkflowHistoryManager) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { Time } from '@n8n/constants';
- import { WorkflowHistoryRepository } from '@n8n/db';
- import { Service } from '@n8n/di';
- import { DateTime } from 'luxon';
- import {

### Declarations

- Classes: WorkflowHistoryManager
- Exports: WorkflowHistoryManager

### Recreate

Place this file at `src2/workflows/workflow-history.ee/workflow-history-manager.ee.ts` and use the following source:

```ts
import { Time } from '@n8n/constants';
import { WorkflowHistoryRepository } from '@n8n/db';
import { Service } from '@n8n/di';
import { DateTime } from 'luxon';

import {
	getWorkflowHistoryPruneTime,
	isWorkflowHistoryEnabled,
} from './workflow-history-helper.ee';

@Service()
export class WorkflowHistoryManager {
	pruneTimer?: NodeJS.Timeout;

	constructor(private workflowHistoryRepo: WorkflowHistoryRepository) {}

	init() {
		if (this.pruneTimer !== undefined) {
			clearInterval(this.pruneTimer);
		}

		this.pruneTimer = setInterval(async () => await this.prune(), 1 * Time.hours.toMilliseconds);
	}

	shutdown() {
		if (this.pruneTimer !== undefined) {
			clearInterval(this.pruneTimer);
			this.pruneTimer = undefined;
		}
	}

	async prune() {
		if (!isWorkflowHistoryEnabled()) {
			return;
		}

		const pruneHours = getWorkflowHistoryPruneTime();
		// No prune time set
		if (pruneHours === -1) {
			return;
		}
		const pruneDateTime = DateTime.now().minus({ hours: pruneHours }).toJSDate();

		await this.workflowHistoryRepo.deleteEarlierThan(pruneDateTime);
	}
}

```
