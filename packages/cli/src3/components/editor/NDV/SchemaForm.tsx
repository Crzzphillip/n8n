"use client";
import { useEffect, useMemo, useState } from 'react';

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

type Option = { name: string; value: string };

type Param = {
  name: string;
  displayName: string;
  type: 'string' | 'number' | 'boolean' | 'options' | 'collection' | 'fixedCollection';
  default?: any;
  options?: Option[]; // for options
  // For collection/fixedCollection
  typeOptions?: {
    multipleValues?: boolean;
    multipleValueButtonText?: string;
    options?: Array<{
      name: string;
      displayName: string;
      values: Param[];
    }>;
  };
  displayOptions?: { show?: Record<string, any>; hide?: Record<string, any> };
};

function shouldShow(param: Param, values: Record<string, any>) {
  const show = param.displayOptions?.show;
  const hide = param.displayOptions?.hide;
  if (show) {
    for (const key of Object.keys(show)) {
      const allowed = Array.isArray(show[key]) ? show[key] : [show[key]];
      if (!allowed.includes(values[key])) return false;
    }
  }
  if (hide) {
    for (const key of Object.keys(hide)) {
      const disallowed = Array.isArray(hide[key]) ? hide[key] : [hide[key]];
      if (disallowed.includes(values[key])) return false;
    }
  }
  return true;
}

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

  const renderParam = (p: Param, pathPrefix = '') => {
    if (!shouldShow(p, props.value)) return null;
    const name = pathPrefix ? `${pathPrefix}.${p.name}` : p.name;
    const label = p.displayName;
    const value = props.value[p.name];

    if (p.type === 'string') return (
      <div key={name} style={{ marginBottom: 8 }}>
        <label>{label}<input value={value ?? ''} onChange={(e) => set(p.name, e.target.value)} /></label>
      </div>
    );
    if (p.type === 'number') return (
      <div key={name} style={{ marginBottom: 8 }}>
        <label>{label}<input type="number" value={value ?? ''} onChange={(e) => set(p.name, Number(e.target.value))} /></label>
      </div>
    );
    if (p.type === 'boolean') return (
      <div key={name} style={{ marginBottom: 8 }}>
        <label>{label}<input type="checkbox" checked={!!value} onChange={(e) => set(p.name, e.target.checked)} /></label>
      </div>
    );
    if (p.type === 'options') return (
      <div key={name} style={{ marginBottom: 8 }}>
        <label>{label}
          <select value={value ?? ''} onChange={(e) => set(p.name, e.target.value)}>
            <option value="">Select</option>
            {p.options?.map((o) => <option key={o.value} value={o.value}>{o.name}</option>)}
          </select>
        </label>
      </div>
    );
    if (p.type === 'collection') return (
      <fieldset key={name} style={{ marginBottom: 8 }}>
        <legend>{label}</legend>
        {p.typeOptions?.options?.flatMap((opt) => opt.values).map((child) => renderParam(child, name))}
      </fieldset>
    );
    if (p.type === 'fixedCollection') return (
      <fieldset key={name} style={{ marginBottom: 8 }}>
        <legend>{label}</legend>
        {p.typeOptions?.options?.map((group) => (
          <details key={group.name}>
            <summary>{group.displayName}</summary>
            {group.values.map((child) => renderParam(child, name))}
          </details>
        ))}
      </fieldset>
    );
    return null;
  };

  return (
    <div>
      {schema.map((p) => renderParam(p))}
    </div>
  );
}