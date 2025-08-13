"use client";
import { useEffect } from 'react';
import { useUsersStore } from '../../../src3/stores/users';
import { useProjectsStore } from '../../../src3/stores/projects';
import { useSettingsStore } from '../../../src3/stores/settings';

export default function TopBar(props: { projectId?: string; onProjectChange?: (id: string) => void }) {
  const { me, fetchMe } = useUsersStore();
  const { items: projects, list: listProjects } = useProjectsStore();
  const { data: settings, fetch: fetchSettings } = useSettingsStore();

  useEffect(() => { void fetchMe(); void listProjects(); void fetchSettings(); }, [fetchMe, listProjects, fetchSettings]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <select value={props.projectId || ''} onChange={(e) => props.onProjectChange?.(e.target.value)}>
        <option value="">Select project</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <button onClick={() => alert(JSON.stringify(settings, null, 2))}>Settings</button>
      <div style={{ marginLeft: 'auto', color: '#666' }}>{me?.email || 'Guest'}</div>
    </div>
  );
}