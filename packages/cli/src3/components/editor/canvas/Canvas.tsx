"use client";
import React, { useCallback } from 'react';
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
} from 'reactflow';
import 'reactflow/dist/style.css';

export type CanvasNode = Node;
export type CanvasEdge = Edge;

export default function Canvas(props: {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  onChange: (nodes: CanvasNode[], edges: CanvasEdge[]) => void;
  onSelectNode?: (nodeId?: string) => void;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(props.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.edges);

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
    <div style={{ width: '100%', height: '100%' }} onMouseLeave={syncUp} onBlur={syncUp}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChangeWrapped}
          onEdgesChange={onEdgesChangeWrapped}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background gap={16} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}