import { create } from 'zustand';

export type WorkflowTemplate = {
  id: string;
  name: string;
  description?: string;
  category: string;
  tags: string[];
  workflow: any;
  meta?: {
    templateId?: string;
    onboardingId?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  isFeatured: boolean;
  downloads: number;
  rating?: number;
  author?: {
    name: string;
    email?: string;
    avatar?: string;
  };
};

export type TemplatesState = {
  templates: WorkflowTemplate[];
  featuredTemplates: WorkflowTemplate[];
  categories: string[];
  tags: string[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string | null;
  selectedTags: string[];
  sortBy: 'name' | 'downloads' | 'rating' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
  previousSessionId: string | null;
};

type State = TemplatesState & {
  fetchTemplates: () => Promise<void>;
  fetchTemplate: (id: string) => Promise<WorkflowTemplate | null>;
  searchTemplates: (term: string) => void;
  setCategory: (category: string | null) => void;
  setTags: (tags: string[]) => void;
  setSortBy: (sortBy: TemplatesState['sortBy']) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  getFilteredTemplates: () => WorkflowTemplate[];
  getTemplatesByCategory: (category: string) => WorkflowTemplate[];
  getTemplatesByTag: (tag: string) => WorkflowTemplate[];
  downloadTemplate: (id: string) => Promise<void>;
  rateTemplate: (id: string, rating: number) => Promise<void>;
  setPreviousSessionId: (sessionId: string | null) => void;
  reset: () => void;
};

const initialState: TemplatesState = {
  templates: [],
  featuredTemplates: [],
  categories: [],
  tags: [],
  loading: false,
  error: null,
  searchTerm: '',
  selectedCategory: null,
  selectedTags: [],
  sortBy: 'name',
  sortOrder: 'asc',
  previousSessionId: null,
};

export const useTemplatesStore = create<State>((set, get) => ({
  ...initialState,

  async fetchTemplates() {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Mock data - in real implementation, this would be an API call
      const mockTemplates: WorkflowTemplate[] = [
        {
          id: '1',
          name: 'Basic HTTP Request',
          description: 'A simple workflow that makes an HTTP request',
          category: 'HTTP',
          tags: ['http', 'api', 'basic'],
          workflow: { nodes: [], connections: {} },
          meta: { templateId: 'basic-http' },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isPublic: true,
          isFeatured: true,
          downloads: 150,
          rating: 4.5,
          author: { name: 'n8n Team' },
        },
        {
          id: '2',
          name: 'Data Processing Pipeline',
          description: 'Process and transform data with multiple nodes',
          category: 'Data',
          tags: ['data', 'processing', 'pipeline'],
          workflow: { nodes: [], connections: {} },
          meta: { templateId: 'data-pipeline' },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isPublic: true,
          isFeatured: false,
          downloads: 75,
          rating: 4.2,
          author: { name: 'n8n Team' },
        },
      ];

      const categories = [...new Set(mockTemplates.map((t) => t.category))];
      const tags = [...new Set(mockTemplates.flatMap((t) => t.tags))];
      const featuredTemplates = mockTemplates.filter((t) => t.isFeatured);

      set({
        templates: mockTemplates,
        featuredTemplates,
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
    const { templates, searchTerm, selectedCategory, selectedTags, sortBy, sortOrder } = get();
    
    let filtered = templates;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((template) =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((template) => template.category === selectedCategory);
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
        case 'downloads':
          aValue = a.downloads;
          bValue = b.downloads;
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
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

  getTemplatesByTag(tag) {
    return get().templates.filter((template) => template.tags.includes(tag));
  },

  async downloadTemplate(id) {
    const template = get().templates.find((t) => t.id === id);
    if (!template) return;

    // Simulate download
    set((state) => ({
      templates: state.templates.map((t) =>
        t.id === id ? { ...t, downloads: t.downloads + 1 } : t
      ),
    }));
  },

  async rateTemplate(id, rating) {
    const template = get().templates.find((t) => t.id === id);
    if (!template) return;

    // Simulate rating
    set((state) => ({
      templates: state.templates.map((t) =>
        t.id === id ? { ...t, rating } : t
      ),
    }));
  },

  setPreviousSessionId(sessionId) {
    set({ previousSessionId: sessionId });
  },

  reset() {
    set(initialState);
  },
}));