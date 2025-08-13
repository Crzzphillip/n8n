"use client";
import { useMemo, useState } from 'react';
import { useWorkflowStore } from '../../../src3/stores/workflows';
import SchemaForm from './SchemaForm';
import CredentialSelector from './CredentialSelector';

export default function NodeDetailsView(props: { selectedNodeId?: string }) {
  const { current } = useWorkflowStore();
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
      // ignore for now
    }
  };

  const onSchemaChange = (params: Record<string, any>) => {
    const wf = useWorkflowStore.getState().current;
    if (!wf) return;
    const updated = {
      ...wf,
      nodes: wf.nodes.map((n) => (n.id === node.id ? { ...n, parameters: params } : n)),
    };
    useWorkflowStore.setState({ current: updated });
    setRaw(JSON.stringify(params, null, 2));
  };

  return (
    <div style={{ padding: 12, borderLeft: '1px solid #eee', height: '100%' }}>
      <h4>Node: {node.name}</h4>
      <div style={{ marginBottom: 8 }}>
        <label>Credential <CredentialSelector value={node.parameters?.credentials} onChange={(id) => onSchemaChange({ ...(node.parameters || {}), credentials: id })} /></label>
      </div>
      {node.type ? (
        <SchemaForm nodeType={node.type} value={node.parameters || {}} onChange={onSchemaChange} />
      ) : (
        <>
          <textarea value={raw} onChange={(e) => setRaw(e.target.value)} style={{ width: '100%', height: 240 }} />
          <div style={{ marginTop: 8 }}>
            <button onClick={save}>Save parameters</button>
          </div>
        </>
      )}
    </div>
  );
}