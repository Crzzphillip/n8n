"use client";
import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  Connection,
  Edge,
  Node,
  OnSelectionChangeParams,
  useReactFlow,
  Panel,
  FitViewOptions,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useCanvasStore } from '../../../src3/stores/canvas';
import { useLogsStore } from '../../../src3/stores/logs';
import Tooltip from '../../ui/Tooltip';
import { canvasEventBus } from '../../../src3/event-bus/canvas';
import { useI18n } from '../../../src3/hooks/useI18n';

export type CanvasNode = Node;
export type CanvasEdge = Edge;

export default function Canvas(props: {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  onChange: (nodes: CanvasNode[], edges: CanvasEdge[]) => void;
  onSelectNode?: (nodeId?: string) => void;
  onSelectEdge?: (edge?: { source: string; target: string }) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  fitViewOptions?: FitViewOptions;
  onViewportChange?: (viewport: { x: number; y: number; zoom: number }, dimensions: { width: number; height: number }) => void;
  onPaneClick?: (position: { x: number; y: number }) => void;
  onCreateConnection?: (connection: { source: string; target: string }) => void;
  onCreateConnectionCancelled?: (start: { nodeId: string; handleId: string }, position: { x: number; y: number }, event?: MouseEvent | TouchEvent) => void;
  onNodeDoubleClick?: (nodeId: string, event: MouseEvent) => void;
  onRangeSelectionChange?: (active: boolean) => void;
  readOnly?: boolean;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(props.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.edges);
  const nodeStatus = useCanvasStore((s) => s.nodeStatus);
  const logsByNode = useLogsStore((s) => s.byNode);
  const rf = useReactFlow();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const connectStartRef = useRef<{ nodeId: string; handleId: string } | null>(null);
  const [contextMenu, setContextMenu] = React.useState<{ x: number; y: number; targetNodeId?: string } | null>(null);
  const { t } = useI18n();
  const onContextMenuLocal = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (props.readOnly) return;
    const target = (e.target as HTMLElement).closest('.react-flow__node');
    const nodeId = (target as any)?.getAttribute?.('data-id') || undefined;
    setContextMenu({ x: e.clientX, y: e.clientY, targetNodeId: nodeId });
  }, [props.readOnly]);

  useEffect(() => {
    if (props.fitViewOptions) rf.fitView(props.fitViewOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fitViewOptions]);

  // Subscribe to canvas event bus for fitView and nodes selection
  useEffect(() => {
    const offFitView = canvasEventBus.on('fitView', () => {
      try { rf.fitView(); } catch {}
    });
    const offSelect = canvasEventBus.on('nodes:select', ({ ids }: { ids: string[] }) => {
      setNodes((prev) => prev.map((n) => ({ ...n, selected: ids.includes(n.id) })));
      // sync up to parent
      props.onChange(nodes, edges);
    });
    return () => {
      offFitView?.();
      offSelect?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rf, setNodes, props.onChange]);

  // No explicit global keymap here; rely on ReactFlow + separate shortcuts. Emulate simple listeners for L/I/O keys.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'l' && !e.metaKey && !e.ctrlKey) {
        canvasEventBus.emit('logs:open');
      } else if (key === 'i' && !e.metaKey && !e.ctrlKey) {
        canvasEventBus.emit('logs:input-open');
      } else if (key === 'o' && !e.metaKey && !e.ctrlKey) {
        canvasEventBus.emit('logs:output-open');
      } else if (key === 'x' && e.altKey) {
        // Extract sub-workflow on selected nodes would be handled in NodeView
        // Emit a placeholder event or rely on NodeView's UI actions
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const displayNodes = useMemo(() => {
    return nodes.map((n) => {
      const status = nodeStatus[n.id] || 'idle';
      const color = status === 'running' ? '#0af' : status === 'success' ? '#0a0' : status === 'error' ? '#f33' : status === 'waiting' ? '#fa0' : '#999';
      const recent = (logsByNode[n.id] || []).slice(-1)[0]?.message;
      const stickyType = 'n8n-nodes-base.stickyNote';
      const isStickyNode = (n as any).type === stickyType;
      const isSticky = (n as any).data?.sticky === true || isStickyNode;
      const label = isSticky ? (
        <div style={{ background: '#fffa9c', padding: 8, border: '1px solid #e0d76b', borderRadius: 6, maxWidth: 220 }}>
          {n.data?.label}
        </div>
      ) : (
        <Tooltip content={recent || `Status: ${status}`}>
          <span>{n.data?.label} <span style={{ color, fontSize: 10, marginLeft: 6 }}>●</span></span>
        </Tooltip>
      );
      return { ...n, data: { ...n.data, label, sticky: isStickyNode } } as CanvasNode;
    });
  }, [nodes, nodeStatus, logsByNode]);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
    if (props.onCreateConnection && connection.source && connection.target) {
      props.onCreateConnection({ source: String(connection.source), target: String(connection.target) });
    }
  }, [setEdges, props]);

  const onNodesChangeWrapped = useCallback((changes: any) => {
    onNodesChange(changes);
    if (props.onRangeSelectionChange) {
      const hasSelection = Array.isArray(changes) && changes.some((c: any) => c.type === 'select' && c.selected === true);
      props.onRangeSelectionChange(hasSelection);
    }
  }, [onNodesChange, props]);

  const onEdgesChangeWrapped = useCallback((changes: any) => {
    onEdgesChange(changes);
  }, [onEdgesChange]);

  const syncUp = useCallback(() => {
    props.onChange(nodes, edges);
  }, [nodes, edges, props.onChange]);

  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    const selected = params.nodes?.find((n) => n.selected);
    props.onSelectNode?.(selected?.id);
    const selectedEdge = params.edges?.find((e) => (e as any).selected);
    if (selectedEdge && props.onSelectEdge) {
      props.onSelectEdge({ source: String(selectedEdge.source), target: String(selectedEdge.target) });
    } else if (props.onSelectEdge) {
      props.onSelectEdge(undefined);
    }
    // Report selection range presence
    const hasRange = (params.nodes || []).filter((n) => n.selected).length > 1;
    canvasEventBus.emit('nodes:select', { ids: (params.nodes || []).filter((n) => n.selected).map((n) => String(n.id)) });
    props.onRangeSelectionChange?.(hasRange);
    if (!hasRange) {
      try {
        const center = rf.project({ x: (rf as any).toObject().x + 100, y: (rf as any).toObject().y + 100 });
        canvasEventBus.emit('selection:end', center as any);
      } catch {}
    }
  }, [props.onSelectNode, props.onSelectEdge, props.onRangeSelectionChange, rf]);

  const handleMove = useCallback((_evt: any, viewport: { x: number; y: number; zoom: number }) => {
    if (!props.onViewportChange) return;
    const rect = containerRef.current?.getBoundingClientRect();
    const dimensions = { width: rect?.width ?? 0, height: rect?.height ?? 0 };
    props.onViewportChange(viewport, dimensions);
  }, [props.onViewportChange]);

  const handlePaneClick = useCallback((evt: React.MouseEvent) => {
    if (!props.onPaneClick) return;
    try {
      const pos = rf.screenToFlowPosition({ x: (evt as any).clientX, y: (evt as any).clientY });
      props.onPaneClick(pos as any);
    } catch {}
  }, [props.onPaneClick, rf]);

  const onConnectStart = useCallback((event: any, params: any) => {
    connectStartRef.current = { nodeId: String(params.nodeId), handleId: String(params.handleId) };
  }, []);

  const onConnectEnd = useCallback((event: MouseEvent | TouchEvent) => {
    try {
      const target = event.target as HTMLElement;
      const isPane = target?.classList?.contains('react-flow__pane');
      if (isPane && props.onCreateConnectionCancelled && connectStartRef.current) {
        const pt = 'clientX' in event ? { x: (event as MouseEvent).clientX, y: (event as MouseEvent).clientY } : { x: (event as TouchEvent).changedTouches[0].clientX, y: (event as TouchEvent).changedTouches[0].clientY };
        const pos = rf.screenToFlowPosition(pt);
        props.onCreateConnectionCancelled(connectStartRef.current, pos as any, event);
      }
    } finally {
      connectStartRef.current = null;
    }
  }, [props, rf]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', background: props.readOnly ? 'repeating-linear-gradient(45deg,#fafafa,#fafafa 10px,#f0f0f0 10px,#f0f0f0 20px)' : undefined }} onMouseLeave={syncUp} onBlur={syncUp} onContextMenu={onContextMenuLocal}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={displayNodes}
          edges={edges}
          onNodesChange={onNodesChangeWrapped}
          onEdgesChange={onEdgesChangeWrapped}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onSelectionChange={onSelectionChange}
          onMove={handleMove}
          onPaneClick={handlePaneClick}
          onNodeDoubleClick={(e, node) => props.onNodeDoubleClick?.(String((node as any).id), e as any)}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <MiniMap />
          <Controls showInteractive />
          <Background gap={16} />
          <Panel position="top-right">
            <button onClick={() => rf.zoomIn()}>+</button>
            <button onClick={() => rf.zoomOut()}>-</button>
            <button onClick={() => rf.fitView()}>Fit</button>
            <button onClick={() => canvasEventBus.emit('toggle:focus-panel')}>Toggle Focus</button>
            <button onClick={() => canvasEventBus.emit('create:sticky')}>Sticky</button>
            <button onClick={() => canvasEventBus.emit('create:node', { source: 'plus' })}>+</button>
            <button onClick={() => canvasEventBus.emit('click:connection:add', { source: 'node', target: undefined })}>Add Conn</button>
            <button onClick={() => canvasEventBus.emit('logs:open')}>Logs Open</button>
            <button onClick={() => canvasEventBus.emit('logs:close')}>Logs Close</button>
            <button onClick={() => canvasEventBus.emit('logs:input-open')}>Logs Input</button>
            <button onClick={() => canvasEventBus.emit('logs:output-open')}>Logs Output</button>
            <button onClick={() => canvasEventBus.emit('nodes:action', { ids: (nodes.filter(n => (n as any).data?.sticky).map(n => n.id)), action: 'update:sticky:color' })}>Sticky Color</button>
          </Panel>
        </ReactFlow>
        {contextMenu && (
          <div style={{ position: 'fixed', left: contextMenu.x, top: contextMenu.y, background: '#fff', border: '1px solid #ccc', borderRadius: 6, padding: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <button disabled={props.readOnly} onClick={() => { canvasEventBus.emit('create:node', { source: 'context_menu' } as any); setContextMenu(null); }}>{t('nodeView.buttons.addNode')}</button>
              <button disabled={props.readOnly} onClick={() => { canvasEventBus.emit('create:sticky'); setContextMenu(null); }}>{t('nodeView.buttons.addSticky')}</button>
              <button onClick={() => { canvasEventBus.emit('copy:nodes', contextMenu.targetNodeId ? [contextMenu.targetNodeId] : [] as any); setContextMenu(null); }}>{t('nodeView.success.copied')}</button>
              <button disabled={props.readOnly} onClick={() => { canvasEventBus.emit('delete:nodes', contextMenu.targetNodeId ? [contextMenu.targetNodeId] : [] as any); setContextMenu(null); }}>{t('nodeView.buttons.deleteNodeConfirm')}</button>
              <button disabled={props.readOnly} onClick={() => { canvasEventBus.emit('duplicate:nodes', contextMenu.targetNodeId ? [contextMenu.targetNodeId] : [] as any); setContextMenu(null); }}>{t('nodeView.buttons.duplicate')}</button>
              <button disabled={props.readOnly} onClick={() => { canvasEventBus.emit('update:nodes:pin', contextMenu.targetNodeId ? [contextMenu.targetNodeId] : [] as any); setContextMenu(null); }}>{t('nodeView.buttons.pin')}</button>
              <button disabled={props.readOnly} onClick={() => { canvasEventBus.emit('run:node', { nodeId: contextMenu.targetNodeId } as any); setContextMenu(null); }}>{t('nodeView.buttons.run')}</button>
              <button disabled={props.readOnly} onClick={() => { canvasEventBus.emit('update:node:name', contextMenu.targetNodeId as any); setContextMenu(null); }}>{t('nodeView.buttons.rename')}</button>
              <button disabled={props.readOnly} onClick={() => { canvasEventBus.emit('tidyUp', { source: 'context-menu' } as any); setContextMenu(null); }}>{t('nodeView.buttons.tidyUp')}</button>
              <button disabled={props.readOnly} onClick={() => { canvasEventBus.emit('extract-workflow', contextMenu.targetNodeId ? [contextMenu.targetNodeId] : [] as any); setContextMenu(null); }}>{t('nodeView.buttons.extract')}</button>
              <button disabled={props.readOnly} onClick={() => { canvasEventBus.emit('nodes:action', { ids: contextMenu.targetNodeId ? [contextMenu.targetNodeId] : nodes.filter(n => (n as any).data?.sticky).map(n => n.id), action: 'update:sticky:color' }); setContextMenu(null); }}>{t('nodeView.labels.stickyChangeColor')}</button>
              <div style={{ display: 'flex', gap: 6 }}>
                {[0,1,2,3].map((c) => (
                  <button key={c} disabled={props.readOnly} onClick={() => { canvasEventBus.emit('nodes:action', { ids: contextMenu.targetNodeId ? [contextMenu.targetNodeId] : nodes.filter(n => (n as any).data?.sticky).map(n => n.id), action: 'update:sticky:color', color: c }); setContextMenu(null); }} style={{ width: 16, height: 16, background: ['#f66','#6f6','#66f','#fc3'][c], border: '1px solid #999', borderRadius: 3 }} />
                ))}
              </div>
              <button onClick={() => setContextMenu(null)}>{t('nodeView.labels.close')}</button>
            </div>
          </div>
        )}
      </ReactFlowProvider>
    </div>
  );
}