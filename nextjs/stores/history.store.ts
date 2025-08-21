import type { Command, Undoable } from '@/models/history';
import { BulkCommand } from '@/models/history';
import { STORES } from '@n8n/stores';
import type { HistoryState } from '@/Interface';

const STACK_LIMIT = 100;

type Ref<T> = { value: T };
const ref = <T>(initial: T): Ref<T> => ({ value: initial });

type HistoryStore = ReturnType<typeof createHistoryStore>;
let singleton: HistoryStore | undefined;

function createHistoryStore() {
	const state = ref<HistoryState>({
		undoStack: [],
		redoStack: [],
		currentBulkAction: null,
		bulkInProgress: false,
	});

	function popUndoableToUndo(): Undoable | undefined {
		if (state.value.undoStack.length > 0) {
			return state.value.undoStack.pop();
		}
		return undefined;
	}

	function pushCommandToUndo(undoable: Command, clearRedo = true): void {
		if (!state.value.bulkInProgress) {
			if (state.value.currentBulkAction) {
				const alreadyIn = state.value.currentBulkAction.commands.find((c: Command) => c.isEqualTo(undoable)) !== undefined;
				if (!alreadyIn) {
					state.value.currentBulkAction.commands.push(undoable);
				}
			} else {
				state.value.undoStack.push(undoable);
			}
			checkUndoStackLimit();
			if (clearRedo) {
				clearRedoStack();
			}
		}
	}

	function pushBulkCommandToUndo(undoable: BulkCommand, clearRedo = true): void {
		state.value.undoStack.push(undoable);
		checkUndoStackLimit();
		if (clearRedo) {
			clearRedoStack();
		}
	}

	function checkUndoStackLimit() {
		if (state.value.undoStack.length > STACK_LIMIT) {
			state.value.undoStack.shift();
		}
	}

	function checkRedoStackLimit() {
		if (state.value.redoStack.length > STACK_LIMIT) {
			state.value.redoStack.shift();
		}
	}

	function clearUndoStack() {
		state.value.undoStack = [];
	}

	function clearRedoStack() {
		state.value.redoStack = [];
	}

	function reset() {
		clearRedoStack();
		clearUndoStack();
	}

	function popUndoableToRedo(): Undoable | undefined {
		if (state.value.redoStack.length > 0) {
			return state.value.redoStack.pop();
		}
		return undefined;
	}

	function pushUndoableToRedo(undoable: Undoable): void {
		state.value.redoStack.push(undoable);
		checkRedoStackLimit();
	}

	function startRecordingUndo() {
		state.value.currentBulkAction = new BulkCommand([]);
	}

	function stopRecordingUndo() {
		if (state.value.currentBulkAction && state.value.currentBulkAction.commands.length > 0) {
			state.value.undoStack.push(state.value.currentBulkAction);
			checkUndoStackLimit();
		}
		state.value.currentBulkAction = null;
	}

	return {
		state,
		popUndoableToUndo,
		pushCommandToUndo,
		pushBulkCommandToUndo,
		checkUndoStackLimit,
		checkRedoStackLimit,
		clearUndoStack,
		clearRedoStack,
		reset,
		popUndoableToRedo,
		pushUndoableToRedo,
		startRecordingUndo,
		stopRecordingUndo,
	};
}

export const useHistoryStore = () => {
	if (!singleton) singleton = createHistoryStore();
	return singleton;
};
