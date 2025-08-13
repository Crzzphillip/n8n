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
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(props.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.edges);
  const nodeStatus = useCanvasStore((s) => s.nodeStatus);
  const logsByNode = useLogsStore((s) => s.byNode);
  const rf = useReactFlow();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const connectStartRef = useRef<{ nodeId: string; handleId: string } | null>(null);

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

  const displayNodes = useMemo(() => {
    return nodes.map((n) => {
      const status = nodeStatus[n.id] || 'idle';
      const color = status === 'running' ? '#0af' : status === 'success' ? '#0a0' : status === 'error' ? '#f33' : status === 'waiting' ? '#fa0' : '#999';
      const recent = (logsByNode[n.id] || []).slice(-1)[0]?.message;
      const isSticky = (n as any).data?.sticky === true;
      const label = isSticky ? (
        <div style={{ background: '#fffa9c', padding: 8, border: '1px solid #e0d76b', borderRadius: 6, maxWidth: 220 }}>
          {n.data?.label}
        </div>
      ) : (
        <Tooltip content={recent || `Status: ${status}`}>
          <span>{n.data?.label} <span style={{ color, fontSize: 10, marginLeft: 6 }}>●</span></span>
        </Tooltip>
      );
      return { ...n, data: { ...n.data, label } } as CanvasNode;
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
  }, [props.onSelectNode, props.onSelectEdge, props.onRangeSelectionChange]);

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
    <div ref={containerRef} style={{ width: '100%', height: '100%' }} onMouseLeave={syncUp} onBlur={syncUp} onContextMenu={props.onContextMenu}>
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
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}