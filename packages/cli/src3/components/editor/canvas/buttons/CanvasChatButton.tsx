import React from 'react';

interface CanvasChatButtonProps {
	type?: 'primary' | 'secondary' | 'tertiary';
	label: string;
	className?: string;
	onClick?: () => void;
}

export default function CanvasChatButton({
	type = 'primary',
	label,
	className = '',
	onClick,
}: CanvasChatButtonProps) {
	const handleClick = () => {
		if (onClick) {
			onClick();
		} else {
			// Default chat functionality
			console.log('Opening chat...');
		}
	};

	const buttonClass = `canvas-chat-btn ${type} ${className}`.trim();

	return (
		<button
			onClick={handleClick}
			className={buttonClass}
		>
			{label}
		</button>
	);
}