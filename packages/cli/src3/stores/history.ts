import { create } from 'zustand';
import type { Command, BulkCommand } from '../models/history';
import type { HistoryState } from '../types/Interface';

const STACK_LIMIT = 100;

interface HistoryStore extends HistoryState {
	popUndoableToUndo: () => (Command | BulkCommand) | undefined;
	pushCommandToUndo: (undoable: Command, clearRedo?: boolean) => void;
	pushBulkCommandToUndo: (undoable: BulkCommand, clearRedo?: boolean) => void;
	checkUndoStackLimit: () => void;
	checkRedoStackLimit: () => void;
	clearUndoStack: () => void;
	clearRedoStack: () => void;
	reset: () => void;
	popUndoableToRedo: () => (Command | BulkCommand) | undefined;
	pushUndoableToRedo: (undoable: Command | BulkCommand) => void;
	startRecordingUndo: () => void;
	stopRecordingUndo: () => void;
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
	undoStack: [],
	redoStack: [],
	currentBulkAction: null,
	bulkInProgress: false,

	popUndoableToUndo: () => {
		const { undoStack } = get();
		if (undoStack.length > 0) {
			const popped = undoStack[undoStack.length - 1];
			set({ undoStack: undoStack.slice(0, -1) });
			return popped;
		}
		return undefined;
	},

	pushCommandToUndo: (undoable: Command, clearRedo = true) => {
		const { currentBulkAction, bulkInProgress } = get();
		
		if (!bulkInProgress) {
			if (currentBulkAction) {
				const alreadyIn = currentBulkAction.commands.find((c) => c.isEqualTo(undoable)) !== undefined;
				if (!alreadyIn) {
					currentBulkAction.commands.push(undoable);
				}
			} else {
				set((state) => ({
					undoStack: [...state.undoStack, undoable],
				}));
			}
			get().checkUndoStackLimit();
			if (clearRedo) {
				get().clearRedoStack();
			}
		}
	},

	pushBulkCommandToUndo: (undoable: BulkCommand, clearRedo = true) => {
		set((state) => ({
			undoStack: [...state.undoStack, undoable],
		}));
		get().checkUndoStackLimit();
		if (clearRedo) {
			get().clearRedoStack();
		}
	},

	checkUndoStackLimit: () => {
		const { undoStack } = get();
		if (undoStack.length > STACK_LIMIT) {
			set({ undoStack: undoStack.slice(1) });
		}
	},

	checkRedoStackLimit: () => {
		const { redoStack } = get();
		if (redoStack.length > STACK_LIMIT) {
			set({ redoStack: redoStack.slice(1) });
		}
	},

	clearUndoStack: () => {
		set({ undoStack: [] });
	},

	clearRedoStack: () => {
		set({ redoStack: [] });
	},

	reset: () => {
		set({ undoStack: [], redoStack: [] });
	},

	popUndoableToRedo: () => {
		const { redoStack } = get();
		if (redoStack.length > 0) {
			const popped = redoStack[redoStack.length - 1];
			set({ redoStack: redoStack.slice(0, -1) });
			return popped;
		}
		return undefined;
	},

	pushUndoableToRedo: (undoable: Command | BulkCommand) => {
		set((state) => ({
			redoStack: [...state.redoStack, undoable],
		}));
		get().checkRedoStackLimit();
	},

	startRecordingUndo: () => {
		set({ currentBulkAction: new BulkCommand([]) });
	},

	stopRecordingUndo: () => {
		const { currentBulkAction } = get();
		if (currentBulkAction && currentBulkAction.commands.length > 0) {
			set((state) => ({
				undoStack: [...state.undoStack, currentBulkAction],
			}));
			get().checkUndoStackLimit();
		}
		set({ currentBulkAction: null });
	},
}));