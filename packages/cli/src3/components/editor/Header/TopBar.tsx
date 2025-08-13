"use client";
import { useEffect } from 'react';
import { useUsersStore } from '../../../src3/stores/users';
import { useProjectsStore } from '../../../src3/stores/projects';
import { useSettingsStore } from '../../../src3/stores/settings';
import { useModal } from '../../ui/ModalManager';
import { useWorkflowStore } from '../../../src3/stores/workflows';

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

export default function TopBar(props: { projectId?: string; onProjectChange?: (id: string) => void }) {
  const { me, fetchMe } = useUsersStore();
  const { items: projects, list: listProjects } = useProjectsStore();
  const { data: settings, fetch: fetchSettings } = useSettingsStore();
  const modal = useModal();
  const wf = useWorkflowStore((s) => s.current);
  const setWf = useWorkflowStore.setState;

  useEffect(() => { void fetchMe(); void listProjects(); void fetchSettings(); }, [fetchMe, listProjects, fetchSettings]);

  const onSaveAs = async () => {
    if (!wf) return;
    const name = await modal.prompt('Save workflow as', `${wf.name} (copy)`);
    if (!name) return;
    const payload = { ...wf, id: undefined, name } as any;
    const created = await fetchJson<{ id: string }>(`/api/rest/workflows`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    modal.open(<div>Saved as: {name} (id: {created.id})</div>);
  };

  const onImport = async () => {
    let text = '';
    modal.open(
      <div>
        <h4>Import workflow</h4>
        <p>Paste workflow JSON:</p>
        <textarea style={{ width: 380, height: 180 }} onChange={(e) => (text = e.target.value)} />
        <div style={{ marginTop: 8 }}>
          <button onClick={async () => {
            try {
              const obj = JSON.parse(text);
              const created = await fetchJson<{ id: string }>(`/api/rest/workflows`, {
                method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(obj),
              });
              modal.open(<div>Imported workflow id: {created.id}</div>);
            } catch (e: any) {
              modal.open(<div>Import failed: {e?.message}</div>);
            }
          }}>Import</button>
          <button onClick={() => modal.close()} style={{ marginLeft: 8 }}>Close</button>
        </div>
      </div>,
    );
  };

  const onExport = async () => {
    if (!wf?.id) { modal.open(<div>Save workflow before exporting.</div>); return; }
    const data = await fetchJson<any>(`/api/rest/workflows/${wf.id}`);
    const pretty = JSON.stringify(data, null, 2);
    modal.open(
      <div>
        <h4>Export workflow</h4>
        <textarea readOnly style={{ width: 380, height: 180 }} value={pretty} />
        <div style={{ marginTop: 8 }}>
          <button onClick={() => navigator.clipboard.writeText(pretty)}>Copy</button>
          <button onClick={() => modal.close()} style={{ marginLeft: 8 }}>Close</button>
        </div>
      </div>,
    );
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <select value={props.projectId || ''} onChange={(e) => props.onProjectChange?.(e.target.value)}>
        <option value="">Select project</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <button onClick={() => alert(JSON.stringify(settings, null, 2))}>Settings</button>
      <button onClick={onSaveAs}>Save As</button>
      <button onClick={onImport}>Import</button>
      <button onClick={onExport}>Export</button>
      <div style={{ marginLeft: 'auto', color: '#666' }}>{me?.email || 'Guest'}</div>
    </div>
  );
}