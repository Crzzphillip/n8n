"use client";
import { useMemo, useState } from 'react';
import { useWorkflowStore } from '../../../src3/stores/workflows';

export default function NodeDetailsView(props: { selectedNodeId?: string }) {
  const { current, addNode } = useWorkflowStore();
  const node = useMemo(() => current?.nodes.find((n) => n.id === props.selectedNodeId), [current, props.selectedNodeId]);
  const [raw, setRaw] = useState<string>(() => JSON.stringify(node?.parameters || {}, null, 2));

  if (!node) return <div style={{ padding: 12 }}>No node selected</div>;

  const save = () => {
    try {
      const params = JSON.parse(raw);
      const wf = useWorkflowStore.getState().current;
      if (!wf) return;
      const updated = {
        ...wf,
        nodes: wf.nodes.map((n) => (n.id === node.id ? { ...n, parameters: params } : n)),
      };
      useWorkflowStore.setState({ current: updated });
    } catch (e) {
      // ignore parse error for now; add validation later
    }
  };

  return (
    <div style={{ padding: 12, borderLeft: '1px solid #eee', height: '100%' }}>
      <h4>Node: {node.name}</h4>
      <textarea value={raw} onChange={(e) => setRaw(e.target.value)} style={{ width: '100%', height: 240 }} />
      <div style={{ marginTop: 8 }}>
        <button onClick={save}>Save parameters</button>
      </div>
    </div>
  );
}