import { create } from 'zustand';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogEntry = {
  id: string;
  timestamp: number;
  level: LogLevel;
  message: string;
  nodeId?: string;
  nodeName?: string;
  executionId?: string;
  data?: any;
  source: 'workflow' | 'node' | 'execution' | 'system';
};

export type LogsState = {
  isOpen: boolean;
  isInputOpen: boolean;
  isOutputOpen: boolean;
  logs: LogEntry[];
  maxLogs: number;
  filterLevel: LogLevel | 'all';
  filterNodeId: string | null;
  filterExecutionId: string | null;
  searchTerm: string;
  autoScroll: boolean;
  showTimestamp: boolean;
  showNodeInfo: boolean;
};

type State = LogsState & {
  toggleOpen: (open?: boolean) => void;
  toggleInputOpen: (open?: boolean) => void;
  toggleOutputOpen: (open?: boolean) => void;
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  setFilterLevel: (level: LogLevel | 'all') => void;
  setFilterNodeId: (nodeId: string | null) => void;
  setFilterExecutionId: (executionId: string | null) => void;
  setSearchTerm: (term: string) => void;
  setAutoScroll: (autoScroll: boolean) => void;
  setShowTimestamp: (show: boolean) => void;
  setShowNodeInfo: (show: boolean) => void;
  getFilteredLogs: () => LogEntry[];
  reset: () => void;
};

const initialState: LogsState = {
  isOpen: false,
  isInputOpen: false,
  isOutputOpen: false,
  logs: [],
  maxLogs: 1000,
  filterLevel: 'all',
  filterNodeId: null,
  filterExecutionId: null,
  searchTerm: '',
  autoScroll: true,
  showTimestamp: true,
  showNodeInfo: true,
};

export const useLogsStore = create<State>((set, get) => ({
  ...initialState,

  toggleOpen(open) {
    set((state) => ({ isOpen: open !== undefined ? open : !state.isOpen }));
  },

  toggleInputOpen(open) {
    set((state) => ({ isInputOpen: open !== undefined ? open : !state.isInputOpen }));
  },

  toggleOutputOpen(open) {
    set((state) => ({ isOutputOpen: open !== undefined ? open : !state.isOutputOpen }));
  },

  addLog(entry) {
    set((state) => {
      const newLog: LogEntry = {
        ...entry,
        id: Math.random().toString(36).slice(2),
        timestamp: Date.now(),
      };

      const newLogs = [...state.logs, newLog];
      
      // Limit the number of logs
      if (newLogs.length > state.maxLogs) {
        newLogs.splice(0, newLogs.length - state.maxLogs);
      }

      return { logs: newLogs };
    });
  },

  clearLogs() {
    set({ logs: [] });
  },

  setFilterLevel(level) {
    set({ filterLevel: level });
  },

  setFilterNodeId(nodeId) {
    set({ filterNodeId: nodeId });
  },

  setFilterExecutionId(executionId) {
    set({ filterExecutionId: executionId });
  },

  setSearchTerm(term) {
    set({ searchTerm: term });
  },

  setAutoScroll(autoScroll) {
    set({ autoScroll });
  },

  setShowTimestamp(show) {
    set({ showTimestamp: show });
  },

  setShowNodeInfo(show) {
    set({ showNodeInfo: show });
  },

  getFilteredLogs() {
    const { logs, filterLevel, filterNodeId, filterExecutionId, searchTerm } = get();
    
    return logs.filter((log) => {
      // Filter by level
      if (filterLevel !== 'all' && log.level !== filterLevel) {
        return false;
      }

      // Filter by node ID
      if (filterNodeId && log.nodeId !== filterNodeId) {
        return false;
      }

      // Filter by execution ID
      if (filterExecutionId && log.executionId !== filterExecutionId) {
        return false;
      }

      // Filter by search term
      if (searchTerm && !log.message.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      return true;
    });
  },

  reset() {
    set(initialState);
  },
}));