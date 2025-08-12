"use client";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: 'calc(100vh - 32px)' }}>
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
        <h4>Connect (demo)</h4>
        {workflow.nodes.length >= 2 ? (
          <button onClick={() => connectNodes(workflow.nodes[0].id, workflow.nodes[1].id)}>Connect first → second</button>
        ) : (
          <p>Add at least two nodes to enable demo connect</p>
        )}
      </aside>
      <section style={{ padding: 16 }}>
        <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2 style={{ margin: 0 }}>{workflow.name}</h2>
          {workflow.id && <small style={{ color: '#666' }}>id: {workflow.id}</small>}
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, minHeight: 480 }}>
          <p style={{ color: '#666' }}>Canvas placeholder. Nodes:</p>
          <ul>
            {workflow.nodes.map((n) => (
              <li key={n.id}>
                {n.name} ({n.id}) — pos {n.position?.x?.toFixed?.(0)},{' '}
                {n.position?.y?.toFixed?.(0)}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}