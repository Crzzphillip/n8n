// Next.js/React replacement: UI libraries should be composed at component level.
// Provide optional registration hooks for any global setup needed by components.

export function registerGlobalComponents(): void {
	// Intentionally empty: in React, components are imported and used locally.
}

export type MessageService = {
	alert: (message: string) => void;
	confirm: (message: string) => Promise<boolean>;
	prompt: (message: string, defaultValue?: string) => Promise<string | null>;
	message: (message: string) => void;
};

export function createMessageService(): MessageService {
	return {
		alert: (message: string) => {
			if (typeof window !== 'undefined') window.alert(message);
		},
		confirm: async (message: string) => {
			if (typeof window !== 'undefined') return window.confirm(message);
			return false;
		},
		prompt: async (message: string, defaultValue?: string) => {
			if (typeof window !== 'undefined') return window.prompt(message, defaultValue ?? '') ?? null;
			return null;
		},
		message: (message: string) => {
			// Placeholder for toast integration
			// eslint-disable-next-line no-console
			console.log(message);
		},
	};
}
