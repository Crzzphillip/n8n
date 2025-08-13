import { create } from 'zustand';

export type WorkflowId = string;

export type WorkflowNode = {
  id: string;
  name: string;
  type?: string;
  position?: { x: number; y: number };
  parameters?: Record<string, any>;
};

export type Workflow = {
  id?: WorkflowId;
  name: string;
  nodes: WorkflowNode[];
  connections: Record<string, any[]>;
  settings?: Record<string, any>;
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

type State = {
  current?: Workflow;
  loading: boolean;
  error?: string;
  load: (id: string) => Promise<void>;
  create: (payload: Omit<Workflow, 'id'>) => Promise<string>;
  update: () => Promise<void>;
  setName: (name: string) => void;
  addNode: (node: WorkflowNode) => void;
  setNodePosition: (id: string, pos: { x: number; y: number }) => void;
  connect: (fromId: string, toId: string) => void;
};

export const useWorkflowStore = create<State>((set, get) => ({
  current: undefined,
  loading: false,
  error: undefined,
  async load(id) {
    set({ loading: true, error: undefined });
    try {
      const wf = await fetchJson<Workflow>(`/api/rest/workflows/${id}`);
      set({ current: wf });
    } catch (e: any) {
      set({ error: e?.message || 'Failed to load' });
    } finally {
      set({ loading: false });
    }
  },
  async create(payload) {
    const created = await fetchJson<{ id: string }>(`/api/rest/workflows`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    set({ current: { ...payload, id: created.id } });
    return created.id;
  },
  async update() {
    const wf = get().current;
    if (!wf?.id) return;
    await fetchJson(`/api/rest/workflows/${wf.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings }),
    });
  },
  setName(name) {
    const wf = get().current;
    if (!wf) return;
    set({ current: { ...wf, name } });
  },
  addNode(node) {
    const wf = get().current;
    if (!wf) return;
    set({ current: { ...wf, nodes: [...wf.nodes, node] } });
  },
  setNodePosition(id, pos) {
    const wf = get().current;
    if (!wf) return;
    set({
      current: {
        ...wf,
        nodes: wf.nodes.map((n) => (n.id === id ? { ...n, position: pos } : n)),
      },
    });
  },
  connect(fromId, toId) {
    const wf = get().current;
    if (!wf) return;
    const conns = { ...wf.connections };
    conns[fromId] = conns[fromId] || [];
    conns[fromId].push({ node: toId, type: 'main', index: 0 });
    set({ current: { ...wf, connections: conns } });
  },
}));