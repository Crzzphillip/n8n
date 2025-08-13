"use client";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Canvas, { CanvasNode, CanvasEdge } from './canvas/Canvas';
import NDV from './NDV/NodeDetailsView';
import NodeCreator from './NodeCreator/NodeCreator';

type WorkflowId = string;

type Workflow = {
  id?: WorkflowId;
  name: string;
  nodes: Array<{ id: string; name: string; type?: string; position?: { x: number; y: number }; parameters?: Record<string, any> }>;
  connections: Record<string, any>;
  settings?: Record<string, any>;
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function NodeView(props: { mode: 'new' | 'existing' }) {
  const router = useRouter();
  const params = useSearchParams();
  const mode = props.mode;
  const workflowId = params.get('id') || undefined;

  const [workflow, setWorkflow] = useState<Workflow>({ name: 'New workflow', nodes: [], connections: {} });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (mode === 'existing' && workflowId) {
      setLoading(true);
      fetchJson<Workflow>(`/api/rest/workflows/${workflowId}`)
        .then((wf) => setWorkflow(wf))
        .catch((e: any) => setError(e?.message || 'Failed to load'))
        .finally(() => setLoading(false));
    }
  }, [mode, workflowId]);

  const canSave = useMemo(() => workflow.name.trim().length > 0, [workflow.name]);

  const saveNew = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const created = await fetchJson<{ id: string }>(`/api/rest/workflows`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: workflow.name, nodes: workflow.nodes, connections: workflow.connections, settings: workflow.settings }),
      });
      setWorkflow((w) => ({ ...w, id: created.id }));
      router.replace(`/workflow/new?id=${created.id}`);
    } catch (e: any) {
      setError(e?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }, [workflow, router]);

  const updateExisting = useCallback(async () => {
    if (!workflow.id) return;
    setSaving(true);
    setError(null);
    try {
      await fetchJson(`/api/rest/workflows/${workflow.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: workflow.name, nodes: workflow.nodes, connections: workflow.connections, settings: workflow.settings }),
      });
    } catch (e: any) {
      setError(e?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  }, [workflow]);

  const addNode = useCallback((name: string) => {
    const id = uuid();
    setWorkflow((w) => ({
      ...w,
      nodes: [...w.nodes, { id, name, position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 } }],
    }));
  }, []);

  const connectNodes = useCallback((fromId: string, toId: string) => {
    setWorkflow((w) => ({
      ...w,
      connections: {
        ...w.connections,
        [fromId]: [{ node: toId, type: 'main', index: 0 }],
      },
    }));
  }, []);

  const canvasNodes: CanvasNode[] = useMemo(
    () =>
      workflow.nodes.map((n) => ({
        id: n.id,
        data: { label: n.name },
        position: { x: n.position?.x ?? 100, y: n.position?.y ?? 100 },
        selected: selectedNodeId === n.id,
      })),
    [workflow.nodes, selectedNodeId],
  );

  const canvasEdges: CanvasEdge[] = useMemo(() => {
    const edges: CanvasEdge[] = [];
    Object.entries(workflow.connections || {}).forEach(([fromId, conns]) => {
      if (Array.isArray(conns)) {
        conns.forEach((c: any, idx: number) => {
          if (c?.node) edges.push({ id: `${fromId}-${c.node}-${idx}`, source: fromId, target: c.node });
        });
      }
    });
    return edges;
  }, [workflow.connections]);

  const onCanvasChange = useCallback((nodes: CanvasNode[], edges: CanvasEdge[]) => {
    setWorkflow((w) => ({
      ...w,
      nodes: w.nodes.map((n) => {
        const cn = nodes.find((m) => m.id === n.id);
        return cn ? { ...n, position: cn.position } : n;
      }),
      connections: edges.reduce<Record<string, any[]>>((acc, e) => {
        acc[e.source] = acc[e.source] || [];
        acc[e.source].push({ node: e.target, type: 'main', index: 0 });
        return acc;
      }, {}),
    }));
  }, []);

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 320px', minHeight: 'calc(100vh - 32px)' }}>
      <aside style={{ borderRight: '1px solid #e5e5e5', padding: 16 }}>
        <h3>Workflow</h3>
        <label>
          Name
          <input
            value={workflow.name}
            onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
            style={{ display: 'block', width: '100%' }}
          />
        </label>
        <div style={{ marginTop: 12 }}>
          {mode === 'new' ? (
            <button onClick={saveNew} disabled={!canSave || saving}>
              {saving ? 'Saving…' : 'Save new'}
            </button>
          ) : (
            <button onClick={updateExisting} disabled={!canSave || saving}>
              {saving ? 'Saving…' : 'Update'}
            </button>
          )}
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <hr style={{ margin: '16px 0' }} />
        <h4>Add node</h4>
        <button onClick={() => addNode('Start')}>Add Start</button>
        <button onClick={() => addNode('HTTP Request')} style={{ marginLeft: 8 }}>
          Add HTTP Request
        </button>
        <button onClick={() => addNode('Set')} style={{ marginLeft: 8 }}>
          Add Set
        </button>
        <hr style={{ margin: '16px 0' }} />
        <h4>Browse nodes</h4>
        <div style={{ maxHeight: 360, overflow: 'auto' }}>
          <NodeCreator />
        </div>
        <hr style={{ margin: '16px 0' }} />
        <h4>Connect (demo)</h4>
        {workflow.nodes.length >= 2 ? (
          <button onClick={() => connectNodes(workflow.nodes[0].id, workflow.nodes[1].id)}>Connect first → second</button>
        ) : (
          <p>Add at least two nodes to enable demo connect</p>
        )}
      </aside>
      <section style={{ padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2 style={{ margin: 0 }}>{workflow.name}</h2>
            {workflow.id && <small style={{ color: '#666' }}>id: {workflow.id}</small>}
          </div>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <div>
            {(await import('./RunControls')).default({ workflowId: workflow.id })}
          </div>
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 0, minHeight: '100%' }}>
          <Canvas nodes={canvasNodes} edges={canvasEdges} onChange={onCanvasChange} />
        </div>
      </section>
      <aside>
        <NDV selectedNodeId={selectedNodeId} />
      </aside>
    </div>
  );
}