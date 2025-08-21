"use client";
import { useEffect, useRef, useState } from 'react';

export default function Tooltip(props: { content: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <div ref={ref} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} style={{ position: 'relative', display: 'inline-block' }}>
      {props.children}
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', background: '#333', color: '#fff', padding: '4px 8px', borderRadius: 4, whiteSpace: 'nowrap', marginTop: 4 }}>
          {props.content}
        </div>
      )}
    </div>
  );
}