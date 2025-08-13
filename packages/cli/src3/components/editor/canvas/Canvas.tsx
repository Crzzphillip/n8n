"use client";
import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
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
  OnConnectStartParams,
  OnConnectEndParams,
  NodeDragHandler,
  OnNodesDelete,
  OnEdgesDelete,
  OnMove,
  OnMoveStart,
  OnMoveEnd,
  OnSelectionDragStart,
  OnSelectionDrag,
  OnSelectionDragStop,
  ReactFlowInstance,
  Viewport,
  XYPosition,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useCanvasStore } from '../../../src3/stores/canvas';
import { useLogsStore } from '../../../src3/stores/logs';
import { useCanvasOperations } from '../../../src3/hooks/useCanvasOperations';
import { useNodeCreatorStore } from '../../../src3/stores/nodeCreator';
import { useHistoryStore } from '../../../src3/stores/history';
import { useKeyboardShortcuts } from '../../../src3/hooks/useKeyboardShortcuts';
import { 
  getMousePosition, 
  snapToGrid, 
  getBoundsFromViewport,
  GRID_SIZE,
  type ViewportBoundaries 
} from '../../../src3/utils/nodeViewUtils';
import { canvasEventBus } from '../../../src3/utils/eventBus';
import Tooltip from '../../ui/Tooltip';

export type CanvasNode = Node;
export type CanvasEdge = Edge;

export type CanvasProps = {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  onChange: (nodes: CanvasNode[], edges: CanvasEdge[]) => void;
  onSelectNode?: (nodeId?: string) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  fitViewOptions?: FitViewOptions;
  readOnly?: boolean;
  executing?: boolean;
  keyBindings?: boolean;
  onNodeDragStart?: NodeDragHandler;
  onNodeDrag?: NodeDragHandler;
  onNodeDragStop?: NodeDragHandler;
  onConnectStart?: (params: OnConnectStartParams) => void;
  onConnectEnd?: (params: OnConnectEndParams) => void;
  onNodesDelete?: OnNodesDelete;
  onEdgesDelete?: OnEdgesDelete;
  onMove?: OnMove;
  onMoveStart?: OnMoveStart;
  onMoveEnd?: OnMoveEnd;
  onSelectionDragStart?: OnSelectionDragStart;
  onSelectionDrag?: OnSelectionDrag;
  onSelectionDragStop?: OnSelectionDragStop;
  onPaneClick?: (e: React.MouseEvent) => void;
  onPaneContextMenu?: (e: React.MouseEvent) => void;
  onNodeClick?: (e: React.MouseEvent, node: Node) => void;
  onNodeDoubleClick?: (e: React.MouseEvent, node: Node) => void;
  onEdgeClick?: (e: React.MouseEvent, edge: Edge) => void;
  onSelectionEnd?: (e: React.MouseEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
};

export default function Canvas(props: CanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(props.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.edges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [selectionStart, setSelectionStart] = useState<XYPosition | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const canvasStore = useCanvasStore();
  const logsStore = useLogsStore();
  const canvasOperations = useCanvasOperations();
  const nodeCreatorStore = useNodeCreatorStore();
  const historyStore = useHistoryStore();
  const rf = useReactFlow();

  const nodeStatus = canvasStore.nodeStatus;
  const logs = logsStore.logs;
  const selectedNodeIds = Array.from(canvasStore.selectedNodeIds);

  // Update canvas store with viewport and dimensions
  useEffect(() => {
    canvasStore.setViewport(viewport);
    canvasStore.setDimensions(dimensions);
  }, [viewport, dimensions, canvasStore]);

  // Fit view effect
  useEffect(() => {
    if (props.fitViewOptions && reactFlowInstance) {
      reactFlowInstance.fitView(props.fitViewOptions);
    }
  }, [props.fitViewOptions, reactFlowInstance]);

  // Listen for canvas events
  useEffect(() => {
    const handleFitView = () => {
      if (reactFlowInstance) {
        reactFlowInstance.fitView();
      }
    };

    const handleNodesSelect = (data: { ids: string[] }) => {
      canvasStore.setSelectedNodeIds(data.ids);
    };

    const handleTidyUp = (data: { source: string; nodeIdsFilter?: string[] }) => {
      canvasOperations.tidyUp(data);
    };

    canvasEventBus.on('fitView', handleFitView);
    canvasEventBus.on('nodes:select', handleNodesSelect);
    canvasEventBus.on('tidyUp', handleTidyUp);

    return () => {
      canvasEventBus.off('fitView', handleFitView);
      canvasEventBus.off('nodes:select', handleNodesSelect);
      canvasEventBus.off('tidyUp', handleTidyUp);
    };
  }, [reactFlowInstance, canvasStore, canvasOperations]);

  // Enhanced node display with status and logs
  const displayNodes = useMemo(() => {
    return nodes.map((n) => {
      const status = nodeStatus[n.id] || 'idle';
      const color = status === 'running' ? '#0af' : status === 'success' ? '#0a0' : status === 'error' ? '#f33' : status === 'waiting' ? '#fa0' : '#999';
      
      const nodeLogs = logs.filter(log => log.nodeId === n.id);
      const recentLog = nodeLogs[nodeLogs.length - 1];
      
      const isSticky = (n as any).data?.sticky === true;
      const isSelected = selectedNodeIds.includes(n.id);
      const isDisabled = (n as any).data?.disabled === true;
      const isPinned = (n as any).data?.pinned === true;

      const label = isSticky ? (
        <div style={{ 
          background: '#fffa9c', 
          padding: 8, 
          border: '1px solid #e0d76b', 
          borderRadius: 6, 
          maxWidth: 220,
          opacity: isDisabled ? 0.5 : 1 
        }}>
          {n.data?.label}
        </div>
      ) : (
        <Tooltip content={recentLog?.message || `Status: ${status}`}>
          <span style={{ opacity: isDisabled ? 0.5 : 1 }}>
            {n.data?.label} 
            <span style={{ color, fontSize: 10, marginLeft: 6 }}>●</span>
            {isPinned && <span style={{ color: '#f90', fontSize: 10, marginLeft: 4 }}>📌</span>}
          </span>
        </Tooltip>
      );

      return { 
        ...n, 
        data: { 
          ...n.data, 
          label,
          selected: isSelected,
          disabled: isDisabled,
          pinned: isPinned,
        },
        style: {
          ...n.style,
          opacity: isDisabled ? 0.5 : 1,
          border: isSelected ? '2px solid #0af' : isPinned ? '2px solid #f90' : n.style?.border,
        }
      } as CanvasNode;
    });
  }, [nodes, nodeStatus, logs, selectedNodeIds]);

  // Enhanced connection handling
  const onConnect = useCallback((connection: Connection) => {
    if (props.readOnly) return;

    const newEdge = addEdge(connection, edges);
    setEdges(newEdge);

    // Create connection using canvas operations
    canvasOperations.createConnection({
      source: connection.source!,
      sourceHandle: connection.sourceHandle || 'output',
      target: connection.target!,
      targetHandle: connection.targetHandle || 'input',
      data: connection.data,
    });
  }, [edges, setEdges, props.readOnly, canvasOperations]);

  // Enhanced node change handling with grid snapping
  const onNodesChangeWrapped = useCallback((changes: any) => {
    const processedChanges = changes.map((change: any) => {
      if (change.type === 'position' && change.position) {
        // Snap to grid
        const snappedPosition = snapToGrid(change.position);
        return { ...change, position: snappedPosition };
      }
      return change;
    });

    onNodesChange(processedChanges);
  }, [onNodesChange]);

  // Enhanced edge change handling
  const onEdgesChangeWrapped = useCallback((changes: any) => {
    onEdgesChange(changes);
  }, [onEdgesChange]);

  // Sync changes back to parent
  const syncUp = useCallback(() => {
    props.onChange(nodes, edges);
  }, [nodes, edges, props.onChange]);

  // Enhanced selection handling
  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    const selected = params.nodes?.find((n) => n.selected);
    props.onSelectNode?.(selected?.id);
    
    // Update canvas store selection
    const selectedIds = params.nodes?.filter(n => n.selected).map(n => n.id) || [];
    canvasStore.setSelectedNodeIds(selectedIds);
  }, [props.onSelectNode, canvasStore]);

  // Node drag handlers
  const onNodeDragStart = useCallback<NodeDragHandler>((event, node) => {
    setIsDragging(true);
    props.onNodeDragStart?.(event, node);
  }, [props.onNodeDragStart]);

  const onNodeDrag = useCallback<NodeDragHandler>((event, node) => {
    props.onNodeDrag?.(event, node);
  }, [props.onNodeDrag]);

  const onNodeDragStop = useCallback<NodeDragHandler>((event, node) => {
    setIsDragging(false);
    
    // Update node position in canvas operations
    canvasOperations.updateNodePosition(node.id, node.position as [number, number]);
    
    props.onNodeDragStop?.(event, node);
  }, [props.onNodeDragStop, canvasOperations]);

  // Connection start/end handlers
  const onConnectStart = useCallback((params: OnConnectStartParams) => {
    props.onConnectStart?.(params);
  }, [props.onConnectStart]);

  const onConnectEnd = useCallback((params: OnConnectEndParams) => {
    props.onConnectEnd?.(params);
  }, [props.onConnectEnd]);

  // Delete handlers
  const onNodesDelete = useCallback<OnNodesDelete>((nodesToDelete) => {
    if (props.readOnly) return;

    nodesToDelete.forEach(node => {
      canvasOperations.deleteNode(node.id);
    });

    props.onNodesDelete?.(nodesToDelete);
  }, [props.readOnly, props.onNodesDelete, canvasOperations]);

  const onEdgesDelete = useCallback<OnEdgesDelete>((edgesToDelete) => {
    if (props.readOnly) return;

    edgesToDelete.forEach(edge => {
      canvasOperations.deleteConnection({
        source: edge.source,
        sourceHandle: edge.sourceHandle || 'output',
        target: edge.target,
        targetHandle: edge.targetHandle || 'input',
      });
    });

    props.onEdgesDelete?.(edgesToDelete);
  }, [props.readOnly, props.onEdgesDelete, canvasOperations]);

  // Move handlers
  const onMove = useCallback<OnMove>((event, viewport) => {
    setViewport(viewport);
    props.onMove?.(event, viewport);
  }, [props.onMove]);

  const onMoveStart = useCallback<OnMoveStart>((event, viewport) => {
    props.onMoveStart?.(event, viewport);
  }, [props.onMoveStart]);

  const onMoveEnd = useCallback<OnMoveEnd>((event, viewport) => {
    setViewport(viewport);
    props.onMoveEnd?.(event, viewport);
  }, [props.onMoveEnd]);

  // Selection drag handlers
  const onSelectionDragStart = useCallback<OnSelectionDragStart>((event) => {
    setIsSelecting(true);
    setSelectionStart([event.clientX, event.clientY]);
    props.onSelectionDragStart?.(event);
  }, [props.onSelectionDragStart]);

  const onSelectionDrag = useCallback<OnSelectionDrag>((event) => {
    props.onSelectionDrag?.(event);
  }, [props.onSelectionDrag]);

  const onSelectionDragStop = useCallback<OnSelectionDragStop>((event) => {
    setIsSelecting(false);
    setSelectionStart(null);
    props.onSelectionDragStop?.(event);
  }, [props.onSelectionDragStop]);

  // Click handlers
  const onPaneClick = useCallback((e: React.MouseEvent) => {
    // Update last click position
    const rect = e.currentTarget.getBoundingClientRect();
    const position: XYPosition = [e.clientX - rect.left, e.clientY - rect.top];
    canvasOperations.lastClickPosition.current = position;
    
    props.onPaneClick?.(e);
  }, [props.onPaneClick, canvasOperations]);

  const onNodeClick = useCallback((e: React.MouseEvent, node: Node) => {
    // Update last click position
    const rect = e.currentTarget.getBoundingClientRect();
    const position: XYPosition = [e.clientX - rect.left, e.clientY - rect.top];
    canvasOperations.lastClickPosition.current = position;
    
    props.onNodeClick?.(e, node);
  }, [props.onNodeClick, canvasOperations]);

  const onNodeDoubleClick = useCallback((e: React.MouseEvent, node: Node) => {
    // Handle double-click to open node details
    canvasOperations.setNodeActive(node.id);
    props.onNodeDoubleClick?.(e, node);
  }, [props.onNodeDoubleClick, canvasOperations]);

  const onEdgeClick = useCallback((e: React.MouseEvent, edge: Edge) => {
    props.onEdgeClick?.(e, edge);
  }, [props.onEdgeClick]);

  const onSelectionEnd = useCallback((e: React.MouseEvent) => {
    props.onSelectionEnd?.(e);
  }, [props.onSelectionEnd]);

  // Drag and drop handlers
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    props.onDragOver?.(e);
  }, [props.onDragOver]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    if (props.readOnly) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const position: XYPosition = [
      e.clientX - rect.left,
      e.clientY - rect.top
    ];

    // Handle node drop from node creator
    const nodeData = e.dataTransfer.getData('application/x-sv-node');
    if (nodeData) {
      try {
        const nodeInfo = JSON.parse(nodeData);
        canvasOperations.addNode({
          type: nodeInfo.type || 'unknown',
          position,
          parameters: nodeInfo.parameters || {},
        });
      } catch (error) {
        console.error('Failed to parse dropped node data:', error);
      }
    }

    props.onDrop?.(e);
  }, [props.readOnly, props.onDrop, canvasOperations]);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    props.onDragLeave?.(e);
  }, [props.onDragLeave]);

  // Context menu handler
  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    props.onContextMenu?.(e);
  }, [props.onContextMenu]);

  // ReactFlow instance handler
  const onInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
    setViewport(instance.getViewport());
    setDimensions(instance.getViewport());
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onDelete: () => {
      if (selectedNodeIds.length > 0 && !props.readOnly) {
        selectedNodeIds.forEach(id => canvasOperations.deleteNode(id));
      }
    },
    onCopy: () => {
      if (selectedNodeIds.length > 0) {
        canvasOperations.copyNodes(selectedNodeIds);
      }
    },
    onCut: () => {
      if (selectedNodeIds.length > 0 && !props.readOnly) {
        canvasOperations.cutNodes(selectedNodeIds);
      }
    },
    onPaste: () => {
      // Handle paste from clipboard
      navigator.clipboard.readText().then(text => {
        try {
          const data = JSON.parse(text);
          if (data.nodes) {
            // Paste nodes at last click position
            data.nodes.forEach((nodeData: any) => {
              canvasOperations.addNode({
                type: nodeData.type,
                position: canvasOperations.lastClickPosition.current,
                parameters: nodeData.parameters,
              });
            });
          }
        } catch (error) {
          console.error('Failed to paste from clipboard:', error);
        }
      });
    },
    onUndo: () => {
      historyStore.undo();
    },
    onRedo: () => {
      historyStore.redo();
    },
    onTidy: () => {
      canvasOperations.tidyUp();
    },
  });

  return (
    <div 
      style={{ width: '100%', height: '100%' }} 
      onMouseLeave={syncUp} 
      onBlur={syncUp}
      onContextMenu={onContextMenu}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={displayNodes}
          edges={edges}
          onNodesChange={onNodesChangeWrapped}
          onEdgesChange={onEdgesChangeWrapped}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          onNodeDragStart={onNodeDragStart}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          onMove={onMove}
          onMoveStart={onMoveStart}
          onMoveEnd={onMoveEnd}
          onSelectionDragStart={onSelectionDragStart}
          onSelectionDrag={onSelectionDrag}
          onSelectionDragStop={onSelectionDragStop}
          onPaneClick={onPaneClick}
          onPaneContextMenu={onContextMenu}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          onEdgeClick={onEdgeClick}
          onSelectionEnd={onSelectionEnd}
          onInit={onInit}
          fitView
          proOptions={{ hideAttribution: true }}
          snapToGrid={true}
          snapGrid={[GRID_SIZE, GRID_SIZE]}
          nodesDraggable={!props.readOnly}
          nodesConnectable={!props.readOnly}
          elementsSelectable={!props.readOnly}
          selectNodesOnDrag={false}
          multiSelectionKeyCode="Shift"
          panOnDrag={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          panOnScroll={false}
          preventScrolling={true}
          zoomOnDoubleClick={false}
          attributionPosition="bottom-left"
        >
          <MiniMap 
            nodeColor={(node) => {
              const status = nodeStatus[node.id] || 'idle';
              return status === 'running' ? '#0af' : status === 'success' ? '#0a0' : status === 'error' ? '#f33' : '#999';
            }}
          />
          <Controls showInteractive />
          <Background gap={GRID_SIZE} />
          <Panel position="top-right">
            <div style={{ display: 'flex', gap: 4, padding: 8 }}>
              <button onClick={() => rf.zoomIn()}>+</button>
              <button onClick={() => rf.zoomOut()}>-</button>
              <button onClick={() => rf.fitView()}>Fit</button>
              <button onClick={() => canvasOperations.tidyUp()}>Tidy</button>
            </div>
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}