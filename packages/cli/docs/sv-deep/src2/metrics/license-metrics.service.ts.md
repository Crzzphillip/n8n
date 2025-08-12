## src2/metrics/license-metrics.service.ts

Overview: src2/metrics/license-metrics.service.ts is a core component (LicenseMetricsService) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { LicenseMetricsRepository, WorkflowRepository } from '@n8n/db';
- import { Service } from '@n8n/di';

### Declarations

- Classes: LicenseMetricsService
- Exports: LicenseMetricsService

### Recreate

Place this file at `src2/metrics/license-metrics.service.ts` and use the following source:

```ts
import { LicenseMetricsRepository, WorkflowRepository } from '@n8n/db';
import { Service } from '@n8n/di';

@Service()
export class LicenseMetricsService {
	constructor(
		private readonly licenseMetricsRepository: LicenseMetricsRepository,
		private readonly workflowRepository: WorkflowRepository,
	) {}

	async collectUsageMetrics() {
		const {
			activeWorkflows,
			totalWorkflows,
			enabledUsers,
			totalUsers,
			totalCredentials,
			productionExecutions,
			productionRootExecutions,
			manualExecutions,
		} = await this.licenseMetricsRepository.getLicenseRenewalMetrics();

		const [activeTriggerCount, workflowsWithEvaluationsCount] = await Promise.all([
			this.workflowRepository.getActiveTriggerCount(),
			this.workflowRepository.getWorkflowsWithEvaluationCount(),
		]);

		return [
			{ name: 'activeWorkflows', value: activeWorkflows },
			{ name: 'totalWorkflows', value: totalWorkflows },
			{ name: 'enabledUsers', value: enabledUsers },
			{ name: 'totalUsers', value: totalUsers },
			{ name: 'totalCredentials', value: totalCredentials },
			{ name: 'productionExecutions', value: productionExecutions },
			{ name: 'productionRootExecutions', value: productionRootExecutions },
			{ name: 'manualExecutions', value: manualExecutions },
			{ name: 'activeWorkflowTriggers', value: activeTriggerCount },
			{ name: 'evaluations', value: workflowsWithEvaluationsCount },
		];
	}

	async collectPassthroughData() {
		return {
			// Get only the first 1000 active workflow IDs to avoid sending too much data to License Server
			// Passthrough data is forwarded to Telemetry for further analysis, such as quota excesses
			activeWorkflowIds: await this.workflowRepository.getActiveIds({ maxResults: 1000 }),
		};
	}
}

```
