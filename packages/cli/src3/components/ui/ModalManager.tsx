"use client";
import React, { createContext, useContext, useMemo, useState } from 'react';
import Modal from './Modal';

type ModalContextType = {
  confirm: (msg: string) => Promise<boolean>;
  prompt: (msg: string, def?: string) => Promise<string | undefined>;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('ModalProvider missing');
  return ctx;
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [resolver, setResolver] = useState<((v: any) => void) | null>(null);

  const api: ModalContextType = useMemo(() => ({
    confirm(msg) {
      setOpen(true);
      return new Promise<boolean>((resolve) => {
        setContent(
          <div>
            <p>{msg}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setOpen(false); resolve(true); }}>OK</button>
              <button onClick={() => { setOpen(false); resolve(false); }}>Cancel</button>
            </div>
          </div>,
        );
        setResolver(() => resolve);
      });
    },
    prompt(msg, def) {
      setOpen(true);
      let val = def || '';
      return new Promise<string | undefined>((resolve) => {
        setContent(
          <div>
            <p>{msg}</p>
            <input defaultValue={val} onChange={(e) => (val = e.target.value)} />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button onClick={() => { setOpen(false); resolve(val); }}>OK</button>
              <button onClick={() => { setOpen(false); resolve(undefined); }}>Cancel</button>
            </div>
          </div>,
        );
        setResolver(() => resolve);
      });
    },
  }), []);

  return (
    <ModalContext.Provider value={api}>
      {children}
      <Modal open={open} onClose={() => { setOpen(false); resolver?.(undefined); }}>
        {content}
      </Modal>
    </ModalContext.Provider>
  );
}