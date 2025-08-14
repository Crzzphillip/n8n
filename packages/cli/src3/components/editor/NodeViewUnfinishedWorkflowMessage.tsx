import React from 'react';

export default function NodeViewUnfinishedWorkflowMessage() {
	return (
		<div className="node-view-unfinished-workflow-message">
			<p>
				This execution hasn't finished yet. It's waiting for a webhook or manual trigger to continue.
			</p>
			<p>
				You can view the current state and data, but the workflow will continue running until it completes.
			</p>
		</div>
	);
}