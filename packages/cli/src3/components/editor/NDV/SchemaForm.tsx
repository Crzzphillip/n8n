"use client";
import { useEffect, useMemo, useState } from 'react';

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

type Param = { name: string; displayName: string; type: 'string' | 'number' | 'boolean'; default?: any };

export default function SchemaForm(props: { nodeType: string; value: Record<string, any>; onChange: (v: Record<string, any>) => void }) {
  const [schema, setSchema] = useState<Param[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await fetchJson<Param[]>(`/api/rest/node-types/${encodeURIComponent(props.nodeType)}/schema`);
        if (!cancelled) setSchema(s);
      } catch {
        if (!cancelled) setSchema([]);
      }
    })();
    return () => { cancelled = true; };
  }, [props.nodeType]);

  const set = (name: string, val: any) => {
    props.onChange({ ...props.value, [name]: val });
  };

  return (
    <div>
      {schema.map((p) => (
        <div key={p.name} style={{ marginBottom: 8 }}>
          <label>
            {p.displayName}
            {p.type === 'string' && (
              <input value={props.value[p.name] ?? ''} onChange={(e) => set(p.name, e.target.value)} />
            )}
            {p.type === 'number' && (
              <input type="number" value={props.value[p.name] ?? ''} onChange={(e) => set(p.name, Number(e.target.value))} />
            )}
            {p.type === 'boolean' && (
              <input type="checkbox" checked={!!props.value[p.name]} onChange={(e) => set(p.name, e.target.checked)} />
            )}
          </label>
        </div>
      ))}
    </div>
  );
}