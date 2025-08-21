import React, { useState } from 'react';
import { useFocusPanelStore } from '../../stores/focusPanel';

interface FocusPanelProps {
	isCanvasReadOnly?: boolean;
	onSaveKeyboardShortcut?: () => void;
}

export default function FocusPanel({
	isCanvasReadOnly = false,
	onSaveKeyboardShortcut,
}: FocusPanelProps) {
	const focusPanelStore = useFocusPanelStore();
	const [input, setInput] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;

		focusPanelStore.getState().setIsLoading(true);
		
		try {
			// In a real implementation, this would call an AI service
			// For now, we'll just simulate a response
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			const response = `AI response to: "${input}"`;
			focusPanelStore.getState().setContent(response);
			focusPanelStore.getState().setIsOpen(true);
		} catch (error) {
			console.error('Failed to get AI response:', error);
		} finally {
			focusPanelStore.getState().setIsLoading(false);
		}
	};

	const handleClose = () => {
		focusPanelStore.getState().setIsOpen(false);
		setInput('');
	};

	if (!focusPanelStore.getState().isOpen) {
		return null;
	}

	return (
		<div className="focus-panel">
			<div className="focus-panel-header">
				<h3>AI Focus Panel</h3>
				<button onClick={handleClose} className="close-btn">
					×
				</button>
			</div>
			
			<div className="focus-panel-content">
				{!focusPanelStore.getState().content ? (
					<form onSubmit={handleSubmit}>
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Ask AI to help with your workflow..."
							disabled={isCanvasReadOnly || focusPanelStore.getState().isLoading}
							className="focus-input"
						/>
						<button
							type="submit"
							disabled={!input.trim() || isCanvasReadOnly || focusPanelStore.getState().isLoading}
							className="focus-submit-btn"
						>
							{focusPanelStore.getState().isLoading ? 'Thinking...' : 'Ask AI'}
						</button>
					</form>
				) : (
					<div className="focus-response">
						<p>{focusPanelStore.getState().content}</p>
						<button onClick={() => setInput('')} className="new-question-btn">
							Ask Another Question
						</button>
					</div>
				)}
			</div>
		</div>
	);
}