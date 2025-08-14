"use client";
import { useEffect } from 'react';
import { useCredentialsStore } from '../../../src3/stores/credentials';

export default function CredentialSelector(props: { value?: string; onChange: (id?: string) => void }) {
  const { items, list } = useCredentialsStore();
  useEffect(() => { void list(); }, [list]);
  return (
    <select value={props.value || ''} onChange={(e) => props.onChange(e.target.value || undefined)}>
      <option value="">No credential</option>
      {items.map((c) => (
        <option key={c.id} value={c.id}>{c.name}</option>
      ))}
    </select>
  );
}