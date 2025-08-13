"use client";
import React, { createContext, useContext, useMemo, useState } from 'react';
import Modal from './Modal';

type ModalContextType = {
  confirm: (msg: string) => Promise<boolean>;
  prompt: (msg: string, def?: string) => Promise<string | undefined>;
  open: (content: React.ReactNode) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('ModalProvider missing');
  return ctx;
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [openState, setOpenState] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [resolver, setResolver] = useState<((v: any) => void) | null>(null);

  const api: ModalContextType = useMemo(() => ({
    confirm(msg) {
      setOpenState(true);
      return new Promise<boolean>((resolve) => {
        setContent(
          <div>
            <p>{msg}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setOpenState(false); resolve(true); }}>OK</button>
              <button onClick={() => { setOpenState(false); resolve(false); }}>Cancel</button>
            </div>
          </div>,
        );
        setResolver(() => resolve);
      });
    },
    prompt(msg, def) {
      setOpenState(true);
      let val = def || '';
      return new Promise<string | undefined>((resolve) => {
        setContent(
          <div>
            <p>{msg}</p>
            <input defaultValue={val} onChange={(e) => (val = e.target.value)} />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button onClick={() => { setOpenState(false); resolve(val); }}>OK</button>
              <button onClick={() => { setOpenState(false); resolve(undefined); }}>Cancel</button>
            </div>
          </div>,
        );
        setResolver(() => resolve);
      });
    },
    open(node) {
      setContent(node);
      setOpenState(true);
    },
    close() {
      setOpenState(false);
      setResolver(null);
    },
  }), []);

  return (
    <ModalContext.Provider value={api}>
      {children}
      <Modal open={openState} onClose={() => { setOpenState(false); resolver?.(undefined); }}>
        {content}
      </Modal>
    </ModalContext.Provider>
  );
}