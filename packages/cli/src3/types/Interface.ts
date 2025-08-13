import type { IConnection, INodeParameters } from 'n8n-workflow';
import type { Command, BulkCommand } from '../models/history';

export type XYPosition = [number, number];

export interface INodeUi {
	id: string;
	name: string;
	type: string;
	typeVersion: number;
	position: XYPosition;
	parameters: INodeParameters;
	disabled?: boolean;
	selected?: boolean;
}

export interface HistoryState {
	redoStack: (Command | BulkCommand)[];
	undoStack: (Command | BulkCommand)[];
	currentBulkAction: BulkCommand | null;
	bulkInProgress: boolean;
}

export interface CanvasNode {
	id: string;
	data: { label: string };
	position: { x: number; y: number };
	selected?: boolean;
}

export interface CanvasEdge {
	id: string;
	source: string;
	target: string;
}

export interface ViewportTransform {
	x: number;
	y: number;
	zoom: number;
}

export interface Dimensions {
	width: number;
	height: number;
}

export interface ViewportBoundaries {
	minX: number;
	maxX: number;
	minY: number;
	maxY: number;
}

export interface CanvasConnectionCreateData {
	source: string;
	sourceHandle: string;
	target: string;
	targetHandle: string;
	data?: {
		source: {
			index: number;
			type: string;
		};
		target: {
			index: number;
			type: string;
		};
	};
}

export interface AddedNodesAndConnections {
	nodes: Array<{
		type: string;
		position?: XYPosition;
		parameters?: Record<string, any>;
	}>;
	connections: Array<{
		from: {
			nodeIndex: number;
			outputIndex?: number;
			type?: string;
		};
		to: {
			nodeIndex: number;
			inputIndex?: number;
			type?: string;
		};
	}>;
}

export interface CanvasNodeMoveEvent {
	id: string;
	position: { x: number; y: number };
}

export interface ConnectStartEvent {
	nodeId: string;
	handleId: string;
}

export interface CanvasLayoutEvent {
	source: string;
	nodeIdsFilter?: string[];
}

export interface PinDataSource {
	source: string;
}

export interface NodeCreatorOpenSource {
	source: string;
}

export interface ToggleNodeCreatorOptions {
	createNodeActive: boolean;
	source?: string;
	hasAddedNodes?: boolean;
}

export interface NodeFilterType {
	type: string;
}

export interface IExecutionResponse {
	id: string;
	finished: boolean;
	data?: {
		resultData?: {
			error?: {
				message: string;
				stack?: string;
			};
			runData?: Record<string, any[]>;
		};
	};
}

export interface ExecutionSummary {
	waitTill?: boolean;
}

export interface IWorkflowDb {
	id: string;
	name: string;
	nodes: INodeUi[];
	connections: Record<string, IConnection[]>;
	settings?: Record<string, any>;
	meta?: {
		onboardingId?: string;
		templateId?: string;
	};
	homeProject?: string;
	parentFolder?: {
		id: string;
		name: string;
		parentFolder?: string;
	};
	isArchived?: boolean;
}

export interface WorkflowDataWithTemplateId {
	name: string;
	nodes: INodeUi[];
	connections: Record<string, IConnection[]>;
	meta: {
		templateId: string;
	};
}

export interface WorkflowDataUpdate {
	name?: string;
	nodes?: INodeUi[];
	connections?: Record<string, IConnection[]>;
	settings?: Record<string, any>;
}

export interface IDataObject {
	[key: string]: any;
}