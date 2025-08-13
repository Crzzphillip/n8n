"use client";
import { useState } from 'react';
import NDV from '../NDV/NodeDetailsView';
import { useCredentialsStore } from '../../../src3/stores/credentials';
import { useTagsStore } from '../../../src3/stores/tags';
import { useLogsStore } from '../../../src3/stores/logs';
import SettingsPanel from './SettingsPanel';

export default function RightPanel(props: { selectedNodeId?: string }) {
  const [tab, setTab] = useState<'ndv' | 'credentials' | 'tags' | 'logs' | 'settings'>('ndv');
  const { items: creds, list: listCreds } = useCredentialsStore();
  const { items: tags, list: listTags } = useTagsStore();
  const logs = useLogsStore((s) => (props.selectedNodeId ? s.byNode[props.selectedNodeId] || [] : []));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #eee', padding: 8 }}>
        <button onClick={() => setTab('ndv')}>Node</button>
        <button onClick={() => { setTab('credentials'); void listCreds(); }}>Credentials</button>
        <button onClick={() => { setTab('tags'); void listTags(); }}>Tags</button>
        <button onClick={() => setTab('logs')}>Logs</button>
        <button onClick={() => setTab('settings')}>Settings</button>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {tab === 'ndv' && <NDV selectedNodeId={props.selectedNodeId} />}
        {tab === 'credentials' && (
          <div style={{ padding: 12 }}>
            <ul>
              {creds.map((c) => (
                <li key={c.id}>{c.name} <small>({c.type})</small></li>
              ))}
            </ul>
          </div>
        )}
        {tab === 'tags' && (
          <div style={{ padding: 12 }}>
            <ul>
              {tags.map((t) => (
                <li key={t.id}>{t.name}</li>
              ))}
            </ul>
          </div>
        )}
        {tab === 'logs' && (
          <div style={{ padding: 12 }}>
            <ul>
              {logs.map((l, i) => (
                <li key={i}><small>{new Date(l.ts).toLocaleTimeString()}</small> [{l.level}] {l.message}</li>
              ))}
            </ul>
          </div>
        )}
        {tab === 'settings' && <SettingsPanel />}
      </div>
    </div>
  );
}