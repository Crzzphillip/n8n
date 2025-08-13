"use client";
import { useEffect } from 'react';
import { useUsersStore } from '../../../src3/stores/users';
import { useProjectsStore } from '../../../src3/stores/projects';
import { useSettingsStore } from '../../../src3/stores/settings';
import { useModal } from '../../ui/ModalManager';

export default function TopBar(props: { projectId?: string; onProjectChange?: (id: string) => void }) {
  const { me, fetchMe } = useUsersStore();
  const { items: projects, list: listProjects } = useProjectsStore();
  const { data: settings, fetch: fetchSettings } = useSettingsStore();
  const modal = useModal();

  useEffect(() => { void fetchMe(); void listProjects(); void fetchSettings(); }, [fetchMe, listProjects, fetchSettings]);

  const onSaveAs = async () => {
    const name = await modal.prompt('Save workflow as', 'Copy of workflow');
    if (!name) return;
    // TODO: emit save-as action
    modal.open(<div>Saved as: {name}</div>);
  };

  const onImport = async () => {
    modal.open(
      <div>
        <h4>Import workflow</h4>
        <p>Paste workflow JSON:</p>
        <textarea style={{ width: 380, height: 180 }} />
        <div style={{ marginTop: 8 }}>
          <button onClick={() => modal.close()}>Close</button>
        </div>
      </div>,
    );
  };

  const onExport = async () => {
    modal.open(
      <div>
        <h4>Export workflow</h4>
        <p>The exported JSON will be shown here.</p>
        <div style={{ marginTop: 8 }}>
          <button onClick={() => modal.close()}>Close</button>
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