import React from 'react';
import { useRunWorkflow } from '../../../hooks/useRunWorkflow';

interface CanvasStopWaitingForWebhookButtonProps {
	onClick?: () => void;
}

export default function CanvasStopWaitingForWebhookButton({
	onClick,
}: CanvasStopWaitingForWebhookButtonProps) {
	const { stopWaitingForWebhook } = useRunWorkflow();

	const handleStop = async () => {
		if (onClick) {
			onClick();
		} else {
			try {
				await stopWaitingForWebhook();
			} catch (error) {
				console.error('Failed to stop waiting for webhook:', error);
			}
		}
	};

	return (
		<button
			onClick={handleStop}
			className="stop-webhook-btn"
		>
			Stop Waiting for Webhook
		</button>
	);
}