"use client";
import { useMemo, useState, useEffect, KeyboardEvent } from 'react';
import { useWorkflowStore } from '../../../src3/stores/workflows';
import SchemaForm from './SchemaForm';
import CredentialSelector from './CredentialSelector';

export default function NodeDetailsView(props: {
  selectedNodeId?: string;
  onOpenConnectionNodeCreator?: (nodeId: string, connectionType: string, connectionIndex?: number) => void;
  onSwitchSelectedNode?: (nodeName: string) => void;
  onSaveKeyboardShortcut?: () => void;
  readOnly?: boolean;
  isProductionExecutionPreview?: boolean;
}) {
  const { current } = useWorkflowStore();
  const node = useMemo(() => current?.nodes.find((n) => n.id === props.selectedNodeId), [current, props.selectedNodeId]);
  const [raw, setRaw] = useState<string>(() => JSON.stringify(node?.parameters || {}, null, 2));

  useEffect(() => {
    setRaw(JSON.stringify(node?.parameters || {}, null, 2));
  }, [node?.id]);

  const { t } = (require('../../../src3/hooks/useI18n') as any);
  if (!node) return <div style={{ padding: 12 }}>{t('ndv.noNodeSelected')}</div>;

  const save = () => {
    if (props.readOnly) return;
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
    if (props.readOnly) return;
    const wf = useWorkflowStore.getState().current;
    if (!wf) return;
    const updated = {
      ...wf,
      nodes: wf.nodes.map((n) => (n.id === node.id ? { ...n, parameters: params } : n)),
    };
    useWorkflowStore.setState({ current: updated });
    setRaw(JSON.stringify(params, null, 2));
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      if (props.onSaveKeyboardShortcut) props.onSaveKeyboardShortcut();
    }
  };

  return (
    <div style={{ padding: 12, borderLeft: '1px solid #eee', height: '100%' }} onKeyDown={onKeyDown} tabIndex={0}>
      {props.isProductionExecutionPreview && (
        <div style={{ background: '#fff7e6', border: '1px solid #ffe58f', padding: 8, borderRadius: 6, marginBottom: 8 }}>
          {t('ndv.preview.banner')}
        </div>
      )}
      <h4>Node: {node.name}</h4>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button onClick={() => props.onOpenConnectionNodeCreator?.(node.id, 'outputs', 0)} disabled={props.readOnly}>{t('ndv.openConnectionCreator')}</button>
        <button onClick={() => props.onSwitchSelectedNode?.(node.name)}>{t('ndv.switchSelectedNode')}</button>
      </div>
      {!props.readOnly && (
        <div style={{ marginBottom: 8 }}>
          <label>{t('ndv.credential')} <CredentialSelector value={node.parameters?.credentials} onChange={(id) => onSchemaChange({ ...(node.parameters || {}), credentials: id })} /></label>
        </div>
      )}
      {node.type ? (
        <SchemaForm nodeType={node.type} value={node.parameters || {}} onChange={props.readOnly ? () => {} : onSchemaChange} />
      ) : (
        <>
          <textarea value={raw} onChange={(e) => setRaw(e.target.value)} style={{ width: '100%', height: 240 }} disabled={props.readOnly} />
          <div style={{ marginTop: 8 }}>
            <button onClick={save} disabled={props.readOnly}>{t('ndv.saveParameters')}</button>
          </div>
        </>
      )}
    </div>
  );
}