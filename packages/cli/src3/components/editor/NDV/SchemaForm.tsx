"use client";
import { useEffect, useMemo, useState } from 'react';
import CredentialSelector from './CredentialSelector';

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

type Option = { name: string; value: string; description?: string; options?: Param[] };

type Param = {
  name: string;
  displayName: string;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'options' | 'collection' | 'fixedCollection' | 'credentials';
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
    const next = { ...props.value, [name]: val };
    props.onChange(next);
  };

  const [dynamicOptions, setDynamicOptions] = useState<Record<string, Option[]>>({});

  const resolveOptions = async (param: Param) => {
    // Example: param.typeOptions?.optionsMeta to indicate loadOptions; real metadata shape depends on backend
    if ((param as any).loadOptions) {
      try {
        const body = {
          nodeTypeAndVersion: { name: props.nodeType, version: 1 },
          currentNodeParameters: props.value,
          credentials: props.value.credentials ? { id: props.value.credentials } : undefined,
          loadOptions: (param as any).loadOptions,
          path: param.name,
        };
        const res = await fetch('/api/rest/dynamic-node-parameters/options', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
        if (res.ok) {
          const list = await res.json();
          setDynamicOptions((prev) => ({ ...prev, [param.name]: list.map((x: any) => ({ name: x.name, value: x.value })) }));
        }
      } catch {}
    }
  };

  useEffect(() => {
    // Recompute dynamic options when values change (debounced in real impl)
    schema.forEach((p) => void resolveOptions(p));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value, props.nodeType]);

  const renderGroup = (params: Param[], pathPrefix = '') => (
    params.map((child) => renderParam(child, pathPrefix))
  );

  const renderParam = (p: Param, pathPrefix = '') => {
    if (!shouldShow(p, props.value)) return null;
    const name = pathPrefix ? `${pathPrefix}.${p.name}` : p.name;
    const label = p.displayName;
    const value = props.value[p.name];

    // Resource/operation convenience: options
    if (p.type === 'options' && (p.name === 'resource' || p.name === 'operation')) {
      const options = dynamicOptions[p.name] || p.options || [];
      return (
        <div key={name} style={{ marginBottom: 8 }}>
          <label title={p.description || ''}>{label}
            <select value={value ?? ''} onChange={(e) => set(p.name, e.target.value)}>
              <option value="">Select</option>
              {options.map((o) => <option key={o.value} value={o.value}>{o.name}</option>)}
            </select>
          </label>
        </div>
      );
    }

    if (p.type === 'string') return (
      <div key={name} style={{ marginBottom: 8 }}>
        <label title={p.description || ''}>{label}<input value={value ?? ''} onChange={(e) => set(p.name, e.target.value)} /></label>
      </div>
    );
    if (p.type === 'number') return (
      <div key={name} style={{ marginBottom: 8 }}>
        <label title={p.description || ''}>{label}<input type="number" value={value ?? ''} onChange={(e) => set(p.name, Number(e.target.value))} /></label>
      </div>
    );
    if (p.type === 'boolean') return (
      <div key={name} style={{ marginBottom: 8 }}>
        <label title={p.description || ''}>{label}<input type="checkbox" checked={!!value} onChange={(e) => set(p.name, e.target.checked)} /></label>
      </div>
    );
    if (p.type === 'credentials') return (
      <div key={name} style={{ marginBottom: 8 }}>
        <label title={p.description || ''}>{label} <CredentialSelector value={value} onChange={(id) => set(p.name, id)} /></label>
      </div>
    );
    if (p.type === 'options') {
      const options = dynamicOptions[p.name] || p.options || [];
      return (
        <div key={name} style={{ marginBottom: 8 }}>
          <label title={p.description || ''}>{label}
            <select value={value ?? ''} onChange={(e) => set(p.name, e.target.value)}>
              <option value="">Select</option>
              {options.map((o) => <option key={o.value} value={o.value}>{o.name}</option>)}
            </select>
          </label>
          {/* Option-dependent children */}
          {p.options?.find((o) => o.value === value)?.options && (
            <div style={{ marginLeft: 12, marginTop: 8 }}>
              {renderGroup(p.options!.find((o) => o.value === value)!.options!, name)}
            </div>
          )}
        </div>
      );
    }
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
          <details key={group.name} open>
            <summary>{group.displayName}</summary>
            <div style={{ marginLeft: 12 }}>
              {group.values.map((child) => renderParam(child, name))}
            </div>
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