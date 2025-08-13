"use client";
import { useEffect, useMemo, useState } from 'react';
import { useNodeTypesStore } from '../../../src3/stores/nodeTypes';
import { useWorkflowStore } from '../../../src3/stores/workflows';

function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function NodeCreator() {
  const { types, fetchAll, search } = useNodeTypesStore();
  const { current, addNode } = useWorkflowStore();
  const [q, setQ] = useState('');

  useEffect(() => { void fetchAll(); }, [fetchAll]);

  const results = useMemo(() => search(q).slice(0, 50), [search, q, types]);

  return (
    <div>
      <input
        placeholder="Search nodes"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ width: '100%', marginBottom: 8 }}
      />
      <div style={{ maxHeight: 320, overflow: 'auto', border: '1px solid #eee' }}>
        {results.map((t) => (
          <div key={t.name} style={{ padding: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>{t.displayName}</span>
            <button
              onClick={() => addNode({ id: uuid(), name: t.displayName, type: t.name, position: { x: 120, y: 120 } })}
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}