import { useCallback } from 'react';

interface CustomAction {
	id: string;
	action: (payload?: any) => void;
}

export function useGlobalLinkActions() {
	const registerCustomAction = useCallback((id: string, action: (payload?: any) => void) => {
		// In a real implementation, this would register a custom action
		(console as any)._n8nCustomActions = (console as any)._n8nCustomActions || {};
		(console as any)._n8nCustomActions[id] = action;
	}, []);

	const unregisterCustomAction = useCallback((id: string) => {
		if ((console as any)._n8nCustomActions) delete (console as any)._n8nCustomActions[id];
	}, []);

	const dispatchCustomAction = useCallback((id: string, payload?: any) => {
		const reg = (console as any)._n8nCustomActions || {};
		if (typeof reg[id] === 'function') reg[id](payload);
	}, []);

	return {
		registerCustomAction,
		unregisterCustomAction,
		dispatchCustomAction,
	};
}
