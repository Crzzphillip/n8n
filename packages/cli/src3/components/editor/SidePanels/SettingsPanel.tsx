"use client";
import { useEffect, useState } from 'react';
import { useSettingsStore } from '../../../src3/stores/settings';

async function patchJson<T>(url: string, body: any): Promise<T> {
  const res = await fetch(url, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

export default function SettingsPanel() {
  const { data, fetch } = useSettingsStore();
  const [restBase, setRestBase] = useState('rest');

  useEffect(() => { void fetch(); }, [fetch]);

  const onApplyRestBase = async () => {
    await fetch('/api/config/rest', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ rest: restBase }) });
    alert('REST base updated (client)');
  };

  return (
    <div style={{ padding: 12 }}>
      <h4>Settings</h4>
      <div style={{ marginBottom: 8 }}>
        <label>REST base path <input value={restBase} onChange={(e) => setRestBase(e.target.value)} /> <button onClick={onApplyRestBase}>Apply</button></label>
      </div>
      <pre style={{ background: '#f8f8f8', padding: 8 }}>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}