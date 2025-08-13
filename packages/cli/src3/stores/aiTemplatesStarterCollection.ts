import { create } from 'zustand';

export type AITemplateStarter = {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  templateId: string;
  workflow: any;
  thumbnail?: string;
  usageCount: number;
  rating: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AITemplatesStarterCollectionState = {
  templates: AITemplateStarter[];
  categories: string[];
  tags: string[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string | null;
  selectedDifficulty: AITemplateStarter['difficulty'] | null;
  selectedTags: string[];
  sortBy: 'name' | 'usageCount' | 'rating' | 'createdAt' | 'difficulty';
  sortOrder: 'asc' | 'desc';
  openedTemplates: Set<string>;
  usageStats: Record<string, number>;
};

type State = AITemplatesStarterCollectionState & {
  fetchTemplates: () => Promise<void>;
  fetchTemplate: (id: string) => Promise<AITemplateStarter | null>;
  searchTemplates: (term: string) => void;
  setCategory: (category: string | null) => void;
  setDifficulty: (difficulty: AITemplateStarter['difficulty'] | null) => void;
  setTags: (tags: string[]) => void;
  setSortBy: (sortBy: AITemplatesStarterCollectionState['sortBy']) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  getFilteredTemplates: () => AITemplateStarter[];
  getTemplatesByCategory: (category: string) => AITemplateStarter[];
  getTemplatesByDifficulty: (difficulty: AITemplateStarter['difficulty']) => AITemplateStarter[];
  getTemplatesByTag: (tag: string) => AITemplateStarter[];
  trackTemplateOpen: (templateId: string) => void;
  trackTemplateUsage: (templateId: string) => void;
  rateTemplate: (templateId: string, rating: number) => Promise<void>;
  getUsageStats: () => Record<string, number>;
  reset: () => void;
};

const initialState: AITemplatesStarterCollectionState = {
  templates: [],
  categories: [],
  tags: [],
  loading: false,
  error: null,
  searchTerm: '',
  selectedCategory: null,
  selectedDifficulty: null,
  selectedTags: [],
  sortBy: 'name',
  sortOrder: 'asc',
  openedTemplates: new Set(),
  usageStats: {},
};

export const useAITemplatesStarterCollectionStore = create<State>((set, get) => ({
  ...initialState,

  async fetchTemplates() {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Mock data
      const mockTemplates: AITemplateStarter[] = [
        {
          id: '1',
          name: 'Email Classification',
          description: 'Automatically classify emails using AI',
          category: 'Email',
          difficulty: 'intermediate',
          tags: ['email', 'classification', 'ai', 'nlp'],
          templateId: 'email-classification',
          workflow: { nodes: [], connections: {} },
          usageCount: 150,
          rating: 4.5,
          isFeatured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Data Extraction',
          description: 'Extract structured data from documents',
          category: 'Data',
          difficulty: 'advanced',
          tags: ['data', 'extraction', 'ocr', 'ai'],
          templateId: 'data-extraction',
          workflow: { nodes: [], connections: {} },
          usageCount: 89,
          rating: 4.2,
          isFeatured: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Chatbot Assistant',
          description: 'Create a simple chatbot using AI',
          category: 'Chat',
          difficulty: 'beginner',
          tags: ['chatbot', 'ai', 'conversation', 'assistant'],
          templateId: 'chatbot-assistant',
          workflow: { nodes: [], connections: {} },
          usageCount: 234,
          rating: 4.7,
          isFeatured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const categories = [...new Set(mockTemplates.map((t) => t.category))];
      const tags = [...new Set(mockTemplates.flatMap((t) => t.tags))];

      set({
        templates: mockTemplates,
        categories,
        tags,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch templates',
      });
    }
  },

  async fetchTemplate(id) {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 200));
      
      const template = get().templates.find((t) => t.id === id);
      set({ loading: false });
      
      return template || null;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch template',
      });
      return null;
    }
  },

  searchTemplates(term) {
    set({ searchTerm: term });
  },

  setCategory(category) {
    set({ selectedCategory: category });
  },

  setDifficulty(difficulty) {
    set({ selectedDifficulty: difficulty });
  },

  setTags(tags) {
    set({ selectedTags: tags });
  },

  setSortBy(sortBy) {
    set({ sortBy });
  },

  setSortOrder(order) {
    set({ sortOrder: order });
  },

  getFilteredTemplates() {
    const { templates, searchTerm, selectedCategory, selectedDifficulty, selectedTags, sortBy, sortOrder } = get();
    
    let filtered = templates;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((template) =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((template) => template.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty) {
      filtered = filtered.filter((template) => template.difficulty === selectedDifficulty);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((template) =>
        selectedTags.some((tag) => template.tags.includes(tag))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'usageCount':
          aValue = a.usageCount;
          bValue = b.usageCount;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'difficulty':
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
          aValue = difficultyOrder[a.difficulty];
          bValue = difficultyOrder[b.difficulty];
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  },

  getTemplatesByCategory(category) {
    return get().templates.filter((template) => template.category === category);
  },

  getTemplatesByDifficulty(difficulty) {
    return get().templates.filter((template) => template.difficulty === difficulty);
  },

  getTemplatesByTag(tag) {
    return get().templates.filter((template) => template.tags.includes(tag));
  },

  trackTemplateOpen(templateId) {
    set((state) => {
      const newOpenedTemplates = new Set(state.openedTemplates);
      newOpenedTemplates.add(templateId);
      return { openedTemplates: newOpenedTemplates };
    });
  },

  trackTemplateUsage(templateId) {
    set((state) => {
      const newTemplates = state.templates.map((template) =>
        template.templateId === templateId
          ? { ...template, usageCount: template.usageCount + 1 }
          : template
      );

      const newUsageStats = {
        ...state.usageStats,
        [templateId]: (state.usageStats[templateId] || 0) + 1,
      };

      return {
        templates: newTemplates,
        usageStats: newUsageStats,
      };
    });
  },

  async rateTemplate(templateId, rating) {
    const template = get().templates.find((t) => t.templateId === templateId);
    if (!template) return;

    // Simulate rating update
    set((state) => ({
      templates: state.templates.map((t) =>
        t.templateId === templateId ? { ...t, rating } : t
      ),
    }));
  },

  getUsageStats() {
    return get().usageStats;
  },

  reset() {
    set(initialState);
  },
}));