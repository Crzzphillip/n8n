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
import { 
  getNodeViewTab,
  type ViewportBoundaries 
} from '../../utils/nodeViewUtils';
import { canvasEventBus } from '../../utils/eventBus';

export type NodeDetailsViewProps = {
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
};

export type ParameterField = {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect' | 'json' | 'expression' | 'credential' | 'file';
  label: string;
  description?: string;
  required?: boolean;
  default?: any;
  options?: Array<{ value: string; label: string }>;
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
};

export type ConnectionPoint = {
  id: string;
  name: string;
  type: 'input' | 'output';
  dataType?: string;
  required?: boolean;
  multiple?: boolean;
  description?: string;
};

export type CredentialField = {
  name: string;
  type: string;
  label: string;
  description?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
};

export default function NodeDetailsView(props: NodeDetailsViewProps) {
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

  // Get current node data
  const currentNode = useMemo(() => {
    if (!nodeId) return null;
    return workflowStore.current?.nodes.find(n => n.id === nodeId);
  }, [nodeId, workflowStore.current]);

  const nodeType = useMemo(() => {
    if (!currentNode?.type) return null;
    return nodeTypesStore.getNodeType(currentNode.type);
  }, [currentNode?.type, nodeTypesStore]);

  // Initialize data when node changes
  useEffect(() => {
    if (currentNode) {
      setNewNodeName(currentNode.name);
      setParameters(currentNode.parameters || {});
      setCredentials(currentNode.credentials || {});
      setConnections(currentNode.connections || { inputs: {}, outputs: {} });
      setValidationErrors({});
      setIsRenaming(false);
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

  // Handle parameter changes
  const handleParameterChange = useCallback((key: string, value: any) => {
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

    // Update workflow
    if (currentNode && onParameterChange) {
      onParameterChange(currentNode.id, newParameters);
    }

    // Track in PostHog
    postHogStore.track('node_parameter_changed', {
      nodeType: currentNode?.type,
      parameterName: key,
      parameterType: field?.type,
    });
  }, [parameters, nodeType, currentNode, onParameterChange, postHogStore]);

  // Handle credential changes
  const handleCredentialChange = useCallback((key: string, value: any) => {
    const newCredentials = { ...credentials, [key]: value };
    setCredentials(newCredentials);

    if (currentNode && onCredentialChange) {
      onCredentialChange(currentNode.id, newCredentials);
    }

    // Track in PostHog
    postHogStore.track('node_credential_changed', {
      nodeType: currentNode?.type,
      credentialName: key,
    });
  }, [credentials, currentNode, onCredentialChange, postHogStore]);

  // Handle connection changes
  const handleConnectionChange = useCallback((connectionType: 'input' | 'output', connectionId: string, connections: any[]) => {
    const newConnections = {
      ...connections,
      [connectionType === 'input' ? 'inputs' : 'outputs']: {
        ...connections[connectionType === 'input' ? 'inputs' : 'outputs'],
        [connectionId]: connections,
      },
    };
    setConnections(newConnections);

    if (currentNode && onConnectionChange) {
      onConnectionChange(currentNode.id, newConnections);
    }
  }, [connections, currentNode, onConnectionChange]);

  // Handle node rename
  const handleNodeRename = useCallback((newName: string) => {
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

    // Track in PostHog
    postHogStore.track('node_renamed', {
      nodeType: currentNode.type,
      oldName: currentNode.name,
      newName,
    });
  }, [currentNode, onNodeRename, workflowStore, postHogStore]);

  // Handle execution
  const handleExecute = useCallback(async () => {
    if (!currentNode || isExecuting) return;

    setIsExecuting(true);
    try {
      if (onExecute) {
        await onExecute(currentNode.id);
      } else {
        await canvasOperations.runWorkflow('ndv');
      }

      // Track in PostHog
      postHogStore.track('node_executed', {
        nodeType: currentNode.type,
        nodeName: currentNode.name,
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
  }, [currentNode, isExecuting, onExecute, canvasOperations, postHogStore, logsStore]);

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
      postHogStore.track('node_execution_stopped', {
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

  // Handle debug
  const handleDebug = useCallback(async () => {
    if (!currentNode) return;

    try {
      if (onDebug) {
        await onDebug(currentNode.id);
      }

      // Track in PostHog
      postHogStore.track('node_debugged', {
        nodeType: currentNode.type,
        nodeName: currentNode.name,
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
  }, [currentNode, onDebug, postHogStore, logsStore]);

  // Parameter validation
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

  // Render parameter field
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
        }

        handleParameterChange(field.name, newValue);
      },
      disabled: readOnly,
      required: field.required,
      placeholder: field.description,
    };

    switch (field.type) {
      case 'string':
      case 'expression':
        return (
          <div key={field.name} className="parameter-field">
            <label htmlFor={field.name}>{field.label}</label>
            <input
              type="text"
              {...commonProps}
              className={error ? 'error' : ''}
            />
            {error && <div className="error-message">{error}</div>}
            {field.description && <div className="field-description">{field.description}</div>}
          </div>
        );

      case 'number':
        return (
          <div key={field.name} className="parameter-field">
            <label htmlFor={field.name}>{field.label}</label>
            <input
              type="number"
              {...commonProps}
              min={field.validation?.min}
              max={field.validation?.max}
              className={error ? 'error' : ''}
            />
            {error && <div className="error-message">{error}</div>}
            {field.description && <div className="field-description">{field.description}</div>}
          </div>
        );

      case 'boolean':
        return (
          <div key={field.name} className="parameter-field checkbox">
            <label>
              <input
                type="checkbox"
                checked={value || false}
                onChange={(e) => handleParameterChange(field.name, e.target.checked)}
                disabled={readOnly}
              />
              {field.label}
            </label>
            {field.description && <div className="field-description">{field.description}</div>}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="parameter-field">
            <label htmlFor={field.name}>{field.label}</label>
            <select {...commonProps} className={error ? 'error' : ''}>
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
          <div key={field.name} className="parameter-field">
            <label htmlFor={field.name}>{field.label}</label>
            <select
              {...commonProps}
              multiple
              value={Array.isArray(value) ? value : []}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                handleParameterChange(field.name, selectedOptions);
              }}
              className={error ? 'error' : ''}
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
        return (
          <div key={field.name} className="parameter-field">
            <label htmlFor={field.name}>{field.label}</label>
            <textarea
              {...commonProps}
              value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value || ''}
              rows={5}
              className={error ? 'error' : ''}
            />
            {error && <div className="error-message">{error}</div>}
            {field.description && <div className="field-description">{field.description}</div>}
          </div>
        );

      case 'credential':
        return (
          <div key={field.name} className="parameter-field">
            <label htmlFor={field.name}>{field.label}</label>
            <select
              {...commonProps}
              className={error ? 'error' : ''}
            >
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
          <div key={field.name} className="parameter-field">
            <label htmlFor={field.name}>{field.label}</label>
            <input
              type="file"
              {...commonProps}
              onChange={(e) => {
                const file = e.target.files?.[0];
                handleParameterChange(field.name, file);
              }}
              className={error ? 'error' : ''}
            />
            {error && <div className="error-message">{error}</div>}
            {field.description && <div className="field-description">{field.description}</div>}
          </div>
        );

      default:
        return null;
    }
  }, [parameters, validationErrors, readOnly, handleParameterChange]);

  // Render credential field
  const renderCredentialField = useCallback((field: CredentialField) => {
    const value = credentials[field.name];

    return (
      <div key={field.name} className="credential-field">
        <label htmlFor={field.name}>{field.label}</label>
        <select
          id={field.name}
          value={value || ''}
          onChange={(e) => handleCredentialChange(field.name, e.target.value)}
          disabled={readOnly}
          required={field.required}
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

  // Render connection point
  const renderConnectionPoint = useCallback((point: ConnectionPoint) => {
    const pointConnections = connections[point.type === 'input' ? 'inputs' : 'outputs'][point.id] || [];

    return (
      <div key={point.id} className="connection-point">
        <div className="connection-header">
          <span className="connection-name">{point.name}</span>
          <span className="connection-type">{point.type}</span>
          {point.required && <span className="required">*</span>}
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
    <div className="node-details-view">
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
            />
          ) : (
            <h3 onClick={() => !readOnly && setIsRenaming(true)}>
              {currentNode.name}
              {!readOnly && <span className="edit-icon">✏️</span>}
            </h3>
          )}
          <span className="node-type">{currentNode.type}</span>
        </div>
        <button onClick={onClose} className="close-button">×</button>
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
            <div className="parameters-form">
              {nodeType?.parameters?.map(renderParameterField)}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}