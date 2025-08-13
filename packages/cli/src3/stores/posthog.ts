import { create } from 'zustand';

export type PostHogState = {
  isInitialized: boolean;
  userId: string | null;
  sessionId: string | null;
  featureFlags: Record<string, string | boolean>;
  experiments: Record<string, string>;
  isEnabled: boolean;
  error: string | null;
};

type State = PostHogState & {
  initialize: (userId?: string) => Promise<void>;
  identify: (userId: string, properties?: Record<string, any>) => void;
  track: (event: string, properties?: Record<string, any>) => void;
  setFeatureFlags: (flags: Record<string, string | boolean>) => void;
  setExperiments: (experiments: Record<string, string>) => void;
  getFeatureFlag: (flag: string) => string | boolean | null;
  isFeatureEnabled: (flag: string) => boolean;
  isVariantEnabled: (experiment: string, variant: string) => boolean;
  reset: () => void;
};

const initialState: PostHogState = {
  isInitialized: false,
  userId: null,
  sessionId: null,
  featureFlags: {},
  experiments: {},
  isEnabled: true,
  error: null,
};

export const usePostHogStore = create<State>((set, get) => ({
  ...initialState,

  async initialize(userId) {
    set({ isInitialized: false, error: null });

    try {
      // Simulate PostHog initialization
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      const sessionId = Math.random().toString(36).slice(2);
      
      // Mock feature flags and experiments
      const mockFeatureFlags = {
        'ai-builder': true,
        'focus-panel': 'enabled',
        'ndv-v2': false,
        'chat-integration': true,
        'advanced-templates': 'beta',
      };

      const mockExperiments = {
        'focus-panel-experiment': 'enabled',
        'ndv-ui-overhaul': 'control',
        'ai-templates': 'variant-a',
      };

      set({
        isInitialized: true,
        userId: userId || null,
        sessionId,
        featureFlags: mockFeatureFlags,
        experiments: mockExperiments,
        error: null,
      });
    } catch (error) {
      set({
        isInitialized: false,
        error: error instanceof Error ? error.message : 'Failed to initialize PostHog',
      });
    }
  },

  identify(userId, properties) {
    set({ userId });
    
    // In a real implementation, this would call PostHog's identify method
    console.log('PostHog identify:', { userId, properties });
  },

  track(event, properties) {
    const { userId, sessionId } = get();
    
    // In a real implementation, this would call PostHog's track method
    console.log('PostHog track:', { event, properties, userId, sessionId });
  },

  setFeatureFlags(flags) {
    set((state) => ({
      featureFlags: { ...state.featureFlags, ...flags },
    }));
  },

  setExperiments(experiments) {
    set((state) => ({
      experiments: { ...state.experiments, ...experiments },
    }));
  },

  getFeatureFlag(flag) {
    const { featureFlags } = get();
    return featureFlags[flag] || null;
  },

  isFeatureEnabled(flag) {
    const value = get().getFeatureFlag(flag);
    return value === true || value === 'enabled' || value === 'true';
  },

  isVariantEnabled(experiment, variant) {
    const { experiments } = get();
    return experiments[experiment] === variant;
  },

  reset() {
    set(initialState);
  },
}));