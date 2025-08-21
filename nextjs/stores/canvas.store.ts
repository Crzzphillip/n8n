import { useWorkflowsStore } from '@/stores/workflows.store';
import type { INodeUi, XYPosition } from '@/Interface';
import { useLoadingService } from '@/composables/useLoadingService';

type Ref<T> = { value: T };
const ref = <T>(initial: T): Ref<T> => ({ value: initial });
function computed<T>(getter: () => T): { readonly value: T } {
	return {
		get value() {
			return getter();
		},
	} as const;
}

type CanvasStore = ReturnType<typeof createCanvasStore>;
let singleton: CanvasStore | undefined;

function createCanvasStore() {
	const workflowStore = useWorkflowsStore();
	const loadingService = useLoadingService();

	const newNodeInsertPosition = ref<XYPosition | null>(null);
	const nodes = computed<INodeUi[]>(() => workflowStore.allNodes);
	const aiNodes = computed<INodeUi[]>(() =>
		nodes.value.filter(
			(node) =>
				node.type.includes('langchain') ||
				(node.type === 'n8n-nodes-base.evaluation' && node.parameters?.operation === 'setMetrics'),
		),
	);
	const hasRangeSelection = ref(false);

	function setHasRangeSelection(value: boolean) {
		hasRangeSelection.value = value;
	}

	return {
		newNodeInsertPosition,
		isLoading: loadingService.isLoading,
		aiNodes,
		hasRangeSelection: computed(() => hasRangeSelection.value),
		startLoading: loadingService.startLoading,
		setLoadingText: loadingService.setLoadingText,
		stopLoading: loadingService.stopLoading,
		setHasRangeSelection,
	};
}

export const useCanvasStore = () => {
	if (!singleton) singleton = createCanvasStore();
	return singleton;
};
