## src2/execution-lifecycle/to-save-settings.ts

Overview: src2/execution-lifecycle/to-save-settings.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { IWorkflowSettings } from 'n8n-workflow';
- import config from '@/config';

### Declarations

- Functions: toSaveSettings
- Exports: ExecutionSaveSettings, toSaveSettings

### Recreate

Place this file at `src2/execution-lifecycle/to-save-settings.ts` and use the following source:

```ts
import type { IWorkflowSettings } from 'n8n-workflow';

import config from '@/config';

export type ExecutionSaveSettings = {
	error: boolean | 'all' | 'none';
	success: boolean | 'all' | 'none';
	manual: boolean;
	progress: boolean;
};

/**
 * Return whether a workflow execution is configured to be saved or not:
 *
 * - `error`: Whether to save failed executions in production.
 * - `success`: Whether to successful executions in production.
 * - `manual`: Whether to save successful or failed manual executions.
 * - `progress`: Whether to save execution progress, i.e. after each node's execution.
 */
export function toSaveSettings(workflowSettings: IWorkflowSettings = {}): ExecutionSaveSettings {
	const DEFAULTS = {
		ERROR: config.getEnv('executions.saveDataOnError'),
		SUCCESS: config.getEnv('executions.saveDataOnSuccess'),
		MANUAL: config.getEnv('executions.saveDataManualExecutions'),
		PROGRESS: config.getEnv('executions.saveExecutionProgress'),
	};

	const {
		saveDataErrorExecution = DEFAULTS.ERROR,
		saveDataSuccessExecution = DEFAULTS.SUCCESS,
		saveManualExecutions = DEFAULTS.MANUAL,
		saveExecutionProgress = DEFAULTS.PROGRESS,
	} = workflowSettings;

	return {
		error: saveDataErrorExecution === 'DEFAULT' ? DEFAULTS.ERROR : saveDataErrorExecution === 'all',
		success:
			saveDataSuccessExecution === 'DEFAULT'
				? DEFAULTS.SUCCESS
				: saveDataSuccessExecution === 'all',
		manual: saveManualExecutions === 'DEFAULT' ? DEFAULTS.MANUAL : saveManualExecutions,
		progress: saveExecutionProgress === 'DEFAULT' ? DEFAULTS.PROGRESS : saveExecutionProgress,
	};
}

```
