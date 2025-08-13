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

export type CanvasNode = Node;
export type CanvasEdge = Edge;

export default function Canvas(props: {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  onChange: (nodes: CanvasNode[], edges: CanvasEdge[]) => void;
  onSelectNode?: (nodeId?: string) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  fitViewOptions?: FitViewOptions;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(props.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.edges);
  const nodeStatus = useCanvasStore((s) => s.nodeStatus);
  const logsByNode = useLogsStore((s) => s.byNode);
  const rf = useReactFlow();

  useEffect(() => {
    if (props.fitViewOptions) rf.fitView(props.fitViewOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fitViewOptions]);

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
  }, [setEdges]);

  const onNodesChangeWrapped = useCallback((changes: any) => {
    onNodesChange(changes);
  }, [onNodesChange]);

  const onEdgesChangeWrapped = useCallback((changes: any) => {
    onEdgesChange(changes);
  }, [onEdgesChange]);

  const syncUp = useCallback(() => {
    props.onChange(nodes, edges);
  }, [nodes, edges, props.onChange]);

  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    const selected = params.nodes?.find((n) => n.selected);
    props.onSelectNode?.(selected?.id);
  }, [props.onSelectNode]);

  return (
    <div style={{ width: '100%', height: '100%' }} onMouseLeave={syncUp} onBlur={syncUp} onContextMenu={props.onContextMenu}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={displayNodes}
          edges={edges}
          onNodesChange={onNodesChangeWrapped}
          onEdgesChange={onEdgesChangeWrapped}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
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
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}