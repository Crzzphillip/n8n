import React from 'react';
import { useRunWorkflow } from '../../../hooks/useRunWorkflow';
import { useExecutionsStore } from '../../../stores/executions';

interface CanvasStopCurrentExecutionButtonProps {
	stopping?: boolean;
	onClick?: () => void;
}

export default function CanvasStopCurrentExecutionButton({
	stopping = false,
	onClick,
}: CanvasStopCurrentExecutionButtonProps) {
	const { stopCurrentExecution } = useRunWorkflow();
	const executionsStore = useExecutionsStore();

	const handleStop = async () => {
		if (onClick) {
			onClick();
		} else {
			try {
				const activeExecution = executionsStore.getState().activeExecution;
				if (activeExecution) {
					await stopCurrentExecution(activeExecution.id);
				}
			} catch (error) {
				console.error('Failed to stop execution:', error);
			}
		}
	};

	return (
		<button
			onClick={handleStop}
			disabled={stopping}
			className={`stop-execution-btn ${stopping ? 'stopping' : ''}`}
		>
			{stopping ? 'Stopping...' : 'Stop Execution'}
		</button>
	);
}