import { create } from 'zustand';

export type HistoryAction = {
  id: string;
  type: 'node_add' | 'node_delete' | 'node_move' | 'node_rename' | 'connection_add' | 'connection_delete' | 'workflow_update';
  timestamp: number;
  data: any;
  description: string;
};

type State = {
  actions: HistoryAction[];
  currentIndex: number;
  maxHistory: number;
  canUndo: boolean;
  canRedo: boolean;
  addAction: (action: Omit<HistoryAction, 'id' | 'timestamp'>) => void;
  undo: () => HistoryAction | null;
  redo: () => HistoryAction | null;
  clear: () => void;
  reset: () => void;
};

export const useHistoryStore = create<State>((set, get) => ({
  actions: [],
  currentIndex: -1,
  maxHistory: 50,
  canUndo: false,
  canRedo: false,

  addAction(action) {
    const { actions, currentIndex, maxHistory } = get();
    const newAction: HistoryAction = {
      ...action,
      id: Math.random().toString(36).slice(2),
      timestamp: Date.now(),
    };

    // Remove any actions after current index (when we add a new action after undoing)
    const trimmedActions = actions.slice(0, currentIndex + 1);
    
    // Add new action
    const newActions = [...trimmedActions, newAction];
    
    // Limit history size
    if (newActions.length > maxHistory) {
      newActions.shift();
    }

    const newIndex = newActions.length - 1;
    
    set({
      actions: newActions,
      currentIndex: newIndex,
      canUndo: newIndex > 0,
      canRedo: false,
    });
  },

  undo() {
    const { actions, currentIndex } = get();
    if (currentIndex <= 0) return null;

    const newIndex = currentIndex - 1;
    const action = actions[currentIndex];

    set({
      currentIndex: newIndex,
      canUndo: newIndex > 0,
      canRedo: true,
    });

    return action;
  },

  redo() {
    const { actions, currentIndex } = get();
    if (currentIndex >= actions.length - 1) return null;

    const newIndex = currentIndex + 1;
    const action = actions[newIndex];

    set({
      currentIndex: newIndex,
      canUndo: true,
      canRedo: newIndex < actions.length - 1,
    });

    return action;
  },

  clear() {
    set({
      actions: [],
      currentIndex: -1,
      canUndo: false,
      canRedo: false,
    });
  },

  reset() {
    const { actions } = get();
    const newIndex = actions.length - 1;
    
    set({
      currentIndex: newIndex,
      canUndo: newIndex > 0,
      canRedo: false,
    });
  },
}));