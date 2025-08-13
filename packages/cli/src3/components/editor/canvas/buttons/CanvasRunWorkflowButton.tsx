import React from 'react';
import { useRunWorkflow } from '../../../hooks/useRunWorkflow';
import { useWorkflowStore } from '../../../stores/workflows';
import { useExecutionsStore } from '../../../stores/executions';

interface CanvasRunWorkflowButtonProps {
	waitingForWebhook?: boolean;
	disabled?: boolean;
	executing?: boolean;
	triggerNodes?: any[];
	getNodeType?: (type: string) => any;
	selectedTriggerNodeName?: string;
	onExecute?: () => void;
	onSelectTriggerNode?: (name: string) => void;
}

export default function CanvasRunWorkflowButton({
	waitingForWebhook = false,
	disabled = false,
	executing = false,
	triggerNodes = [],
	getNodeType,
	selectedTriggerNodeName,
	onExecute,
	onSelectTriggerNode,
}: CanvasRunWorkflowButtonProps) {
	const { runEntireWorkflow } = useRunWorkflow();
	const workflowStore = useWorkflowStore();
	const executionsStore = useExecutionsStore();

	const handleExecute = async () => {
		if (onExecute) {
			onExecute();
		} else {
			try {
				await runEntireWorkflow('main');
			} catch (error) {
				console.error('Failed to run workflow:', error);
			}
		}
	};

	const handleSelectTriggerNode = (nodeName: string) => {
		if (onSelectTriggerNode) {
			onSelectTriggerNode(nodeName);
		}
	};

	const buttonText = waitingForWebhook 
		? 'Waiting for webhook...' 
		: executing 
		? 'Running...' 
		: 'Run Workflow';

	return (
		<div className="canvas-run-workflow-button">
			{triggerNodes.length > 1 && (
				<select
					value={selectedTriggerNodeName || ''}
					onChange={(e) => handleSelectTriggerNode(e.target.value)}
					disabled={disabled || executing}
					className="trigger-node-selector"
				>
					<option value="">Select trigger node</option>
					{triggerNodes.map((node) => (
						<option key={node.id} value={node.name}>
							{node.name}
						</option>
					))}
				</select>
			)}
			
			<button
				onClick={handleExecute}
				disabled={disabled || executing}
				className={`run-workflow-btn ${executing ? 'executing' : ''} ${waitingForWebhook ? 'waiting' : ''}`}
			>
				{buttonText}
			</button>
		</div>
	);
}