"use client";
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNDVStore } from '../../stores/ndv';
import { useCanvasStore } from '../../stores/canvas';
import { useWorkflowStore } from '../../stores/workflows';
import { useCanvasOperations } from '../../hooks/useCanvasOperations';
import { useNodeTypesStore } from '../../stores/nodeTypes';
import { useExecutionsStore } from '../../stores/executions';
import { useLogsStore } from '../../stores/logs';
import { useAgentRequestStore } from '../../stores/agentRequest';
import { usePostHogStore } from '../../stores/posthog';
import { useBuilderStore } from '../../stores/builder';
import { 
  getNodeViewTab,
  type ViewportBoundaries 
} from '../../utils/nodeViewUtils';
import { canvasEventBus } from '../../utils/eventBus';

export type NodeDetailsViewV2Props = {
  isOpen: boolean;
  onClose: () => void;
  nodeId?: string;
  nodeName?: string;
  readOnly?: boolean;
  isProductionExecutionPreview?: boolean;
  pushRef?: string | null;
  onNodeRename?: (oldName: string, newName: string) => void;
  onParameterChange?: (nodeId: string, parameters: Record<string, any>) => void;
  onConnectionChange?: (nodeId: string, connections: any) => void;
  onCredentialChange?: (nodeId: string, credentials: Record<string, any>) => void;
  onExecute?: (nodeId: string) => void;
  onStop?: (nodeId: string) => void;
  onDebug?: (nodeId: string) => void;
  experimental?: boolean;
};

export type ParameterGroup = {
  name: string;
  label: string;
  description?: string;
  parameters: ParameterField[];
  collapsed?: boolean;
  required?: boolean;
};

export type ParameterField = {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect' | 'json' | 'expression' | 'credential' | 'file' | 'code' | 'date' | 'time' | 'datetime' | 'color' | 'range' | 'url' | 'email' | 'phone';
  label: string;
  description?: string;
  required?: boolean;
  default?: any;
  options?: Array<{ value: string; label: string; description?: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => string | null;
  };
  displayOptions?: {
    show?: Record<string, any>;
    hide?: Record<string, any>;
  };
  ui?: {
    placeholder?: string;
    rows?: number;
    cols?: number;
    step?: number;
    autocomplete?: boolean;
    spellcheck?: boolean;
    readonly?: boolean;
    disabled?: boolean;
  };
  advanced?: boolean;
  deprecated?: boolean;
  experimental?: boolean;
};

export type ConnectionPointV2 = {
  id: string;
  name: string;
  type: 'input' | 'output';
  dataType?: string;
  required?: boolean;
  multiple?: boolean;
  description?: string;
  validation?: {
    dataType?: string;
    required?: boolean;
    custom?: (data: any) => string | null;
  };
  ui?: {
    color?: string;
    icon?: string;
    tooltip?: string;
  };
};

export type CredentialFieldV2 = {
  name: string;
  type: string;
  label: string;
  description?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string; description?: string }>;
  validation?: {
    required?: boolean;
    custom?: (value: any) => string | null;
  };
  ui?: {
    placeholder?: string;
    icon?: string;
    color?: string;
  };
};

export default function NodeDetailsViewV2(props: NodeDetailsViewV2Props) {
  const {
    isOpen,
    onClose,
    nodeId,
    nodeName,
    readOnly = false,
    isProductionExecutionPreview = false,
    pushRef = null,
    onNodeRename,
    onParameterChange,
    onConnectionChange,
    onCredentialChange,
    onExecute,
    onStop,
    onDebug,
    experimental = false,
  } = props;

  const ndvStore = useNDVStore();
  const canvasStore = useCanvasStore();
  const workflowStore = useWorkflowStore();
  const canvasOperations = useCanvasOperations();
  const nodeTypesStore = useNodeTypesStore();
  const executionsStore = useExecutionsStore();
  const logsStore = useLogsStore();
  const agentRequestStore = useAgentRequestStore();
  const postHogStore = usePostHogStore();
  const builderStore = useBuilderStore();

  const [selectedTab, setSelectedTab] = useState('parameters');
  const [isRenaming, setIsRenaming] = useState(false);
  const [newNodeName, setNewNodeName] = useState('');
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [credentials, setCredentials] = useState<Record<string, any>>({});
  const [connections, setConnections] = useState<{
    inputs: Record<string, any[]>;
    outputs: Record<string, any[]>;
  }>({ inputs: {}, outputs: {} });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionData, setExecutionData] = useState<any>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showExperimental, setShowExperimental] = useState(experimental);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiAssistant, setAiAssistant] = useState(false);

  // Get current node data
  const currentNode = useMemo(() => {
    if (!nodeId) return null;
    return workflowStore.current?.nodes.find(n => n.id === nodeId);
  }, [nodeId, workflowStore.current]);

  const nodeType = useMemo(() => {
    if (!currentNode?.type) return null;
    return nodeTypesStore.getNodeType(currentNode.type);
  }, [currentNode?.type, nodeTypesStore]);

  // Group parameters by category
  const parameterGroups = useMemo(() => {
    if (!nodeType?.parameters) return [];

    const groups: Record<string, ParameterGroup> = {};
    
    nodeType.parameters.forEach(param => {
      const groupName = param.group || 'General';
      if (!groups[groupName]) {
        groups[groupName] = {
          name: groupName,
          label: groupName,
          parameters: [],
        };
      }
      groups[groupName].parameters.push(param);
    });

    return Object.values(groups);
  }, [nodeType?.parameters]);

  // Filter parameters based on search and visibility
  const filteredParameterGroups = useMemo(() => {
    return parameterGroups.map(group => ({
      ...group,
      parameters: group.parameters.filter(param => {
        // Filter by search term
        if (searchTerm && !param.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !param.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }

        // Filter by advanced/experimental settings
        if (param.advanced && !showAdvanced) return false;
        if (param.experimental && !showExperimental) return false;
        if (param.deprecated) return false;

        return true;
      }),
    })).filter(group => group.parameters.length > 0);
  }, [parameterGroups, searchTerm, showAdvanced, showExperimental]);

  // Initialize data when node changes
  useEffect(() => {
    if (currentNode) {
      setNewNodeName(currentNode.name);
      setParameters(currentNode.parameters || {});
      setCredentials(currentNode.credentials || {});
      setConnections(currentNode.connections || { inputs: {}, outputs: {} });
      setValidationErrors({});
      setIsRenaming(false);
      setSearchTerm('');
    }
  }, [currentNode]);

  // Update NDV store
  useEffect(() => {
    if (isOpen && currentNode) {
      ndvStore.setActiveNode(currentNode.name, currentNode.id);
      ndvStore.setReadOnly(readOnly);
      ndvStore.setProductionExecutionPreview(isProductionExecutionPreview);
      ndvStore.setPushRef(pushRef);
      ndvStore.setSelectedTab(selectedTab);
      ndvStore.setNodeParameters(parameters);
      ndvStore.setNodeCredentials(credentials);
      ndvStore.setNodeConnections(connections);
    } else if (!isOpen) {
      ndvStore.closeNDV();
    }
  }, [isOpen, currentNode, readOnly, isProductionExecutionPreview, pushRef, selectedTab, parameters, credentials, connections, ndvStore]);

  // Handle parameter changes with AI assistance
  const handleParameterChange = useCallback(async (key: string, value: any) => {
    const newParameters = { ...parameters, [key]: value };
    setParameters(newParameters);
    
    // Validate parameter
    const field = nodeType?.parameters?.find(p => p.name === key);
    if (field?.validation) {
      const error = validateParameter(field, value);
      setValidationErrors(prev => ({
        ...prev,
        [key]: error || '',
      }));
    }

    // AI assistance for parameter optimization
    if (aiAssistant && field && value) {
      try {
        const requestId = agentRequestStore.createRequest({
          workflowId: workflowStore.current?.id || '',
          nodeId: currentNode?.id || '',
          nodeName: currentNode?.name || '',
          type: 'parameter',
          prompt: `Optimize parameter "${field.label}" with value "${value}" for node type "${nodeType?.displayName}". Provide suggestions for better configuration.`,
        });

        // Track AI request
        postHogStore.track('ai_parameter_assistance_requested', {
          nodeType: currentNode?.type,
          parameterName: key,
          parameterType: field.type,
        });
      } catch (error) {
        console.error('Failed to request AI assistance:', error);
      }
    }

    // Update workflow
    if (currentNode && onParameterChange) {
      onParameterChange(currentNode.id, newParameters);
    }

    // Track in PostHog
    postHogStore.track('node_parameter_changed_v2', {
      nodeType: currentNode?.type,
      parameterName: key,
      parameterType: field?.type,
      aiAssisted: aiAssistant,
    });
  }, [parameters, nodeType, currentNode, onParameterChange, postHogStore, aiAssistant, agentRequestStore, workflowStore]);

  // Handle credential changes
  const handleCredentialChange = useCallback((key: string, value: any) => {
    const newCredentials = { ...credentials, [key]: value };
    setCredentials(newCredentials);

    if (currentNode && onCredentialChange) {
      onCredentialChange(currentNode.id, newCredentials);
    }

    // Track in PostHog
    postHogStore.track('node_credential_changed_v2', {
      nodeType: currentNode?.type,
      credentialName: key,
    });
  }, [credentials, currentNode, onCredentialChange, postHogStore]);

  // Handle connection changes with validation
  const handleConnectionChange = useCallback((connectionType: 'input' | 'output', connectionId: string, connections: any[]) => {
    const newConnections = {
      ...connections,
      [connectionType === 'input' ? 'inputs' : 'outputs']: {
        ...connections[connectionType === 'input' ? 'inputs' : 'outputs'],
        [connectionId]: connections,
      },
    };
    setConnections(newConnections);

    // Validate connections
    const connectionPoint = nodeType?.inputConnections?.find(c => c.id === connectionId) ||
                          nodeType?.outputConnections?.find(c => c.id === connectionId);
    
    if (connectionPoint?.validation) {
      connections.forEach(connection => {
        const error = connectionPoint.validation?.custom?.(connection);
        if (error) {
          setValidationErrors(prev => ({
            ...prev,
            [`connection_${connectionId}`]: error,
          }));
        }
      });
    }

    if (currentNode && onConnectionChange) {
      onConnectionChange(currentNode.id, newConnections);
    }
  }, [connections, currentNode, onConnectionChange, nodeType]);

  // Handle node rename with AI suggestions
  const handleNodeRename = useCallback(async (newName: string) => {
    if (!currentNode || newName === currentNode.name) return;

    if (onNodeRename) {
      onNodeRename(currentNode.name, newName);
    }

    // Update workflow store
    const updatedNodes = workflowStore.current?.nodes.map(node =>
      node.id === currentNode.id ? { ...node, name: newName } : node
    );
    if (updatedNodes) {
      workflowStore.current = { ...workflowStore.current!, nodes: updatedNodes };
    }

    setIsRenaming(false);
    setNewNodeName(newName);

    // AI-powered name suggestion
    if (aiAssistant) {
      try {
        agentRequestStore.createRequest({
          workflowId: workflowStore.current?.id || '',
          nodeId: currentNode.id,
          nodeName: newName,
          type: 'parameter',
          prompt: `Suggest a better name for node "${newName}" of type "${nodeType?.displayName}". Consider the node's purpose and context.`,
        });
      } catch (error) {
        console.error('Failed to get AI name suggestion:', error);
      }
    }

    // Track in PostHog
    postHogStore.track('node_renamed_v2', {
      nodeType: currentNode.type,
      oldName: currentNode.name,
      newName,
      aiAssisted: aiAssistant,
    });
  }, [currentNode, onNodeRename, workflowStore, postHogStore, aiAssistant, agentRequestStore, nodeType]);

  // Enhanced execution with AI debugging
  const handleExecute = useCallback(async () => {
    if (!currentNode || isExecuting) return;

    setIsExecuting(true);
    try {
      if (onExecute) {
        await onExecute(currentNode.id);
      } else {
        await canvasOperations.runWorkflow('ndv_v2');
      }

      // AI-powered execution analysis
      if (aiAssistant) {
        try {
          agentRequestStore.createRequest({
            workflowId: workflowStore.current?.id || '',
            nodeId: currentNode.id,
            nodeName: currentNode.name,
            type: 'execution',
            prompt: `Analyze the execution of node "${currentNode.name}" and provide insights on performance, potential issues, and optimization suggestions.`,
          });
        } catch (error) {
          console.error('Failed to get AI execution analysis:', error);
        }
      }

      // Track in PostHog
      postHogStore.track('node_executed_v2', {
        nodeType: currentNode.type,
        nodeName: currentNode.name,
        aiAssisted: aiAssistant,
      });
    } catch (error) {
      logsStore.addLog({
        level: 'error',
        message: `Failed to execute node: ${error}`,
        nodeId: currentNode.id,
        nodeName: currentNode.name,
        source: 'execution',
      });
    } finally {
      setIsExecuting(false);
    }
  }, [currentNode, isExecuting, onExecute, canvasOperations, postHogStore, logsStore, aiAssistant, agentRequestStore, workflowStore]);

  // Handle stop execution
  const handleStop = useCallback(async () => {
    if (!currentNode) return;

    try {
      if (onStop) {
        await onStop(currentNode.id);
      } else {
        await canvasOperations.stopCurrentExecution();
      }

      // Track in PostHog
      postHogStore.track('node_execution_stopped_v2', {
        nodeType: currentNode.type,
        nodeName: currentNode.name,
      });
    } catch (error) {
      logsStore.addLog({
        level: 'error',
        message: `Failed to stop node execution: ${error}`,
        nodeId: currentNode.id,
        nodeName: currentNode.name,
        source: 'execution',
      });
    }
  }, [currentNode, onStop, canvasOperations, postHogStore, logsStore]);

  // Enhanced debug with AI insights
  const handleDebug = useCallback(async () => {
    if (!currentNode) return;

    try {
      if (onDebug) {
        await onDebug(currentNode.id);
      }

      // AI-powered debugging assistance
      if (aiAssistant) {
        try {
          agentRequestStore.createRequest({
            workflowId: workflowStore.current?.id || '',
            nodeId: currentNode.id,
            nodeName: currentNode.name,
            type: 'debug',
            prompt: `Debug node "${currentNode.name}" and provide insights on potential issues, configuration problems, and optimization opportunities.`,
          });
        } catch (error) {
          console.error('Failed to get AI debugging assistance:', error);
        }
      }

      // Track in PostHog
      postHogStore.track('node_debugged_v2', {
        nodeType: currentNode.type,
        nodeName: currentNode.name,
        aiAssisted: aiAssistant,
      });
    } catch (error) {
      logsStore.addLog({
        level: 'error',
        message: `Failed to debug node: ${error}`,
        nodeId: currentNode.id,
        nodeName: currentNode.name,
        source: 'execution',
      });
    }
  }, [currentNode, onDebug, postHogStore, logsStore, aiAssistant, agentRequestStore, workflowStore]);

  // Enhanced parameter validation
  const validateParameter = useCallback((field: ParameterField, value: any): string | null => {
    if (field.required && (value === undefined || value === null || value === '')) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      const { min, max, pattern, custom } = field.validation;

      if (min !== undefined && value < min) {
        return `${field.label} must be at least ${min}`;
      }

      if (max !== undefined && value > max) {
        return `${field.label} must be at most ${max}`;
      }

      if (pattern && typeof value === 'string' && !new RegExp(pattern).test(value)) {
        return `${field.label} format is invalid`;
      }

      if (custom) {
        return custom(value);
      }
    }

    return null;
  }, []);

  // Validate all parameters
  const validateAllParameters = useCallback(() => {
    if (!nodeType?.parameters) return true;

    const errors: Record<string, string> = {};
    let isValid = true;

    nodeType.parameters.forEach(field => {
      const error = validateParameter(field, parameters[field.name]);
      if (error) {
        errors[field.name] = error;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  }, [nodeType?.parameters, parameters, validateParameter]);

  // Toggle parameter group collapse
  const toggleGroupCollapse = useCallback((groupName: string) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  }, []);

  // Render enhanced parameter field
  const renderParameterField = useCallback((field: ParameterField) => {
    const value = parameters[field.name];
    const error = validationErrors[field.name];

    const commonProps = {
      id: field.name,
      name: field.name,
      value: value || field.default || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        let newValue: any = e.target.value;
        
        // Convert value based on type
        switch (field.type) {
          case 'number':
          case 'range':
            newValue = parseFloat(newValue) || 0;
            break;
          case 'boolean':
            newValue = (e.target as HTMLInputElement).checked;
            break;
          case 'json':
            try {
              newValue = JSON.parse(newValue);
            } catch {
              // Keep as string if invalid JSON
            }
            break;
          case 'date':
          case 'time':
          case 'datetime':
            newValue = new Date(newValue);
            break;
        }

        handleParameterChange(field.name, newValue);
      },
      disabled: readOnly || field.ui?.disabled,
      required: field.required,
      placeholder: field.ui?.placeholder || field.description,
      autoComplete: field.ui?.autocomplete ? 'on' : 'off',
      spellCheck: field.ui?.spellcheck,
      readOnly: field.ui?.readonly,
    };

    const fieldClass = `parameter-field ${field.type} ${error ? 'error' : ''} ${field.advanced ? 'advanced' : ''} ${field.experimental ? 'experimental' : ''} ${field.deprecated ? 'deprecated' : ''}`;

    switch (field.type) {
      case 'string':
      case 'expression':
      case 'url':
      case 'email':
      case 'phone':
        return (
          <div key={field.name} className={fieldClass}>
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
              {field.experimental && <span className="experimental-badge">🧪</span>}
              {field.deprecated && <span className="deprecated-badge">⚠️</span>}
            </label>
            <input
              type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : field.type === 'phone' ? 'tel' : 'text'}
              {...commonProps}
            />
            {error && <div className="error-message">{error}</div>}
            {field.description && <div className="field-description">{field.description}</div>}
          </div>
        );

      case 'number':
      case 'range':
        return (
          <div key={field.name} className={fieldClass}>
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type={field.type}
              {...commonProps}
              min={field.validation?.min}
              max={field.validation?.max}
              step={field.ui?.step}
            />
            {field.type === 'range' && <span className="range-value">{value}</span>}
            {error && <div className="error-message">{error}</div>}
            {field.description && <div className="field-description">{field.description}</div>}
          </div>
        );

      case 'boolean':
        return (
          <div key={field.name} className={`${fieldClass} checkbox`}>
            <label>
              <input
                type="checkbox"
                checked={value || false}
                onChange={(e) => handleParameterChange(field.name, e.target.checked)}
                disabled={readOnly || field.ui?.disabled}
              />
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            {field.description && <div className="field-description">{field.description}</div>}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className={fieldClass}>
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <select {...commonProps}>
              <option value="">Select...</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <div className="error-message">{error}</div>}
            {field.description && <div className="field-description">{field.description}</div>}
          </div>
        );

      case 'multiselect':
        return (
          <div key={field.name} className={fieldClass}>
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <select
              {...commonProps}
              multiple
              value={Array.isArray(value) ? value : []}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                handleParameterChange(field.name, selectedOptions);
              }}
            >
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <div className="error-message">{error}</div>}
            {field.description && <div className="field-description">{field.description}</div>}
          </div>
        );

      case 'json':
      case 'code':
        return (
          <div key={field.name} className={fieldClass}>
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <textarea
              {...commonProps}
              value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value || ''}
              rows={field.ui?.rows || 5}
              cols={field.ui?.cols}
            />
            {error && <div className="error-message">{error}</div>}
            {field.description && <div className="field-description">{field.description}</div>}
          </div>
        );

      case 'credential':
        return (
          <div key={field.name} className={fieldClass}>
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <select {...commonProps}>
              <option value="">Select credential...</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <div className="error-message">{error}</div>}
            {field.description && <div className="field-description">{field.description}</div>}
          </div>
        );

      case 'file':
        return (
          <div key={field.name} className={fieldClass}>
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type="file"
              {...commonProps}
              onChange={(e) => {
                const file = e.target.files?.[0];
                handleParameterChange(field.name, file);
              }}
            />
            {error && <div className="error-message">{error}</div>}
            {field.description && <div className="field-description">{field.description}</div>}
          </div>
        );

      case 'date':
      case 'time':
      case 'datetime':
        return (
          <div key={field.name} className={fieldClass}>
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type={field.type}
              {...commonProps}
            />
            {error && <div className="error-message">{error}</div>}
            {field.description && <div className="field-description">{field.description}</div>}
          </div>
        );

      case 'color':
        return (
          <div key={field.name} className={fieldClass}>
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type="color"
              {...commonProps}
            />
            {error && <div className="error-message">{error}</div>}
            {field.description && <div className="field-description">{field.description}</div>}
          </div>
        );

      default:
        return null;
    }
  }, [parameters, validationErrors, readOnly, handleParameterChange]);

  // Render enhanced credential field
  const renderCredentialField = useCallback((field: CredentialFieldV2) => {
    const value = credentials[field.name];

    return (
      <div key={field.name} className={`credential-field ${field.ui?.color || ''}`}>
        <label htmlFor={field.name}>
          {field.ui?.icon && <span className="field-icon">{field.ui.icon}</span>}
          {field.label}
          {field.required && <span className="required">*</span>}
        </label>
        <select
          id={field.name}
          value={value || ''}
          onChange={(e) => handleCredentialChange(field.name, e.target.value)}
          disabled={readOnly}
          required={field.required}
          placeholder={field.ui?.placeholder}
        >
          <option value="">Select credential...</option>
          {field.options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {field.description && <div className="field-description">{field.description}</div>}
      </div>
    );
  }, [credentials, readOnly, handleCredentialChange]);

  // Render enhanced connection point
  const renderConnectionPoint = useCallback((point: ConnectionPointV2) => {
    const pointConnections = connections[point.type === 'input' ? 'inputs' : 'outputs'][point.id] || [];

    return (
      <div key={point.id} className={`connection-point ${point.ui?.color || ''}`}>
        <div className="connection-header">
          <span className="connection-name">
            {point.ui?.icon && <span className="connection-icon">{point.ui.icon}</span>}
            {point.name}
          </span>
          <span className="connection-type">{point.type}</span>
          {point.required && <span className="required">*</span>}
          {point.ui?.tooltip && <span className="tooltip" title={point.ui.tooltip}>ℹ️</span>}
        </div>
        {point.description && <div className="connection-description">{point.description}</div>}
        <div className="connection-list">
          {pointConnections.map((connection, index) => (
            <div key={index} className="connection-item">
              <span>{connection.node}</span>
              <button
                onClick={() => {
                  // Remove connection
                  const newConnections = { ...connections };
                  newConnections[point.type === 'input' ? 'inputs' : 'outputs'][point.id] = 
                    pointConnections.filter((_, i) => i !== index);
                  setConnections(newConnections);
                }}
                disabled={readOnly}
              >
                Remove
              </button>
            </div>
          ))}
          {pointConnections.length === 0 && (
            <div className="no-connections">No connections</div>
          )}
        </div>
      </div>
    );
  }, [connections, readOnly]);

  if (!isOpen || !currentNode) {
    return null;
  }

  return (
    <div className="node-details-view-v2">
      <div className="ndv-header">
        <div className="node-info">
          {isRenaming ? (
            <input
              type="text"
              value={newNodeName}
              onChange={(e) => setNewNodeName(e.target.value)}
              onBlur={() => handleNodeRename(newNodeName)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNodeRename(newNodeName);
                } else if (e.key === 'Escape') {
                  setIsRenaming(false);
                  setNewNodeName(currentNode.name);
                }
              }}
              autoFocus
              className="rename-input"
            />
          ) : (
            <h3 onClick={() => !readOnly && setIsRenaming(true)}>
              {currentNode.name}
              {!readOnly && <span className="edit-icon">✏️</span>}
            </h3>
          )}
          <span className="node-type">{currentNode.type}</span>
          {experimental && <span className="experimental-badge">🧪 Experimental</span>}
        </div>
        <div className="header-actions">
          <button
            onClick={() => setAiAssistant(!aiAssistant)}
            className={`ai-assistant-toggle ${aiAssistant ? 'active' : ''}`}
            title="Toggle AI Assistant"
          >
            🤖
          </button>
          <button onClick={onClose} className="close-button">×</button>
        </div>
      </div>

      <div className="ndv-tabs">
        <button
          className={selectedTab === 'parameters' ? 'active' : ''}
          onClick={() => setSelectedTab('parameters')}
        >
          Parameters
        </button>
        <button
          className={selectedTab === 'credentials' ? 'active' : ''}
          onClick={() => setSelectedTab('credentials')}
        >
          Credentials
        </button>
        <button
          className={selectedTab === 'connections' ? 'active' : ''}
          onClick={() => setSelectedTab('connections')}
        >
          Connections
        </button>
        <button
          className={selectedTab === 'execution' ? 'active' : ''}
          onClick={() => setSelectedTab('execution')}
        >
          Execution
        </button>
      </div>

      <div className="ndv-content">
        {selectedTab === 'parameters' && (
          <div className="parameters-tab">
            <div className="parameters-header">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search parameters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="visibility-controls">
                <label>
                  <input
                    type="checkbox"
                    checked={showAdvanced}
                    onChange={(e) => setShowAdvanced(e.target.checked)}
                  />
                  Advanced
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={showExperimental}
                    onChange={(e) => setShowExperimental(e.target.checked)}
                  />
                  Experimental
                </label>
              </div>
            </div>
            
            <div className="parameters-form">
              {filteredParameterGroups.map(group => (
                <div key={group.name} className="parameter-group">
                  <div
                    className="group-header"
                    onClick={() => toggleGroupCollapse(group.name)}
                  >
                    <span className="group-name">{group.label}</span>
                    <span className="collapse-icon">
                      {collapsedGroups.has(group.name) ? '▶' : '▼'}
                    </span>
                  </div>
                  {!collapsedGroups.has(group.name) && (
                    <div className="group-content">
                      {group.parameters.map(renderParameterField)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="validation-summary">
              {Object.keys(validationErrors).length > 0 && (
                <div className="validation-errors">
                  <h4>Validation Errors:</h4>
                  {Object.entries(validationErrors).map(([field, error]) => (
                    <div key={field} className="validation-error">
                      {field}: {error}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === 'credentials' && (
          <div className="credentials-tab">
            <div className="credentials-form">
              {nodeType?.credentials?.map(renderCredentialField)}
            </div>
          </div>
        )}

        {selectedTab === 'connections' && (
          <div className="connections-tab">
            <div className="input-connections">
              <h4>Input Connections</h4>
              {nodeType?.inputConnections?.map(renderConnectionPoint)}
            </div>
            <div className="output-connections">
              <h4>Output Connections</h4>
              {nodeType?.outputConnections?.map(renderConnectionPoint)}
            </div>
          </div>
        )}

        {selectedTab === 'execution' && (
          <div className="execution-tab">
            <div className="execution-controls">
              <button
                onClick={handleExecute}
                disabled={isExecuting || readOnly}
                className="execute-button"
              >
                {isExecuting ? 'Executing...' : 'Execute Node'}
              </button>
              <button
                onClick={handleStop}
                disabled={!isExecuting || readOnly}
                className="stop-button"
              >
                Stop Execution
              </button>
              <button
                onClick={handleDebug}
                disabled={readOnly}
                className="debug-button"
              >
                Debug Node
              </button>
            </div>
            {executionData && (
              <div className="execution-data">
                <h4>Execution Data</h4>
                <pre>{JSON.stringify(executionData, null, 2)}</pre>
              </div>
            )}
            {aiAssistant && (
              <div className="ai-insights">
                <h4>AI Insights</h4>
                <div className="ai-suggestions">
                  {/* AI suggestions would be rendered here */}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="ndv-footer">
        <div className="node-status">
          <span className={`status-indicator ${canvasStore.nodeStatus[currentNode.id] || 'idle'}`}>
            {canvasStore.nodeStatus[currentNode.id] || 'idle'}
          </span>
        </div>
        <div className="node-actions">
          {!readOnly && (
            <>
              <button onClick={() => validateAllParameters()}>Validate</button>
              <button onClick={() => canvasOperations.duplicateNode(currentNode.id)}>Duplicate</button>
              {aiAssistant && (
                <button onClick={() => {
                  // Trigger AI optimization
                  agentRequestStore.createRequest({
                    workflowId: workflowStore.current?.id || '',
                    nodeId: currentNode.id,
                    nodeName: currentNode.name,
                    type: 'optimization',
                    prompt: `Optimize the configuration of node "${currentNode.name}" for better performance and reliability.`,
                  });
                }}>
                  AI Optimize
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}