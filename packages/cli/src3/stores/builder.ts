import { create } from 'zustand';

export type BuilderState = {
  isAIBuilderEnabled: boolean;
  isAssistantEnabled: boolean;
  isGenerating: boolean;
  currentPrompt: string;
  generatedWorkflow: any | null;
  generationHistory: GenerationHistory[];
  maxHistorySize: number;
  error: string | null;
  settings: {
    model: string;
    temperature: number;
    maxTokens: number;
    includeExamples: boolean;
    includeDocumentation: boolean;
  };
};

export type GenerationHistory = {
  id: string;
  prompt: string;
  workflow: any;
  timestamp: number;
  status: 'success' | 'failed' | 'cancelled';
  error?: string;
  metadata?: Record<string, any>;
};

type State = BuilderState & {
  setAIBuilderEnabled: (enabled: boolean) => void;
  setAssistantEnabled: (enabled: boolean) => void;
  setGenerating: (generating: boolean) => void;
  setCurrentPrompt: (prompt: string) => void;
  setGeneratedWorkflow: (workflow: any | null) => void;
  setError: (error: string | null) => void;
  updateSettings: (settings: Partial<BuilderState['settings']>) => void;
  generateWorkflow: (prompt: string) => Promise<void>;
  cancelGeneration: () => void;
  saveToHistory: (history: Omit<GenerationHistory, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  getHistoryByPrompt: (prompt: string) => GenerationHistory[];
  reset: () => void;
};

const initialState: BuilderState = {
  isAIBuilderEnabled: false,
  isAssistantEnabled: false,
  isGenerating: false,
  currentPrompt: '',
  generatedWorkflow: null,
  generationHistory: [],
  maxHistorySize: 50,
  error: null,
  settings: {
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    includeExamples: true,
    includeDocumentation: true,
  },
};

export const useBuilderStore = create<State>((set, get) => ({
  ...initialState,

  setAIBuilderEnabled(enabled) {
    set({ isAIBuilderEnabled: enabled });
  },

  setAssistantEnabled(enabled) {
    set({ isAssistantEnabled: enabled });
  },

  setGenerating(generating) {
    set({ isGenerating: generating });
  },

  setCurrentPrompt(prompt) {
    set({ currentPrompt: prompt });
  },

  setGeneratedWorkflow(workflow) {
    set({ generatedWorkflow: workflow });
  },

  setError(error) {
    set({ error });
  },

  updateSettings(settings) {
    set((state) => ({
      settings: { ...state.settings, ...settings },
    }));
  },

  async generateWorkflow(prompt) {
    const { settings } = get();
    
    set({ 
      isGenerating: true, 
      error: null, 
      currentPrompt: prompt,
      generatedWorkflow: null 
    });

    try {
      // Simulate AI generation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Mock generated workflow
      const mockWorkflow = {
        nodes: [
          {
            id: '1',
            name: 'HTTP Request',
            type: 'n8n-nodes-base.httpRequest',
            position: { x: 100, y: 100 },
            parameters: {
              url: 'https://api.example.com/data',
              method: 'GET',
            },
          },
          {
            id: '2',
            name: 'Process Data',
            type: 'n8n-nodes-base.set',
            position: { x: 300, y: 100 },
            parameters: {
              values: {
                string: [{ name: 'processed', value: '={{ $json.data }}' }],
              },
            },
          },
        ],
        connections: {
          '1': [{ node: '2', type: 'main', index: 0 }],
        },
      };

      set({ 
        isGenerating: false, 
        generatedWorkflow: mockWorkflow 
      });

      // Save to history
      get().saveToHistory({
        prompt,
        workflow: mockWorkflow,
        status: 'success',
        metadata: { settings },
      });

    } catch (error) {
      set({ 
        isGenerating: false, 
        error: error instanceof Error ? error.message : 'Generation failed' 
      });

      // Save failed attempt to history
      get().saveToHistory({
        prompt,
        workflow: null,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Generation failed',
        metadata: { settings },
      });
    }
  },

  cancelGeneration() {
    set({ isGenerating: false });
    
    // Save cancelled attempt to history
    const { currentPrompt, settings } = get();
    if (currentPrompt) {
      get().saveToHistory({
        prompt: currentPrompt,
        workflow: null,
        status: 'cancelled',
        metadata: { settings },
      });
    }
  },

  saveToHistory(history) {
    set((state) => {
      const newHistory: GenerationHistory = {
        ...history,
        id: Math.random().toString(36).slice(2),
        timestamp: Date.now(),
      };

      const updatedHistory = [...state.generationHistory, newHistory];
      
      // Limit history size
      if (updatedHistory.length > state.maxHistorySize) {
        updatedHistory.splice(0, updatedHistory.length - state.maxHistorySize);
      }

      return { generationHistory: updatedHistory };
    });
  },

  clearHistory() {
    set({ generationHistory: [] });
  },

  getHistoryByPrompt(prompt) {
    const { generationHistory } = get();
    return generationHistory.filter((history) => 
      history.prompt.toLowerCase().includes(prompt.toLowerCase())
    );
  },

  reset() {
    set(initialState);
  },
}));