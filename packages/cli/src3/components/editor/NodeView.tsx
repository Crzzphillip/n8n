"use client";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Canvas, { CanvasNode, CanvasEdge } from './canvas/Canvas';
import NDV from './NDV/NodeDetailsView';
import NodeCreator from './NodeCreator/NodeCreator';
import { useKeyboardShortcuts } from '../../src3/hooks/useKeyboardShortcuts';
import TopBar from './Header/TopBar';
import RightPanel from './SidePanels/RightPanel';
import { usePushStore } from '../../src3/stores/push';
import Tooltip from '../ui/Tooltip';
import { useModal } from '../ui/ModalManager';
import { useWorkflowStore } from '../../src3/stores/workflows';
import ExecutionsTab from './Executions/ExecutionsTab';

// New imports for enhanced functionality
import { useCanvasOperations } from '../../src3/hooks/useCanvasOperations';
import { useWorkflowHelpers } from '../../src3/hooks/useWorkflowHelpers';
import { useTelemetry } from '../../src3/hooks/useTelemetry';
import { useClipboard } from '../../src3/hooks/useClipboard';
import { useBeforeUnload } from '../../src3/hooks/useBeforeUnload';
import { useWorkflowSaving } from '../../src3/hooks/useWorkflowSaving';
import { useRunWorkflow } from '../../src3/hooks/useRunWorkflow';
import { useNodeHelpers } from '../../src3/hooks/useNodeHelpers';
import { useExecutionDebugging } from '../../src3/hooks/useExecutionDebugging';
import { useWorkflowExtraction } from '../../src3/hooks/useWorkflowExtraction';
import { useGlobalLinkActions } from '../../src3/hooks/useGlobalLinkActions';
import { useToast } from '../../src3/hooks/useToast';
import { useMessage } from '../../src3/hooks/useMessage';
import { useDocumentTitle } from '../../src3/hooks/useDocumentTitle';
import { useExternalHooks } from '../../src3/hooks/useExternalHooks';
import { useRouteGuards } from '../../src3/hooks/useRouteGuards';

// New stores
import { useHistoryStore } from '../../src3/stores/history';
import { useNDVStore } from '../../src3/stores/ndv';
import { useNodeCreatorStore } from '../../src3/stores/nodeCreator';
import { useLogsStore } from '../../src3/stores/logs';
import { useFocusPanelStore } from '../../src3/stores/focusPanel';
import { useTemplatesStore } from '../../src3/stores/templates';
import { useBuilderStore } from '../../src3/stores/builder';
import { useAgentRequestStore } from '../../src3/stores/agentRequest';
import { useExecutionsStore } from '../../src3/stores/executions';
import { useCanvasStore } from '../../src3/stores/canvas';
import { useNodeTypesStore } from '../../src3/stores/nodeTypes';
import { useUIStore } from '../../src3/stores/ui';
import { useSourceControlStore } from '../../src3/stores/sourceControl';
import { useSettingsStore } from '../../src3/stores/settings';
import { useCredentialsStore } from '../../src3/stores/credentials';
import { useProjectsStore } from '../../src3/stores/projects';
import { useUsersStore } from '../../src3/stores/users';
import { useTagsStore } from '../../src3/stores/tags';

// New components
import CanvasRunWorkflowButton from './canvas/buttons/CanvasRunWorkflowButton';
import CanvasStopCurrentExecutionButton from './canvas/buttons/CanvasStopCurrentExecutionButton';
import CanvasStopWaitingForWebhookButton from './canvas/buttons/CanvasStopWaitingForWebhookButton';
import CanvasChatButton from './canvas/buttons/CanvasChatButton';
import FocusPanel from './FocusPanel';
import KeyboardShortcutTooltip from '../ui/KeyboardShortcutTooltip';
import NodeViewUnfinishedWorkflowMessage from './NodeViewUnfinishedWorkflowMessage';
import SetupWorkflowCredentialsButton from './SetupWorkflowCredentialsButton';
import RunControls from './RunControls';

// Event buses
import { historyBus } from '../../src3/event-bus/history';
import { canvasEventBus } from '../../src3/event-bus/canvas';
import { nodeViewEventBus } from '../../src3/event-bus/nodeView';
import { sourceControlEventBus } from '../../src3/event-bus/sourceControl';

// Constants
import {
	CHAT_TRIGGER_NODE_TYPE,
	MANUAL_CHAT_TRIGGER_NODE_TYPE,
	START_NODE_TYPE,
	STICKY_NODE_TYPE,
	EVALUATION_TRIGGER_NODE_TYPE,
	EVALUATION_NODE_TYPE,
	DRAG_EVENT_DATA_KEY,
	EnterpriseEditionFeature,
	FOCUS_PANEL_EXPERIMENT,
	NDV_UI_OVERHAUL_EXPERIMENT,
	FROM_AI_PARAMETERS_MODAL_KEY,
	WORKFLOW_SETTINGS_MODAL_KEY,
	MODAL_CONFIRM,
	MAIN_HEADER_TABS,
	NEW_WORKFLOW_ID,
	PLACEHOLDER_EMPTY_WORKFLOW_ID,
	NODE_CREATOR_OPEN_SOURCES,
	VALID_WORKFLOW_IMPORT_URL_REGEX,
	VIEWS,
} from '../../src3/constants';

// Utilities
import { createCanvasConnectionHandleString, parseCanvasConnectionHandleString } from '../../src3/utils/canvasUtils';
import { isValidNodeConnectionType, isVueFlowConnection } from '../../src3/utils/typeGuards';
import { tryToParseNumber } from '../../src3/utils/typesUtils';
import { getNodeViewTab } from '../../src3/utils/nodeViewUtils';
import { getNodesWithNormalizedPosition } from '../../src3/utils/nodeViewUtils';

// Types
import type { INodeUi, XYPosition, ViewportTransform, Dimensions, ViewportBoundaries } from '../../src3/types/Interface';

type WorkflowId = string;

type Workflow = {
  id?: WorkflowId;
  name: string;
  nodes: Array<{ id: string; name: string; type?: string; position?: { x: number; y: number }; parameters?: Record<string, any> }>;
  connections: Record<string, any>;
  settings?: Record<string, any>;
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function NodeView(props: { mode: 'new' | 'existing' }) {
  const router = useRouter();
  const params = useSearchParams();
  const mode = props.mode;
  const workflowId = params.get('id') || undefined;
  const { guardedPush, guardedReplace } = useRouteGuards(router as any);

  // Enhanced state management
  const [workflow, setWorkflow] = useState<Workflow>({ name: 'New workflow', nodes: [], connections: {} });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(undefined);
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
  const [clipboard, setClipboard] = useState<any[]>([]);
  const [showExecutions, setShowExecutions] = useState(false);
  const [isStoppingExecution, setIsStoppingExecution] = useState(false);
  const [viewportTransform, setViewportTransform] = useState<ViewportTransform>({ x: 0, y: 0, zoom: 1 });
  const [viewportDimensions, setViewportDimensions] = useState<Dimensions>({ width: 0, height: 0 });
  const [selectedTriggerNodeName, setSelectedTriggerNodeName] = useState<string | undefined>(undefined);

  // Enhanced hooks
  const canvasOperations = useCanvasOperations();
  const workflowHelpers = useWorkflowHelpers();
  const telemetry = useTelemetry();
  const workflowSaving = useWorkflowSaving({ router });
  const runWorkflow = useRunWorkflow({ router });
  const { addBeforeUnloadEventBindings, removeBeforeUnloadEventBindings } = useBeforeUnload({ route: params });
  const nodeHelpers = useNodeHelpers();
  const executionDebugging = useExecutionDebugging();
  const workflowExtraction = useWorkflowExtraction();
  const globalLinkActions = useGlobalLinkActions();
  const toast = useToast();
  const message = useMessage();
  const documentTitle = useDocumentTitle();
  const externalHooks = useExternalHooks();

  // Enhanced stores
  const historyStore = useHistoryStore();
  const ndvStore = useNDVStore();
  const nodeCreatorStore = useNodeCreatorStore();
     const logsStore = useLogsStore();
   const isLogsPanelOpen = useLogsStore((s) => s.isOpen);
  const focusPanelStore = useFocusPanelStore();
  const templatesStore = useTemplatesStore();
  const builderStore = useBuilderStore();
  const agentRequestStore = useAgentRequestStore();
  const executionsStore = useExecutionsStore();
  const canvasStore = useCanvasStore();
  const workflowStore = useWorkflowStore();
  const pushStore = usePushStore();
  const nodeTypesStore = useNodeTypesStore();
  const uiStore = useUIStore();
  const sourceControlStore = useSourceControlStore();
  const settingsStore = useSettingsStore();
  const credentialsStore = useCredentialsStore();
  const projectsStore = useProjectsStore();
  const usersStore = useUsersStore();
  const tagsStore = useTagsStore();

  // Enhanced initialization
  useEffect(() => {
    const initializeData = async () => {
      const loadPromises: Promise<any>[] = [
        nodeTypesStore.getState().getNodeTypes(),
        credentialsStore.getState().fetchAllCredentials(),
        credentialsStore.getState().fetchCredentialTypes(true),
        projectsStore.getState().fetchProjects(),
        usersStore.getState().fetchCurrentUser(),
        tagsStore.getState().fetchTags(),
      ];

      // Add enterprise features if enabled
      if (settingsStore.getState().isEnterpriseFeatureEnabled[EnterpriseEditionFeature.Variables]) {
        // Add environment variables loading
      }

      if (settingsStore.getState().isEnterpriseFeatureEnabled[EnterpriseEditionFeature.ExternalSecrets]) {
        // Add external secrets loading
      }

      try {
        await Promise.all(loadPromises);
      } catch (error) {
        toast.showError(error, 'Failed to initialize data');
      }
    };

    initializeData();

    // If settings=true in query, open settings modal and clean URL
    if (params.get('settings') === 'true') {
      uiStore.getState().openModal(WORKFLOW_SETTINGS_MODAL_KEY);
      try {
        const sp = new URLSearchParams(Array.from(params.entries()));
        sp.delete('settings');
        guardedReplace(`${window.location.pathname}?${sp.toString()}`);
      } catch {}
    }
  }, [nodeTypesStore, credentialsStore, projectsStore, usersStore, tagsStore, settingsStore, toast, params, uiStore, guardedReplace]);

  useEffect(() => {
    if (mode === 'existing' && workflowId) {
      setLoading(true);
      fetchJson<Workflow>(`/api/rest/workflows/${workflowId}`)
        .then((wf) => {
          setWorkflow(wf);
          documentTitle.setWorkflowTitle(wf.name);
        })
        .catch((e: any) => {
          setError(e?.message || 'Failed to load');
          toast.showError(e, 'Failed to load workflow');
        })
        .finally(() => setLoading(false));
    } else if (mode === 'new') {
      documentTitle.setWorkflowTitle('New Workflow');
    }

    // Handle route-driven actions (e.g., add evaluation trigger, run evaluation)
    const action = params.get('action');
    if (action === 'addEvaluationTrigger') {
      nodeCreatorStore.getState().openNodeCreatorForTriggerNodes(NODE_CREATOR_OPEN_SOURCES.ADD_EVALUATION_TRIGGER_BUTTON);
    } else if (action === 'addEvaluationNode') {
      nodeCreatorStore.getState().openNodeCreatorForActions(EVALUATION_NODE_TYPE, NODE_CREATOR_OPEN_SOURCES.ADD_EVALUATION_NODE_BUTTON);
    } else if (action === 'executeEvaluation') {
      const evalTrigger = workflow.nodes.find((n) => n.type === EVALUATION_TRIGGER_NODE_TYPE);
      if (evalTrigger) {
        void runWorkflow.runEntireWorkflow('node');
      }
    }
  }, [mode, workflowId, documentTitle, toast, params, nodeCreatorStore, runWorkflow, workflow.nodes]);

  // Enhanced useEffect hooks
  useEffect(() => {
    const off = pushStore.getState().subscribeExecutions();
    addBeforeUnloadEventBindings();
    
    // Initialize stores
    historyStore.getState().reset();
    ndvStore.getState().resetNDVPushRef();

    // Clipboard paste handling
    useClipboard({
      onPaste: async (plainTextData: string) => {
        try {
          if (VALID_WORKFLOW_IMPORT_URL_REGEX.test(plainTextData)) {
            await onImportWorkflowUrl(plainTextData);
            return;
          }
          const data = JSON.parse(plainTextData);
          if (data && (data.nodes || data.connections)) {
            await onImportWorkflowData(data);
          }
        } catch {}
      },
    });
    
    return () => {
      removeBeforeUnloadEventBindings();
      off?.();
    };
  }, [pushStore, addBeforeUnloadEventBindings, removeBeforeUnloadEventBindings, historyStore, ndvStore, onImportWorkflowUrl, onImportWorkflowData]);

  // Enhanced event bus bindings
  useEffect(() => {
    const handleHistoryEvents = {
      nodeMove: ({ nodeName, position }: { nodeName: string; position: XYPosition }) => {
        const node = workflow.nodes.find(n => n.name === nodeName);
        if (node) {
          canvasOperations.updateNodePosition(node.id, { x: position[0], y: position[1] });
        }
      },
      revertAddNode: ({ node }: { node: any }) => {
        canvasOperations.deleteNode(node.id, { trackHistory: false });
      },
      revertRemoveNode: ({ node }: { node: any }) => {
        canvasOperations.addNodes([{ type: node.type, position: node.position, parameters: node.parameters }], { trackHistory: false });
      },
      revertAddConnection: ({ connection }: { connection: [any, any] }) => {
        canvasOperations.deleteConnection({ source: connection[0].node, target: connection[1].node }, { trackHistory: false });
      },
      revertRemoveConnection: ({ connection }: { connection: [any, any] }) => {
        canvasOperations.createConnection({ source: connection[0].node, target: connection[1].node }, { trackHistory: false });
      },
      revertRenameNode: ({ currentName, newName }: { currentName: string; newName: string }) => {
        canvasOperations.renameNode(newName, currentName, { trackHistory: false });
      },
      revertReplaceNodeParameters: ({ nodeId, currentProperties, newProperties }: { nodeId: string; currentProperties: any; newProperties: any }) => {
        canvasOperations.setNodeParameters(nodeId, currentProperties);
      },
      enableNodeToggle: ({ nodeName, isDisabled }: { nodeName: string; isDisabled: boolean }) => {
        const node = workflow.nodes.find(n => n.name === nodeName);
        if (node) {
          canvasOperations.toggleNodesDisabled([node.id]);
        }
      },
    };

    const handleNodeViewEvents = {
      importWorkflowData: onImportWorkflowData,
      importWorkflowUrl: onImportWorkflowUrl,
      openChat: onOpenChat,
      'runWorkflowButton:mouseenter': () => {
        telemetry.track('User hovered run workflow button');
      },
      'runWorkflowButton:mouseleave': () => {
        telemetry.track('User left run workflow button');
      },
    };

    const handleSourceControlEvents = {
      pull: onSourceControlPull,
    };

    // Bind all events
    Object.entries(handleHistoryEvents).forEach(([event, handler]) => {
      historyBus.on(event as any, handler);
    });

    Object.entries(handleNodeViewEvents).forEach(([event, handler]) => {
      nodeViewEventBus.on(event as any, handler);
    });

    Object.entries(handleSourceControlEvents).forEach(([event, handler]) => {
      sourceControlEventBus.on(event as any, handler);
    });

    return () => {
      Object.entries(handleHistoryEvents).forEach(([event, handler]) => {
        historyBus.off(event as any, handler);
      });
      Object.entries(handleNodeViewEvents).forEach(([event, handler]) => {
        nodeViewEventBus.off(event as any, handler);
      });
      Object.entries(handleSourceControlEvents).forEach(([event, handler]) => {
        sourceControlEventBus.off(event as any, handler);
      });
    };
  }, [workflow.nodes, canvasOperations, onImportWorkflowData, onImportWorkflowUrl, onOpenChat, onSourceControlPull, telemetry]);

  // PostMessage preview mode and saved events
  useEffect(() => {
    const onPostMessageReceived = async (messageEvent: MessageEvent) => {
      try {
        if (!messageEvent || typeof messageEvent.data !== 'string' || !messageEvent.data.includes('"command"')) return;
        const json = JSON.parse(messageEvent.data);
        if (json?.command === 'openWorkflow') {
          try {
            await importWorkflowExact(json);
          } catch (e) {
            toast.showError(e, 'Failed to import workflow');
          }
        } else if (json?.command === 'openExecution') {
          try {
            await onOpenExecution(json.executionId, json.nodeId);
          } catch (e) {
            toast.showError(e, 'Failed to open execution');
          }
        } else if (json?.command === 'setActiveExecution') {
          try {
            const exec = await executionsStore.getState().fetchExecution(json.executionId);
            executionsStore.getState().setActiveExecution(exec);
          } catch (e) {
            toast.showError(e, 'Failed to set active execution');
          }
        }
      } catch {}
    };

    window.addEventListener('message', onPostMessageReceived);

    try {
      // Inform parent frame we're ready
      if (window.parent) {
        window.parent.postMessage(JSON.stringify({ command: 'n8nReady', version: 'cli-src3' }), '*');
      }
    } catch {}

    const offSaved = canvasEventBus.on('saved:workflow', () => {
      toast.showSuccess('Workflow saved');
    });

    return () => {
      window.removeEventListener('message', onPostMessageReceived);
      offSaved?.();
    };
  }, [executionsStore, onOpenExecution, toast]);

  // Import workflow exactly (replace current)
  const importWorkflowExact = useCallback(async (data: any) => {
    if (!data?.workflow && !(data?.nodes && data?.connections)) {
      throw new Error('Invalid workflow object');
    }
    const wfData = data.workflow ?? data;
    const normalizedNodes = getNodesWithNormalizedPosition(
      (wfData.nodes || []).map((n: any) => ({ ...n, position: n.position || { x: 100, y: 100 } }))
    );
    setWorkflow((w) => ({
      id: wfData.id ?? w.id,
      name: wfData.name || w.name || 'Imported workflow',
      nodes: normalizedNodes,
      connections: wfData.connections || {},
      settings: wfData.settings || {},
    }));
    // Fit view after next tick
    setTimeout(() => canvasEventBus.emit('fitView'));
  }, []);

  // Sync NDV active node to URL and vice versa
  useEffect(() => {
    const nodeId = params.get('nodeId');
    if (nodeId && workflow.nodes.some((n) => n.id === nodeId)) {
      canvasOperations.setNodeActive(nodeId);
      setSelectedNodeId(nodeId);
    }
  }, [params, workflow.nodes, canvasOperations]);

  useEffect(() => {
    if (ndvStore.activeNode) {
      try {
        const sp = new URLSearchParams(Array.from(params.entries()));
        sp.set('nodeId', ndvStore.activeNode.id);
        router.replace(`${window.location.pathname}?${sp.toString()}`);
      } catch {}
    }
  }, [ndvStore.activeNode, params, router]);

  const canSave = useMemo(() => workflow.name.trim().length > 0, [workflow.name]);

  const saveNew = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const created = await fetchJson<{ id: string }>(`/api/rest/workflows`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: workflow.name, nodes: workflow.nodes, connections: workflow.connections, settings: workflow.settings }),
      });
      setWorkflow((w) => ({ ...w, id: created.id }));
      router.replace(`/workflow/new?id=${created.id}`);
      canvasEventBus.emit('saved:workflow');
    } catch (e: any) {
      setError(e?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }, [workflow, router]);

  const updateExisting = useCallback(async () => {
    if (!workflow.id) return;
    setSaving(true);
    setError(null);
    try {
      await fetchJson(`/api/rest/workflows/${workflow.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: workflow.name, nodes: workflow.nodes, connections: workflow.connections, settings: workflow.settings }),
      });
      canvasEventBus.emit('saved:workflow');
    } catch (e: any) {
      setError(e?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  }, [workflow]);

  // Enhanced keyboard shortcuts with new functionality
  useKeyboardShortcuts({
    onSave: () => workflowSaving.saveCurrentWorkflow(),
    onUndo: () => {
      const undoable = historyStore.getState().popUndoableToUndo();
      if (undoable) {
        undoable.revert();
        historyStore.getState().pushUndoableToRedo(undoable);
      }
    },
    onRedo: () => {
      const redoable = historyStore.getState().popUndoableToRedo();
      if (redoable) {
        redoable.revert();
        historyStore.getState().pushCommandToUndo(redoable as any);
      }
    },
    onCopy: () => {
      const items = workflow.nodes.filter((n) => selectedNodeIds.has(n.id));
      setClipboard(JSON.parse(JSON.stringify(items)));
      telemetry.track('User copied nodes', { count: items.length });
    },
    onPaste: () => {
      if (clipboard.length === 0) return;
      const offset = 20;
      const pasted = clipboard.map((n) => ({ ...n, id: uuid(), position: { x: (n.position?.x || 100) + offset, y: (n.position?.y || 100) + offset } }));
      setWorkflow((w) => ({ ...w, nodes: [...w.nodes, ...pasted] }));
      historyStore.getState().pushCommandToUndo(new (require('../../src3/models/history').AddNodeCommand)(pasted[0], Date.now()));
      telemetry.track('User pasted nodes', { count: pasted.length });
    },
    onDelete: async () => {
      if (!selectedNodeId) return;
      const ok = await useModal().confirm('Delete selected node?');
      if (!ok) return;
      canvasOperations.deleteNode(selectedNodeId, { trackHistory: true });
      setSelectedNodeId(undefined);
      telemetry.track('User deleted node');
    },
    onTidy: () => {
      canvasOperations.tidyUp({ source: 'keyboard-shortcut' });
      telemetry.track('User tidied up workflow');
    },
    onAlign: () => {
      if (!selectedNodeId) return;
      const base = workflow.nodes.find((n) => n.id === selectedNodeId)?.position || { x: 100, y: 100 };
      setWorkflow((w) => ({
        ...w,
        nodes: w.nodes.map((n) => (n.id === selectedNodeId ? n : { ...n, position: { x: base.x, y: n.position?.y ?? 100 } })),
      }));
      historyStore.getState().pushCommandToUndo(new (require('../../src3/models/history').MoveNodeCommand)('', [0, 0], [0, 0], Date.now()));
      telemetry.track('User aligned nodes');
    },
  });

  // Enhanced computed values
  const viewportBoundaries = useMemo<ViewportBoundaries>(() => ({
    minX: viewportTransform.x,
    maxX: viewportTransform.x + viewportDimensions.width,
    minY: viewportTransform.y,
    maxY: viewportTransform.y + viewportDimensions.height,
  }), [viewportTransform, viewportDimensions]);

  const triggerNodes = useMemo(() => {
    return workflow.nodes.filter((node: any) => 
      nodeHelpers.isTriggerNode(node.type || '') || 
      node.type === START_NODE_TYPE ||
      node.type?.includes('Trigger')
    );
  }, [workflow.nodes, nodeHelpers]);

  const containsTriggerNodes = useMemo(() => triggerNodes.length > 0, [triggerNodes]);
  const allTriggerNodesDisabled = useMemo(() => {
    const disabledTriggerNodes = triggerNodes.filter((node: any) => node.disabled);
    return disabledTriggerNodes.length === triggerNodes.length;
  }, [triggerNodes]);

  // Chat trigger gating
  const chatTriggerNode = useMemo(() => workflow.nodes.find((n: any) => n.type === CHAT_TRIGGER_NODE_TYPE), [workflow.nodes]);
  const containsChatTriggerNodes = useMemo(() => {
    if (executionsStore.getState().activeExecution?.status === 'waiting') return false;
    return workflow.nodes.some((n: any) => [MANUAL_CHAT_TRIGGER_NODE_TYPE, CHAT_TRIGGER_NODE_TYPE].includes(n.type) && n.disabled !== true);
  }, [workflow.nodes, executionsStore]);
  const isOnlyChatTriggerNodeActive = useMemo(() => {
    return triggerNodes.every((node: any) => node.disabled || node.type === CHAT_TRIGGER_NODE_TYPE);
  }, [triggerNodes]);
  const chatTriggerNodePinnedData = useMemo(() => {
    // Placeholder: in real impl, get from workflows store pin data
    return chatTriggerNode ? {} : null;
  }, [chatTriggerNode]);

  const isWorkflowRunning = useMemo(() => {
    return executionsStore.getState().activeExecution?.status === 'running';
  }, [executionsStore]);

  const isExecutionWaitingForWebhook = useMemo(() => {
    return executionsStore.getState().activeExecution?.status === 'waiting';
  }, [executionsStore]);

  const isExecutionDisabled = useMemo(() => {
    // Disable when only chat trigger active without pinned data
    if (containsChatTriggerNodes && isOnlyChatTriggerNodeActive && !chatTriggerNodePinnedData) return true;
    return !containsTriggerNodes || allTriggerNodesDisabled;
  }, [containsChatTriggerNodes, isOnlyChatTriggerNodeActive, chatTriggerNodePinnedData, containsTriggerNodes, allTriggerNodesDisabled]);

  const isRunWorkflowButtonVisible = useMemo(() => {
    return !isOnlyChatTriggerNodeActive || !!chatTriggerNodePinnedData;
  }, [isOnlyChatTriggerNodeActive, chatTriggerNodePinnedData]);

  // Enhanced event handlers
  const addNode = useCallback((name: string) => {
    const id = uuid();
    const newNode = { id, name, position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 } };
    setWorkflow((w) => ({
      ...w,
      nodes: [...w.nodes, newNode],
    }));
    canvasOperations.addNodes([{ type: 'custom', position: [newNode.position.x, newNode.position.y] }], { trackHistory: true });
    telemetry.track('User added node', { nodeType: 'custom' });
  }, [canvasOperations, telemetry]);

  const connectNodes = useCallback((fromId: string, toId: string) => {
    canvasOperations.createConnection({ source: fromId, target: toId }, { trackHistory: true });
    setWorkflow((w) => ({
      ...w,
      connections: {
        ...w.connections,
        [fromId]: [{ node: toId, type: 'main', index: 0 }],
      },
    }));
    telemetry.track('User connected nodes');
  }, [canvasOperations, telemetry]);

  const canvasNodes: CanvasNode[] = useMemo(
    () =>
      workflow.nodes.map((n) => ({
        id: n.id,
        data: { label: n.name },
        position: { x: n.position?.x ?? 100, y: n.position?.y ?? 100 },
        selected: selectedNodeId === n.id,
      })),
    [workflow.nodes, selectedNodeId],
  );

  const canvasEdges: CanvasEdge[] = useMemo(() => {
    const edges: CanvasEdge[] = [];
    Object.entries(workflow.connections || {}).forEach(([fromId, conns]) => {
      if (Array.isArray(conns)) {
        conns.forEach((c: any, idx: number) => {
          if (c?.node) edges.push({ id: `${fromId}-${c.node}-${idx}`, source: fromId, target: c.node });
        });
      }
    });
    return edges;
  }, [workflow.connections]);

  // Enhanced canvas event handlers
  const onCanvasChange = useCallback((nodes: CanvasNode[], edges: CanvasEdge[]) => {
    if (!checkIfEditingIsAllowed()) return;
    setWorkflow((w) => ({
      ...w,
      nodes: w.nodes.map((n) => {
        const cn = nodes.find((m) => m.id === n.id);
        return cn ? { ...n, position: cn.position, selected: cn.selected } as any : n as any;
      }),
      connections: edges.reduce<Record<string, any[]>>((acc, e) => {
        acc[e.source] = acc[e.source] || [];
        acc[e.source].push({ node: e.target, type: 'main', index: 0 });
        return acc;
      }, {}),
    }));
    setSelectedNodeIds(new Set(nodes.filter((n) => n.selected).map((n) => n.id)));
    historyStore.getState().pushCommandToUndo(new (require('../../src3/models/history').MoveNodeCommand)('', [0, 0], [0, 0], Date.now()));
  }, [historyStore, checkIfEditingIsAllowed]);

  const onViewportChange = useCallback((viewport: ViewportTransform, dimensions: Dimensions) => {
    setViewportTransform(viewport);
    setViewportDimensions(dimensions);
    try {
      uiStore.getState().setNodeViewOffsetPosition([viewport.x, viewport.y]);
    } catch {}
  }, [uiStore]);

  const onRunWorkflow = useCallback(async () => {
    if (!checkIfEditingIsAllowed()) return;
    try {
      await runWorkflow.runEntireWorkflow('main');
      telemetry.track('User ran workflow');
    } catch (error) {
      console.error('Failed to run workflow:', error);
    }
  }, [runWorkflow, telemetry, checkIfEditingIsAllowed]);

  const onStopExecution = useCallback(async () => {
    setIsStoppingExecution(true);
    try {
      const activeExecution = executionsStore.getState().activeExecution;
      if (activeExecution) {
        await runWorkflow.stopCurrentExecution(activeExecution.id);
        telemetry.track('User stopped execution');
      }
    } catch (error) {
      console.error('Failed to stop execution:', error);
    } finally {
      setIsStoppingExecution(false);
    }
  }, [runWorkflow, executionsStore, telemetry]);

  const onStopWaitingForWebhook = useCallback(async () => {
    try {
      await runWorkflow.stopWaitingForWebhook();
      telemetry.track('User stopped waiting for webhook');
    } catch (error) {
      console.error('Failed to stop waiting for webhook:', error);
    }
  }, [runWorkflow, telemetry]);

  const onOpenChat = useCallback(() => {
    logsStore.getState().toggleOpen(true);
    telemetry.track('User opened chat');
  }, [logsStore, telemetry]);

  const onToggleFocusPanel = useCallback(() => {
    focusPanelStore.getState().toggleFocusPanel();
    telemetry.track('User toggled focus panel');
  }, [focusPanelStore, telemetry]);

  // Enhanced functionality
  const onExtractWorkflow = useCallback((nodeIds: string[]) => {
    const extracted = workflowExtraction.extractWorkflow(nodeIds);
    console.log('Extracted workflow:', extracted);
    telemetry.track('User extracted workflow', { nodeCount: nodeIds.length });
  }, [workflowExtraction, telemetry]);

  const onOpenExecution = useCallback(async (executionId: string, nodeId?: string) => {
    try {
      await executionDebugging.debugExecution(executionId);
      if (nodeId) {
        canvasOperations.setNodeActive(nodeId);
      }
      telemetry.track('User opened execution', { executionId, nodeId });
    } catch (error) {
      toast.showError(error, 'Failed to open execution');
    }
  }, [executionDebugging, canvasOperations, telemetry, toast]);

  const onSourceControlPull = useCallback(async () => {
    try {
      await sourceControlStore.getState().pull();
      // Refresh related data
      await Promise.all([
        credentialsStore.getState().fetchAllCredentials(),
        tagsStore.getState().fetchTags(),
      ]);
      // Reload workflow if applicable
      if (workflow.id) {
        const wf = await fetchJson<Workflow>(`/api/rest/workflows/${workflow.id}`);
        setWorkflow(wf);
        documentTitle.setWorkflowTitle(wf.name);
      }
      toast.showSuccess('Successfully pulled latest changes');
      telemetry.track('User pulled source control changes');
    } catch (error) {
      toast.showError(error, 'Failed to pull changes');
    }
  }, [sourceControlStore, toast, telemetry, workflow.id, credentialsStore, tagsStore, documentTitle]);

  const onImportWorkflowData = useCallback(async (data: any) => {
    try {
      const success = await workflowHelpers.importWorkflow(data);
      if (success) {
        toast.showSuccess('Workflow imported successfully');
        telemetry.track('User imported workflow');
      }
    } catch (error) {
      toast.showError(error, 'Failed to import workflow');
    }
  }, [workflowHelpers, toast, telemetry]);

  const onImportWorkflowUrl = useCallback(async (url: string) => {
    if (!VALID_WORKFLOW_IMPORT_URL_REGEX.test(url)) {
      toast.showError(new Error('Invalid URL'), 'Invalid workflow URL');
      return;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      await onImportWorkflowData(data);
    } catch (error) {
      toast.showError(error, 'Failed to import workflow from URL');
    }
  }, [onImportWorkflowData, toast]);

  const isReadOnlyEnv = sourceControlStore.preferences.branchReadOnly;
  const [readOnlyNotified, setReadOnlyNotified] = useState(false);

  const checkIfEditingIsAllowed = useCallback(() => {
    if (!isReadOnlyEnv) return true;
    if (!readOnlyNotified) {
      toast.showMessage({ title: 'Read-only environment', message: 'You cannot edit or run workflows on this branch.', type: 'info' });
      setReadOnlyNotified(true);
    }
    return false;
  }, [isReadOnlyEnv, readOnlyNotified, toast]);

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 320px', minHeight: 'calc(100vh - 32px)' }}>
      <aside style={{ borderRight: '1px solid #e5e5e5', padding: 16 }}>
        <h3>Workflow</h3>
        <label>
          Name
          <input
            value={workflow.name}
            onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
            style={{ display: 'block', width: '100%' }}
          />
        </label>
        <div style={{ marginTop: 12 }}>
          {mode === 'new' ? (
            <button onClick={saveNew} disabled={!canSave || saving}>
              {saving ? 'Saving…' : 'Save new'}
            </button>
          ) : (
            <button onClick={updateExisting} disabled={!canSave || saving}>
              {saving ? 'Saving…' : 'Update'}
            </button>
          )}
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <hr style={{ margin: '16px 0' }} />
        <h4>Browse nodes</h4>
        <div style={{ maxHeight: 360, overflow: 'auto' }}>
          <NodeCreator />
        </div>
        <hr style={{ margin: '16px 0' }} />
        <button onClick={() => nodeCreatorStore.getState().openNodeCreatorForTriggerNodes(NODE_CREATOR_OPEN_SOURCES.ADD_EVALUATION_TRIGGER_BUTTON)}>
          Open Node Creator
        </button>
      </aside>
      
      <section style={{ padding: 0, position: 'relative' }}>
        <div style={{ padding: '8px 12px', borderBottom: '1px solid #eee' }}>
          <TopBar />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2 style={{ margin: 0 }}>{workflow.name}</h2>
            {workflow.id && <small style={{ color: '#666' }}>id: {workflow.id}</small>}
          </div>
          
          <div style={{ display: 'flex', gap: 8 }}>
            <Tooltip content="Toggle executions tab">
              <button onClick={() => setShowExecutions((v) => !v)}>Executions</button>
            </Tooltip>
            <Tooltip content="Toggle focus panel">
              <button onClick={onToggleFocusPanel}>Focus Panel</button>
            </Tooltip>
            <Tooltip content="Run or stop this workflow">
              <RunControls workflowId={workflow.id} />
            </Tooltip>
          </div>
        </div>
        
        <div 
          style={{ border: '1px solid #ddd', borderRadius: 8, padding: 0, minHeight: '60%' }} 
          onContextMenu={(e) => {
            e.preventDefault();
            // TODO: open context menu with actions (duplicate, delete, align)
          }} 
          onDrop={(e) => {
            if (!checkIfEditingIsAllowed()) return;
            const data = e.dataTransfer.getData('application/x-sv-node');
            if (data) {
              const item = JSON.parse(data);
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
              setWorkflow((w) => ({ ...w, nodes: [...w.nodes, { id: uuid(), name: item.name || 'Node', position: pos }] }));
              historyStore.getState().pushCommandToUndo(new (require('../../src3/models/history').AddNodeCommand)({ id: uuid(), name: item.name || 'Node', position: pos }, Date.now()));
            }
          }} 
          onDragOver={(e) => e.preventDefault()}
        >
          <Canvas 
            nodes={canvasNodes} 
            edges={canvasEdges} 
            onChange={onCanvasChange} 
            onSelectNode={setSelectedNodeId}
            onViewportChange={onViewportChange}
            onPaneClick={(pos) => {
              // Track last click position equivalent if needed; for now, just clear selection
              setSelectedNodeId(undefined);
            }}
          />
        </div>
        
        {/* Read-only callout */}
        {isReadOnlyEnv && (
          <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', background: '#fff7e6', border: '1px solid #ffe58f', padding: '8px 12px', borderRadius: 6 }}>
            You cannot edit or run workflows in read-only environment
          </div>
        )}
        
        {/* Enhanced Execution Controls */}
        <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
          <div onMouseEnter={() => nodeViewEventBus.emit('runWorkflowButton:mouseenter')} onMouseLeave={() => nodeViewEventBus.emit('runWorkflowButton:mouseleave')}>
            {isRunWorkflowButtonVisible && (
              <CanvasRunWorkflowButton
                waitingForWebhook={isExecutionWaitingForWebhook}
                disabled={isExecutionDisabled || isReadOnlyEnv}
                executing={isWorkflowRunning}
                triggerNodes={triggerNodes}
                onExecute={onRunWorkflow}
                getNodeType={nodeTypesStore.getNodeType}
                selectedTriggerNodeName={selectedTriggerNodeName}
                onSelectTriggerNode={setSelectedTriggerNodeName}
              />
            )}
          </div>
          
          {isWorkflowRunning && !isExecutionWaitingForWebhook && (
            <CanvasStopCurrentExecutionButton
              stopping={isStoppingExecution}
              onClick={onStopExecution}
            />
          )}
          
          {isWorkflowRunning && isExecutionWaitingForWebhook && (
            <CanvasStopWaitingForWebhookButton onClick={onStopWaitingForWebhook} />
          )}
          
          {containsChatTriggerNodes && (
            isLogsPanelOpen ? (
              <CanvasChatButton
                type="tertiary"
                label="Hide Chat"
                onClick={() => logsStore.getState().toggleOpen(false)}
              />
            ) : (
              <KeyboardShortcutTooltip label="Open Chat" shortcut={{ keys: ['c'] }}>
                <CanvasChatButton
                  type={isRunWorkflowButtonVisible ? 'secondary' : 'primary'}
                  label="Chat"
                  onClick={onOpenChat}
                />
              </KeyboardShortcutTooltip>
            )
          )}
        </div>
        
        {/* Setup Credentials Button */}
        <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
          <SetupWorkflowCredentialsButton />
        </div>
        
        {showExecutions && (
          <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 0, minHeight: '40%', marginTop: 8 }}>
            <ExecutionsTab workflowId={workflow.id} />
          </div>
        )}
      </section>
      
      <aside>
        <RightPanel selectedNodeId={selectedNodeId} />
      </aside>
      
      {/* Focus Panel */}
      <FocusPanel 
        isCanvasReadOnly={false}
        onSaveKeyboardShortcut={workflowSaving.saveCurrentWorkflow}
      />
    </div>
  );
}