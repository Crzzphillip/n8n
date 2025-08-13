import { create } from 'zustand';

export type Folder = {
  id: string;
  name: string;
  description?: string;
  parentFolderId?: string | null;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  workflowCount: number;
  isShared: boolean;
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
};

export type FoldersState = {
  folders: Folder[];
  currentFolder: Folder | null;
  parentFolder: Folder | null;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedFolderId: string | null;
  expandedFolders: Set<string>;
  sortBy: 'name' | 'createdAt' | 'updatedAt' | 'workflowCount';
  sortOrder: 'asc' | 'desc';
};

type State = FoldersState & {
  fetchFolders: (projectId: string) => Promise<void>;
  fetchFolder: (folderId: string) => Promise<Folder | null>;
  fetchFolderPath: (projectId: string, folderId: string) => Promise<Folder[]>;
  createFolder: (folder: Omit<Folder, 'id' | 'createdAt' | 'updatedAt' | 'workflowCount'>) => Promise<string>;
  updateFolder: (folderId: string, updates: Partial<Folder>) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  setCurrentFolder: (folder: Folder | null) => void;
  setParentFolder: (folder: Folder | null) => void;
  setSearchTerm: (term: string) => void;
  setSelectedFolderId: (folderId: string | null) => void;
  toggleExpandedFolder: (folderId: string) => void;
  setSortBy: (sortBy: FoldersState['sortBy']) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  getFolderById: (folderId: string) => Folder | undefined;
  getFoldersByParent: (parentFolderId: string | null) => Folder[];
  getFolderPath: (folderId: string) => Folder[];
  getFilteredFolders: () => Folder[];
  reset: () => void;
};

const initialState: FoldersState = {
  folders: [],
  currentFolder: null,
  parentFolder: null,
  loading: false,
  error: null,
  searchTerm: '',
  selectedFolderId: null,
  expandedFolders: new Set(),
  sortBy: 'name',
  sortOrder: 'asc',
};

export const useFoldersStore = create<State>((set, get) => ({
  ...initialState,

  async fetchFolders(projectId) {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Mock data
      const mockFolders: Folder[] = [
        {
          id: '1',
          name: 'Workflows',
          description: 'Main workflows folder',
          parentFolderId: null,
          projectId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          workflowCount: 5,
          isShared: false,
          permissions: { read: true, write: true, delete: true },
        },
        {
          id: '2',
          name: 'Templates',
          description: 'Workflow templates',
          parentFolderId: null,
          projectId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          workflowCount: 3,
          isShared: true,
          permissions: { read: true, write: false, delete: false },
        },
        {
          id: '3',
          name: 'Archived',
          description: 'Archived workflows',
          parentFolderId: '1',
          projectId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          workflowCount: 2,
          isShared: false,
          permissions: { read: true, write: true, delete: true },
        },
      ];

      set({ folders: mockFolders, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch folders',
      });
    }
  },

  async fetchFolder(folderId) {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 200));
      
      const folder = get().folders.find((f) => f.id === folderId);
      set({ loading: false });
      
      return folder || null;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch folder',
      });
      return null;
    }
  },

  async fetchFolderPath(projectId, folderId) {
    const { folders } = get();
    const path: Folder[] = [];
    let currentFolderId = folderId;

    while (currentFolderId) {
      const folder = folders.find((f) => f.id === currentFolderId);
      if (!folder) break;
      
      path.unshift(folder);
      currentFolderId = folder.parentFolderId || '';
    }

    return path;
  },

  async createFolder(folder) {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const newFolder: Folder = {
        ...folder,
        id: Math.random().toString(36).slice(2),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workflowCount: 0,
      };

      set((state) => ({
        folders: [...state.folders, newFolder],
        loading: false,
      }));

      return newFolder.id;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to create folder',
      });
      throw error;
    }
  },

  async updateFolder(folderId, updates) {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      set((state) => ({
        folders: state.folders.map((folder) =>
          folder.id === folderId
            ? { ...folder, ...updates, updatedAt: new Date().toISOString() }
            : folder
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update folder',
      });
      throw error;
    }
  },

  async deleteFolder(folderId) {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      set((state) => ({
        folders: state.folders.filter((folder) => folder.id !== folderId),
        loading: false,
      }));
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to delete folder',
      });
      throw error;
    }
  },

  setCurrentFolder(folder) {
    set({ currentFolder: folder });
  },

  setParentFolder(folder) {
    set({ parentFolder: folder });
  },

  setSearchTerm(term) {
    set({ searchTerm: term });
  },

  setSelectedFolderId(folderId) {
    set({ selectedFolderId: folderId });
  },

  toggleExpandedFolder(folderId) {
    set((state) => {
      const newExpandedFolders = new Set(state.expandedFolders);
      if (newExpandedFolders.has(folderId)) {
        newExpandedFolders.delete(folderId);
      } else {
        newExpandedFolders.add(folderId);
      }
      return { expandedFolders: newExpandedFolders };
    });
  },

  setSortBy(sortBy) {
    set({ sortBy });
  },

  setSortOrder(order) {
    set({ sortOrder: order });
  },

  getFolderById(folderId) {
    return get().folders.find((folder) => folder.id === folderId);
  },

  getFoldersByParent(parentFolderId) {
    return get().folders.filter((folder) => folder.parentFolderId === parentFolderId);
  },

  getFolderPath(folderId) {
    const { folders } = get();
    const path: Folder[] = [];
    let currentFolderId = folderId;

    while (currentFolderId) {
      const folder = folders.find((f) => f.id === currentFolderId);
      if (!folder) break;
      
      path.unshift(folder);
      currentFolderId = folder.parentFolderId || '';
    }

    return path;
  },

  getFilteredFolders() {
    const { folders, searchTerm, sortBy, sortOrder } = get();
    
    let filtered = folders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((folder) =>
        folder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        folder.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        case 'workflowCount':
          aValue = a.workflowCount;
          bValue = b.workflowCount;
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

  reset() {
    set(initialState);
  },
}));