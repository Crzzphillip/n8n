"use client";
import { useEffect, useMemo, useState } from 'react';

// Minimal client for sv backend REST
async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

type Workflow = { id?: string; name: string; nodes: any[]; connections: Record<string, any>; settings?: Record<string, any> };

export default function NodeViewNew() {
  const [workflow, setWorkflow] = useState<Workflow>({ name: 'New workflow', nodes: [], connections: {} });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Optionally preload node types, settings, etc.
  }, []);

  const canSave = useMemo(() => workflow.name.trim().length > 0, [workflow.name]);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const created = await fetchJson<{ id: string }>(`/api/rest/workflows`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: workflow.name, nodes: workflow.nodes, connections: workflow.connections, settings: workflow.settings }),
      });
      setWorkflow((w) => ({ ...w, id: created.id }));
    } catch (e: any) {
      setError(e?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Create new workflow</h2>
      <label>
        Name
        <input
          value={workflow.name}
          onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
          style={{ display: 'block', width: 320 }}
        />
      </label>
      <div style={{ marginTop: 12 }}>
        <button onClick={save} disabled={!canSave || saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {workflow.id && <p>Saved with id {workflow.id}</p>}
      {/* Placeholder for canvas/editor; will integrate full node canvas later */}
      <div style={{ marginTop: 24, padding: 12, border: '1px dashed #999' }}>
        Canvas placeholder — add nodes and connections here
      </div>
    </div>
  );
}