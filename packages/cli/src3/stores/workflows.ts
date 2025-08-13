import { create } from 'zustand';

export type WorkflowId = string;

export type XYPosition = [number, number];

export type WorkflowNode = {
  id: string;
  name: string;
  type?: string;
  position?: XYPosition;
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
  dirty: boolean;
  history: Workflow[];
  historyIndex: number;
  load: (id: string) => Promise<void>;
  create: (payload: Omit<Workflow, 'id'>) => Promise<string>;
  update: () => Promise<void>;
  setName: (name: string) => void;
  addNode: (node: WorkflowNode) => void;
  setNodePosition: (id: string, pos: XYPosition) => void;
  connect: (fromId: string, toId: string) => void;
  removeNode: (id: string) => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  markSaved: () => void;
};

function clone(wf?: Workflow): Workflow | undefined {
  return wf ? JSON.parse(JSON.stringify(wf)) : undefined;
}

export const useWorkflowStore = create<State>((set, get) => ({
  current: undefined,
  loading: false,
  dirty: false,
  history: [],
  historyIndex: -1,
  error: undefined,
  async load(id) {
    set({ loading: true, error: undefined });
    try {
      const wf = await fetchJson<Workflow>(`/api/rest/workflows/${id}`);
      set({ current: wf, dirty: false, history: [clone(wf)!], historyIndex: 0 });
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
    const wf = { ...payload, id: created.id } as Workflow;
    set({ current: wf, dirty: false, history: [clone(wf)!], historyIndex: 0 });
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
    set({ dirty: false });
  },
  setName(name) {
    const wf = get().current;
    if (!wf) return;
    const next = { ...wf, name };
    set({ current: next, dirty: true });
  },
  addNode(node) {
    const wf = get().current;
    if (!wf) return;
    const next = { ...wf, nodes: [...wf.nodes, node] };
    set({ current: next, dirty: true });
  },
  setNodePosition(id, pos) {
    const wf = get().current;
    if (!wf) return;
    const next = {
      ...wf,
      nodes: wf.nodes.map((n) => (n.id === id ? { ...n, position: pos } : n)),
    };
    set({ current: next, dirty: true });
  },
  connect(fromId, toId) {
    const wf = get().current;
    if (!wf) return;
    const conns = { ...wf.connections };
    conns[fromId] = conns[fromId] || [];
    conns[fromId].push({ node: toId, type: 'main', index: 0 });
    const next = { ...wf, connections: conns };
    set({ current: next, dirty: true });
  },
  removeNode(id) {
    const wf = get().current;
    if (!wf) return;
    const next = {
      ...wf,
      nodes: wf.nodes.filter((n) => n.id !== id),
      connections: Object.fromEntries(Object.entries(wf.connections).map(([k, arr]: any) => [k, (arr as any[]).filter((c) => c.node !== id)])),
    } as Workflow;
    set({ current: next, dirty: true });
  },
  pushHistory() {
    const wf = clone(get().current);
    if (!wf) return;
    const history = get().history.slice(0, get().historyIndex + 1);
    history.push(wf);
    set({ history, historyIndex: history.length - 1 });
  },
  undo() {
    const { historyIndex, history } = get();
    if (historyIndex <= 0) return;
    const idx = historyIndex - 1;
    set({ historyIndex: idx, current: clone(history[idx]), dirty: true });
  },
  redo() {
    const { historyIndex, history } = get();
    if (historyIndex >= history.length - 1) return;
    const idx = historyIndex + 1;
    set({ historyIndex: idx, current: clone(history[idx]), dirty: true });
  },
  markSaved() {
    set({ dirty: false });
  },
}));