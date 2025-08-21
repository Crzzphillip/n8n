import React from 'react';

interface KeyboardShortcut {
	keys: string[];
}

interface KeyboardShortcutTooltipProps {
	label: string;
	shortcut: KeyboardShortcut;
	children: React.ReactNode;
}

export default function KeyboardShortcutTooltip({
	label,
	shortcut,
	children,
}: KeyboardShortcutTooltipProps) {
	const formatShortcut = (keys: string[]) => {
		return keys.map(key => {
			if (key === 'Ctrl' || key === 'Cmd') {
				return navigator.platform.includes('Mac') ? '⌘' : 'Ctrl';
			}
			if (key === 'Shift') return '⇧';
			if (key === 'Alt') return '⌥';
			return key.toUpperCase();
		}).join(' + ');
	};

	return (
		<div className="keyboard-shortcut-tooltip">
			{children}
			<div className="tooltip-content">
				<span className="tooltip-label">{label}</span>
				<span className="tooltip-shortcut">{formatShortcut(shortcut.keys)}</span>
			</div>
		</div>
	);
}