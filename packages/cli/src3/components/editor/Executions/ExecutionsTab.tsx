"use client";
import { useEffect, useMemo, useState } from 'react';
import { useExecutionsStore } from '../../../src3/stores/executions';

export default function ExecutionsTab(props: { workflowId?: string }) {
  const { items, list, stop } = useExecutionsStore();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedExecId, setSelectedExecId] = useState<string | undefined>(undefined);

  useEffect(() => { void list(); }, [list]);

  const filtered = useMemo(() => items.filter((i) => !statusFilter || i.status === statusFilter), [items, statusFilter]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', height: '100%' }}>
      <aside style={{ borderRight: '1px solid #eee', padding: 8 }}>
        <div style={{ marginBottom: 8 }}>
          <label>Status <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="running">Running</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
            <option value="waiting">Waiting</option>
          </select></label>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {filtered.map((e) => (
            <li key={e.id} style={{ padding: 6, cursor: 'pointer', background: selectedExecId === e.id ? '#eef' : 'transparent' }} onClick={() => setSelectedExecId(e.id)}>
              <div><strong>{e.id}</strong> — {e.status}</div>
              <small>{e.startedAt ? new Date(e.startedAt).toLocaleString() : '-'}</small>
            </li>
          ))}
        </ul>
      </aside>
      <section style={{ padding: 8 }}>
        {!selectedExecId && <div>Select an execution</div>}
        {selectedExecId && (
          <div>
            <div style={{ marginBottom: 8 }}>
              <button onClick={() => stop(selectedExecId)}>Stop</button>
              {/* TODO: Retry-from, stop waiting for webhook when available */}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ border: '1px solid #eee', minHeight: 200 }}>
                <h4>Steps</h4>
                {/* TODO: per-node step outputs list */}
              </div>
              <div style={{ border: '1px solid #eee', minHeight: 200 }}>
                <h4>Output</h4>
                {/* TODO: streaming output pane */}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}