"use client";
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Modal(props: { open: boolean; onClose?: () => void; children: React.ReactNode }) {
  const el = useRef<HTMLElement | null>(null);
  if (typeof window === 'undefined') return null;
  if (!el.current) {
    el.current = document.createElement('div');
    el.current.className = 'modal-root';
  }
  useEffect(() => {
    const root = document.body;
    root.appendChild(el.current!);
    return () => { root.removeChild(el.current!); };
  }, []);
  if (!props.open) return null;
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={props.onClose}>
      <div style={{ background: '#fff', padding: 16, minWidth: 320 }} onClick={(e) => e.stopPropagation()}>
        {props.children}
      </div>
    </div>,
    el.current as any,
  );
}