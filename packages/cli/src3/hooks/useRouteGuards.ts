import { useCallback } from 'react';
import { useWorkflowSaving } from './useWorkflowSaving';

/**
 * Wrap Next.js router navigation calls with an unsaved-changes guard.
 * Since Next Router lacks before-leave hooks in app router, we expose helpers
 * to be used where navigation is initiated (push/replace/back).
 */
export function useRouteGuards(router: {
	push: (url: string) => any;
	replace: (url: string) => any;
	back: () => any;
}) {
	const { promptSaveUnsavedWorkflowChanges } = useWorkflowSaving({ router });

	const guardedNavigate = useCallback(
		async (navigate: () => void) => {
			await promptSaveUnsavedWorkflowChanges(
				() => {
					navigate();
				},
				{
					confirm: async () => true,
				},
			);
		},
		[promptSaveUnsavedWorkflowChanges],
	);

	const guardedPush = useCallback(
		async (url: string) => {
			await guardedNavigate(() => router.push(url));
		},
		[guardedNavigate, router],
	);

	const guardedReplace = useCallback(
		async (url: string) => {
			await guardedNavigate(() => router.replace(url));
		},
		[guardedNavigate, router],
	);

	const guardedBack = useCallback(async () => {
		await guardedNavigate(() => router.back());
	}, [guardedNavigate, router]);

	const guardedNavigateIfDirty = useCallback(
		async (fn: () => void | Promise<void>) => {
			await promptSaveUnsavedWorkflowChanges(
				() => {
					void fn();
				},
				{ confirm: async () => true },
			);
		},
		[promptSaveUnsavedWorkflowChanges],
	);

	return {
		guardedPush,
		guardedReplace,
		guardedBack,
		guardedNavigateIfDirty,
	};
}
