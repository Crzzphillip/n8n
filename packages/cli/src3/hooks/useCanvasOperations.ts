import { useCallback, useRef } from 'react';
import { useWorkflowStore, type WorkflowNode, type XYPosition } from '../stores/workflows';
import { useHistoryStore } from '../stores/history';
import { useCanvasStore } from '../stores/canvas';
import { useNDVStore } from '../stores/ndv';
import { useNodeTypesStore } from '../stores/nodeTypes';
import { useExecutionsStore } from '../stores/executions';
import { useTemplatesStore } from '../stores/templates';
import { useLogsStore } from '../stores/logs';
import { useAgentRequestStore } from '../stores/agentRequest';
import { 
  getNewNodePosition, 
  getNodesWithNormalizedPosition, 
  getBounds,
  type ViewportBoundaries 
} from '../utils/nodeViewUtils';
import { historyBus, canvasEventBus } from '../utils/eventBus';

export type NodeConnection = {
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  data?: any;
};

export type AddedNodesAndConnections = {
  nodes: Array<{
    type: string;
    position?: XYPosition;
    parameters?: Record<string, any>;
  }>;
  connections: Array<{
    from: { nodeIndex: number; outputIndex?: number; type?: string };
    to: { nodeIndex: number; inputIndex?: number; type?: string };
  }>;
};

export type CanvasOperationOptions = {
  trackHistory?: boolean;
  telemetry?: boolean;
  viewport?: ViewportBoundaries;
  dragAndDrop?: boolean;
  position?: XYPosition;
};

export function useCanvasOperations() {
  const workflowStore = useWorkflowStore();
  const historyStore = useHistoryStore();
  const canvasStore = useCanvasStore();
  const ndvStore = useNDVStore();
  const nodeTypesStore = useNodeTypesStore();
  const executionsStore = useExecutionsStore();
  const templatesStore = useTemplatesStore();
  const logsStore = useLogsStore();
  const agentRequestStore = useAgentRequestStore();

  const lastClickPosition = useRef<XYPosition>([0, 0]);
  const editableWorkflow = useRef(workflowStore.current);
  const editableWorkflowObject = useRef(workflowStore.current);

  // Update refs when workflow changes
  if (workflowStore.current !== editableWorkflow.current) {
    editableWorkflow.current = workflowStore.current;
    editableWorkflowObject.current = workflowStore.current;
  }

  /**
   * Node Management
   */
  const addNode = useCallback((
    nodeData: { type: string; position?: XYPosition; parameters?: Record<string, any> },
    options: CanvasOperationOptions = {}
  ) => {
    const { trackHistory = true, position, viewport } = options;
    const workflow = editableWorkflow.current;
    if (!workflow) return;

    const nodeType = nodeTypesStore.getNodeType(nodeData.type);
    if (!nodeType) {
      throw new Error(`Node type ${nodeData.type} not found`);
    }

    const newNodePosition = position || getNewNodePosition(
      workflow.nodes,
      lastClickPosition.current,
      { viewport }
    );

    const newNode: WorkflowNode = {
      id: Math.random().toString(36).slice(2),
      name: nodeType.displayName || nodeData.type,
      type: nodeData.type,
      position: newNodePosition,
      parameters: nodeData.parameters || {},
    };

    workflowStore.addNode(newNode);

    if (trackHistory) {
      historyStore.addAction({
        type: 'node_add',
        data: { node: newNode },
        description: `Added ${newNode.name} node`,
      });
    }

    logsStore.addLog({
      level: 'info',
      message: `Added node: ${newNode.name}`,
      nodeId: newNode.id,
      nodeName: newNode.name,
      source: 'workflow',
    });

    return newNode;
  }, [workflowStore, historyStore, nodeTypesStore, logsStore]);

  const deleteNode = useCallback((
    nodeId: string,
    options: CanvasOperationOptions = {}
  ) => {
    const { trackHistory = true } = options;
    const workflow = editableWorkflow.current;
    if (!workflow) return;

    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node) return;

    workflowStore.removeNode(nodeId);

    if (trackHistory) {
      historyStore.addAction({
        type: 'node_delete',
        data: { node },
        description: `Deleted ${node.name} node`,
      });
    }

    logsStore.addLog({
      level: 'info',
      message: `Deleted node: ${node.name}`,
      nodeId: node.id,
      nodeName: node.name,
      source: 'workflow',
    });
  }, [workflowStore, historyStore, logsStore]);

  const duplicateNode = useCallback((
    nodeId: string,
    options: CanvasOperationOptions = {}
  ) => {
    const { trackHistory = true, viewport } = options;
    const workflow = editableWorkflow.current;
    if (!workflow) return;

    const originalNode = workflow.nodes.find(n => n.id === nodeId);
    if (!originalNode) return;

    const newPosition = getNewNodePosition(
      workflow.nodes,
      originalNode.position,
      { viewport, offset: 50 }
    );

    const duplicatedNode: WorkflowNode = {
      ...originalNode,
      id: Math.random().toString(36).slice(2),
      name: `${originalNode.name} (Copy)`,
      position: newPosition,
    };

    workflowStore.addNode(duplicatedNode);

    if (trackHistory) {
      historyStore.addAction({
        type: 'node_add',
        data: { node: duplicatedNode },
        description: `Duplicated ${originalNode.name} node`,
      });
    }

    return duplicatedNode;
  }, [workflowStore, historyStore]);

  const copyNodes = useCallback(async (nodeIds: string[]) => {
    const workflow = editableWorkflow.current;
    if (!workflow) return [];

    const nodesToCopy = workflow.nodes.filter(n => nodeIds.includes(n.id));
    const connectionsToCopy = Object.entries(workflow.connections)
      .filter(([sourceId]) => nodeIds.includes(sourceId))
      .reduce((acc, [sourceId, connections]) => {
        acc[sourceId] = connections.filter((conn: any) => 
          nodeIds.includes(conn.node)
        );
        return acc;
      }, {} as Record<string, any[]>);

    const clipboardData = {
      nodes: nodesToCopy,
      connections: connectionsToCopy,
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(clipboardData));
      logsStore.addLog({
        level: 'info',
        message: `Copied ${nodesToCopy.length} nodes to clipboard`,
        source: 'workflow',
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }

    return nodesToCopy;
  }, [logsStore]);

  const cutNodes = useCallback(async (nodeIds: string[]) => {
    const copiedNodes = await copyNodes(nodeIds);
    
    // Delete the nodes after copying
    nodeIds.forEach(nodeId => deleteNode(nodeId, { trackHistory: false }));
    
    // Add a single history action for the cut operation
    historyStore.addAction({
      type: 'node_delete',
      data: { nodeIds, nodes: copiedNodes },
      description: `Cut ${copiedNodes.length} nodes`,
    });

    return copiedNodes;
  }, [copyNodes, deleteNode, historyStore]);

  /**
   * Position Management
   */
  const updateNodePosition = useCallback((
    nodeId: string,
    position: XYPosition,
    options: CanvasOperationOptions = {}
  ) => {
    const { trackHistory = true } = options;
    const workflow = editableWorkflow.current;
    if (!workflow) return;

    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node) return;

    const oldPosition = node.position;
    workflowStore.setNodePosition(nodeId, position);

    if (trackHistory) {
      historyBus.emit('nodeMove', {
        nodeName: node.name,
        position: oldPosition || [0, 0],
      });
    }
  }, [workflowStore]);

  const updateNodesPosition = useCallback((
    nodePositions: Array<{ id: string; position: XYPosition }>,
    options: CanvasOperationOptions = {}
  ) => {
    const { trackHistory = true } = options;
    
    nodePositions.forEach(({ id, position }) => {
      updateNodePosition(id, position, { trackHistory: false });
    });

    if (trackHistory && nodePositions.length > 0) {
      historyStore.addAction({
        type: 'node_move',
        data: { nodePositions },
        description: `Moved ${nodePositions.length} nodes`,
      });
    }
  }, [updateNodePosition, historyStore]);

  const tidyUp = useCallback((
    event: { source: string; nodeIdsFilter?: string[] } = { source: 'manual' }
  ) => {
    const workflow = editableWorkflow.current;
    if (!workflow) return;

    const nodesToTidy = event.nodeIdsFilter 
      ? workflow.nodes.filter(n => event.nodeIdsFilter!.includes(n.id))
      : workflow.nodes;

    if (nodesToTidy.length === 0) return;

    // Simple grid-based tidy up
    const gridSize = 200;
    const nodesPerRow = 4;
    
    const newPositions = nodesToTidy.map((node, index) => {
      const row = Math.floor(index / nodesPerRow);
      const col = index % nodesPerRow;
      return {
        id: node.id,
        position: [col * gridSize + 100, row * gridSize + 100] as XYPosition,
      };
    });

    updateNodesPosition(newPositions, { trackHistory: true });

    logsStore.addLog({
      level: 'info',
      message: `Tidied up ${nodesToTidy.length} nodes`,
      source: 'workflow',
    });
  }, [updateNodesPosition, logsStore]);

  /**
   * Connection Management
   */
  const createConnection = useCallback((
    connection: NodeConnection,
    options: CanvasOperationOptions = {}
  ) => {
    const { trackHistory = true } = options;
    const workflow = editableWorkflow.current;
    if (!workflow) return;

    // Validate connection
    if (!isConnectionAllowed(connection.source, connection.target)) {
      throw new Error('Connection not allowed between these nodes');
    }

    // Add connection to workflow
    const newConnections = { ...workflow.connections };
    if (!newConnections[connection.source]) {
      newConnections[connection.source] = [];
    }
    
    newConnections[connection.source].push({
      node: connection.target,
      type: 'main',
      index: 0,
      ...connection.data,
    });

    workflowStore.connect(connection.source, connection.target);

    if (trackHistory) {
      historyStore.addAction({
        type: 'connection_add',
        data: { connection },
        description: 'Created connection',
      });
    }

    logsStore.addLog({
      level: 'info',
      message: 'Created connection',
      source: 'workflow',
    });
  }, [workflowStore, historyStore, logsStore]);

  const deleteConnection = useCallback((
    connection: NodeConnection,
    options: CanvasOperationOptions = {}
  ) => {
    const { trackHistory = true } = options;
    const workflow = editableWorkflow.current;
    if (!workflow) return;

    const newConnections = { ...workflow.connections };
    if (newConnections[connection.source]) {
      newConnections[connection.source] = newConnections[connection.source].filter(
        (conn: any) => conn.node !== connection.target
      );
    }

    // Update workflow connections
    workflowStore.connect(connection.source, connection.target); // This will be updated to handle deletion

    if (trackHistory) {
      historyStore.addAction({
        type: 'connection_delete',
        data: { connection },
        description: 'Deleted connection',
      });
    }
  }, [workflowStore, historyStore]);

  const addConnections = useCallback((
    connections: NodeConnection[],
    options: CanvasOperationOptions = {}
  ) => {
    connections.forEach(connection => {
      createConnection(connection, { ...options, trackHistory: false });
    });

    if (options.trackHistory) {
      historyStore.addAction({
        type: 'connection_add',
        data: { connections },
        description: `Added ${connections.length} connections`,
      });
    }
  }, [createConnection, historyStore]);

  /**
   * History Operations
   */
  const revertAddNode = useCallback((nodeName: string) => {
    const workflow = editableWorkflow.current;
    if (!workflow) return;

    const node = workflow.nodes.find(n => n.name === nodeName);
    if (!node) return;

    deleteNode(node.id, { trackHistory: false });
    
    historyStore.addAction({
      type: 'node_delete',
      data: { node },
      description: `Reverted adding ${nodeName}`,
    });
  }, [deleteNode, historyStore]);

  const revertDeleteNode = useCallback((node: WorkflowNode) => {
    addNode({
      type: node.type || 'unknown',
      position: node.position,
      parameters: node.parameters,
    }, { trackHistory: false });

    historyStore.addAction({
      type: 'node_add',
      data: { node },
      description: `Reverted deleting ${node.name}`,
    });
  }, [addNode, historyStore]);

  const revertCreateConnection = useCallback((connection: [NodeConnection, NodeConnection]) => {
    deleteConnection(connection[0], { trackHistory: false });
    
    historyStore.addAction({
      type: 'connection_delete',
      data: { connection: connection[0] },
      description: 'Reverted creating connection',
    });
  }, [deleteConnection, historyStore]);

  /**
   * Node State Management
   */
  const setNodeActive = useCallback((nodeId: string) => {
    const workflow = editableWorkflow.current;
    if (!workflow) return;

    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node) return;

    ndvStore.setActiveNode(node.name, nodeId);
  }, [ndvStore]);

  const setNodeSelected = useCallback((nodeId?: string) => {
    if (nodeId) {
      canvasStore.addSelectedNode(nodeId);
    } else {
      canvasStore.clearSelectedNodes();
    }
  }, [canvasStore]);

  const toggleNodesDisabled = useCallback((nodeIds: string[]) => {
    const workflow = editableWorkflow.current;
    if (!workflow) return;

    const updatedNodes = workflow.nodes.map(node => {
      if (nodeIds.includes(node.id)) {
        return { ...node, disabled: !node.disabled };
      }
      return node;
    });

    // Update workflow with disabled nodes
    // This would need to be implemented in the workflow store
    console.log('Toggle nodes disabled:', nodeIds);
  }, []);

  const toggleNodesPinned = useCallback((nodeIds: string[], source: string) => {
    const workflow = editableWorkflow.current;
    if (!workflow) return;

    const updatedNodes = workflow.nodes.map(node => {
      if (nodeIds.includes(node.id)) {
        return { ...node, pinned: !node.pinned };
      }
      return node;
    });

    // Update workflow with pinned nodes
    console.log('Toggle nodes pinned:', nodeIds, source);
  }, []);

  /**
   * Import/Export
   */
  const importWorkflowData = useCallback(async (
    workflowData: any,
    source: string,
    options: CanvasOperationOptions = {}
  ) => {
    const { viewport } = options;
    
    if (!workflowData.nodes || !workflowData.connections) {
      throw new Error('Invalid workflow data');
    }

    // Reset current workflow
    workflowStore.current = {
      name: workflowData.name || 'Imported Workflow',
      nodes: getNodesWithNormalizedPosition(workflowData.nodes),
      connections: workflowData.connections,
      settings: workflowData.settings,
    };

    logsStore.addLog({
      level: 'info',
      message: `Imported workflow from ${source}`,
      source: 'workflow',
    });
  }, [workflowStore, logsStore]);

  const fetchWorkflowDataFromUrl = useCallback(async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch workflow data: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch workflow data from URL: ${error}`);
    }
  }, []);

  const importTemplate = useCallback(async (
    template: { id: string; name: string; workflow: any }
  ) => {
    await importWorkflowData(template.workflow, 'template');
    
    logsStore.addLog({
      level: 'info',
      message: `Imported template: ${template.name}`,
      source: 'workflow',
    });
  }, [importWorkflowData, logsStore]);

  /**
   * Execution
   */
  const runWorkflow = useCallback(async (source: string) => {
    const workflow = editableWorkflow.current;
    if (!workflow) return;

    canvasStore.setExecuting(true);
    
    try {
      // Simulate workflow execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logsStore.addLog({
        level: 'info',
        message: `Workflow executed from ${source}`,
        source: 'execution',
      });
    } catch (error) {
      logsStore.addLog({
        level: 'error',
        message: `Workflow execution failed: ${error}`,
        source: 'execution',
      });
    } finally {
      canvasStore.setExecuting(false);
    }
  }, [canvasStore, logsStore]);

  const stopCurrentExecution = useCallback(async () => {
    canvasStore.setExecuting(false);
    
    logsStore.addLog({
      level: 'info',
      message: 'Workflow execution stopped',
      source: 'execution',
    });
  }, [canvasStore, logsStore]);

  const openExecution = useCallback(async (executionId: string, nodeId?: string) => {
    try {
      const execution = await executionsStore.fetchExecution(executionId);
      if (!execution) {
        throw new Error('Execution not found');
      }

      // Load execution data into workflow
      await importWorkflowData(execution.workflowData, 'execution');
      
      logsStore.addLog({
        level: 'info',
        message: `Opened execution: ${executionId}`,
        source: 'execution',
      });

      return execution;
    } catch (error) {
      logsStore.addLog({
        level: 'error',
        message: `Failed to open execution: ${error}`,
        source: 'execution',
      });
      throw error;
    }
  }, [executionsStore, importWorkflowData, logsStore]);

  /**
   * Validation
   */
  const isConnectionAllowed = useCallback((sourceId: string, targetId: string): boolean => {
    const workflow = editableWorkflow.current;
    if (!workflow) return false;

    const sourceNode = workflow.nodes.find(n => n.id === sourceId);
    const targetNode = workflow.nodes.find(n => n.id === targetId);
    
    if (!sourceNode || !targetNode) return false;

    // Basic validation - prevent self-connection
    if (sourceId === targetId) return false;

    // Check for circular connections
    const hasCircularConnection = (fromId: string, toId: string, visited: Set<string> = new Set()): boolean => {
      if (fromId === toId) return true;
      if (visited.has(fromId)) return false;
      
      visited.add(fromId);
      const connections = workflow.connections[fromId] || [];
      
      return connections.some((conn: any) => hasCircularConnection(conn.node, toId, visited));
    };

    return !hasCircularConnection(targetId, sourceId);
  }, []);

  const revalidateNodeInputConnections = useCallback((nodeId: string) => {
    const workflow = editableWorkflow.current;
    if (!workflow) return;

    // Validate all input connections for the node
    const inputConnections = Object.entries(workflow.connections)
      .filter(([_, connections]) => 
        connections.some((conn: any) => conn.node === nodeId)
      );

    console.log('Revalidating input connections for node:', nodeId, inputConnections);
  }, []);

  const revalidateNodeOutputConnections = useCallback((nodeId: string) => {
    const workflow = editableWorkflow.current;
    if (!workflow) return;

    // Validate all output connections for the node
    const outputConnections = workflow.connections[nodeId] || [];

    console.log('Revalidating output connections for node:', nodeId, outputConnections);
  }, []);

  /**
   * Utility functions
   */
  const resolveNodePosition = useCallback((
    nodeId: string,
    position: XYPosition,
    options: CanvasOperationOptions = {}
  ) => {
    const { viewport } = options;
    const workflow = editableWorkflow.current;
    if (!workflow) return position;

    // Check for conflicts with other nodes
    const conflictingNode = workflow.nodes.find(node => 
      node.id !== nodeId && 
      Math.abs(node.position[0] - position[0]) < 50 &&
      Math.abs(node.position[1] - position[1]) < 50
    );

    if (conflictingNode) {
      return getNewNodePosition(workflow.nodes, position, { viewport });
    }

    return position;
  }, []);

  const setNodeActiveByName = useCallback((nodeName: string) => {
    const workflow = editableWorkflow.current;
    if (!workflow) return;

    const node = workflow.nodes.find(n => n.name === nodeName);
    if (node) {
      setNodeActive(node.id);
    }
  }, [setNodeActive]);

  const clearNodeActive = useCallback(() => {
    ndvStore.closeNDV();
  }, [ndvStore]);

  const tryToOpenSubworkflowInNewTab = useCallback((nodeId: string): boolean => {
    const workflow = editableWorkflow.current;
    if (!workflow) return false;

    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node || node.type !== 'n8n-nodes-base.subworkflow') return false;

    // Open subworkflow in new tab
    window.open(`/workflow/${node.parameters?.workflowId}`, '_blank');
    return true;
  }, []);

  const startChat = useCallback((mode: string = 'main') => {
    logsStore.addLog({
      level: 'info',
      message: `Started chat in ${mode} mode`,
      source: 'chat',
    });
  }, [logsStore]);

  return {
    // Node management
    addNode,
    deleteNode,
    duplicateNode,
    copyNodes,
    cutNodes,
    
    // Position management
    updateNodePosition,
    updateNodesPosition,
    tidyUp,
    resolveNodePosition,
    
    // Connection management
    createConnection,
    deleteConnection,
    addConnections,
    
    // History operations
    revertAddNode,
    revertDeleteNode,
    revertCreateConnection,
    
    // Node state
    setNodeActive,
    setNodeSelected,
    toggleNodesDisabled,
    toggleNodesPinned,
    setNodeActiveByName,
    clearNodeActive,
    
    // Import/export
    importWorkflowData,
    fetchWorkflowDataFromUrl,
    importTemplate,
    
    // Execution
    runWorkflow,
    stopCurrentExecution,
    openExecution,
    
    // Validation
    isConnectionAllowed,
    revalidateNodeInputConnections,
    revalidateNodeOutputConnections,
    
    // Utilities
    tryToOpenSubworkflowInNewTab,
    startChat,
    lastClickPosition,
    editableWorkflow,
    editableWorkflowObject,
  };
}