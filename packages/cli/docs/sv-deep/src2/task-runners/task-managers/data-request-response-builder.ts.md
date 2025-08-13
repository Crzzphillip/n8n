## src2/task-runners/task-managers/data-request-response-builder.ts

Overview: src2/task-runners/task-managers/data-request-response-builder.ts is a core component (DataRequestResponseBuilder) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { DataRequestResponse, PartialAdditionalData, TaskData } from '@n8n/task-runner';
- import type {

### Declarations

- Classes: DataRequestResponseBuilder
- Exports: DataRequestResponseBuilder

### Recreate

Place this file at `src2/task-runners/task-managers/data-request-response-builder.ts` and use the following source:

```ts
import type { DataRequestResponse, PartialAdditionalData, TaskData } from '@n8n/task-runner';
import type {
	IRunExecutionData,
	IWorkflowExecuteAdditionalData,
	Workflow,
	WorkflowParameters,
} from 'n8n-workflow';

/**
 * Transforms TaskData to DataRequestResponse. The main purpose of the
 * transformation is to make sure there is no duplication in the data
 * (e.g. connectionInputData and executeData.data can be derived from
 * inputData).
 */
export class DataRequestResponseBuilder {
	buildFromTaskData(taskData: TaskData): DataRequestResponse {
		return {
			workflow: this.buildWorkflow(taskData.workflow),
			inputData: taskData.inputData,
			connectionInputSource: taskData.executeData?.source ?? null,
			itemIndex: taskData.itemIndex,
			activeNodeName: taskData.activeNodeName,
			contextNodeName: taskData.contextNodeName,
			defaultReturnRunIndex: taskData.defaultReturnRunIndex,
			mode: taskData.mode,
			envProviderState: taskData.envProviderState,
			node: taskData.node,
			runExecutionData: this.buildRunExecutionData(taskData.runExecutionData),
			runIndex: taskData.runIndex,
			selfData: taskData.selfData,
			siblingParameters: taskData.siblingParameters,
			additionalData: this.buildAdditionalData(taskData.additionalData),
		};
	}

	private buildAdditionalData(
		additionalData: IWorkflowExecuteAdditionalData,
	): PartialAdditionalData {
		return {
			formWaitingBaseUrl: additionalData.formWaitingBaseUrl,
			instanceBaseUrl: additionalData.instanceBaseUrl,
			restApiUrl: additionalData.restApiUrl,
			variables: additionalData.variables,
			webhookBaseUrl: additionalData.webhookBaseUrl,
			webhookTestBaseUrl: additionalData.webhookTestBaseUrl,
			webhookWaitingBaseUrl: additionalData.webhookWaitingBaseUrl,
			currentNodeParameters: additionalData.currentNodeParameters,
			executionId: additionalData.executionId,
			executionTimeoutTimestamp: additionalData.executionTimeoutTimestamp,
			restartExecutionId: additionalData.restartExecutionId,
			userId: additionalData.userId,
		};
	}

	private buildWorkflow(workflow: Workflow): Omit<WorkflowParameters, 'nodeTypes'> {
		return {
			id: workflow.id,
			name: workflow.name,
			active: workflow.active,
			connections: workflow.connectionsBySourceNode,
			nodes: Object.values(workflow.nodes),
			pinData: workflow.pinData,
			settings: workflow.settings,
			staticData: workflow.staticData,
		};
	}

	private buildRunExecutionData(runExecutionData: IRunExecutionData) {
		return {
			startData: runExecutionData.startData,
			resultData: runExecutionData.resultData,
			executionData: runExecutionData.executionData
				? {
						contextData: runExecutionData.executionData.contextData,
						metadata: runExecutionData.executionData.metadata,

						// These are related to workflow execution and are not something
						// that are accessible by nodes, so we always omit them
						nodeExecutionStack: [],
						waitingExecution: {},
						waitingExecutionSource: null,
					}
				: undefined,
		};
	}
}

```
