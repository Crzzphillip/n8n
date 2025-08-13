import { useCallback } from 'react';

interface CustomAction {
	id: string;
	action: () => void;
}

export function useGlobalLinkActions() {
	const registerCustomAction = useCallback((id: string, action: () => void) => {
		// In a real implementation, this would register a custom action
		console.log('Registering custom action:', id);
		
		// Example implementation:
		// if (window.n8nCustomActions) {
		//   window.n8nCustomActions[id] = action;
		// }
	}, []);

	const unregisterCustomAction = useCallback((id: string) => {
		// In a real implementation, this would unregister a custom action
		console.log('Unregistering custom action:', id);
		
		// Example implementation:
		// if (window.n8nCustomActions) {
		//   delete window.n8nCustomActions[id];
		// }
	}, []);

	return {
		registerCustomAction,
		unregisterCustomAction,
	};
}