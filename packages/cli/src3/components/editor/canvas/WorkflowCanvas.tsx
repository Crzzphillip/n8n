import React, { useMemo } from 'react';
import Canvas from './Canvas';
import type { Edge, Node, FitViewOptions } from 'reactflow';

export type WorkflowCanvasProps = {
	className?: string;
	style?: React.CSSProperties;
	readOnly?: boolean;
	nodes: Node[];
	edges: Edge[];
	fitViewOptions?: FitViewOptions;
	onChange: (nodes: Node[], edges: Edge[]) => void;
	onSelectNode?: (nodeId?: string) => void;
	onSelectEdge?: (edge?: { source: string; target: string }) => void;
	onViewportChange?: (viewport: { x: number; y: number; zoom: number }, dimensions: { width: number; height: number }) => void;
	onPaneClick?: (position: { x: number; y: number }) => void;
	onCreateConnection?: (connection: { source: string; target: string }) => void;
	onCreateConnectionCancelled?: (start: { nodeId: string; handleId: string }, position: { x: number; y: number }, event?: MouseEvent | TouchEvent) => void;
	onNodeDoubleClick?: (nodeId: string, event: MouseEvent) => void;
	onRangeSelectionChange?: (active: boolean) => void;
	children?: React.ReactNode;
};

export default function WorkflowCanvas(props: WorkflowCanvasProps) {
	const containerStyle = useMemo(() => ({
		position: 'relative' as const,
		width: '100%',
		height: '100%',
		...(props.style || {}),
	}), [props.style]);

	return (
		<div className={props.className} style={containerStyle}>
			<Canvas
				readOnly={props.readOnly}
				nodes={props.nodes}
				edges={props.edges}
				onChange={props.onChange}
				onSelectNode={props.onSelectNode}
				onSelectEdge={props.onSelectEdge}
				fitViewOptions={props.fitViewOptions}
				onViewportChange={props.onViewportChange}
				onPaneClick={props.onPaneClick}
				onCreateConnection={props.onCreateConnection}
				onCreateConnectionCancelled={props.onCreateConnectionCancelled}
				onNodeDoubleClick={props.onNodeDoubleClick}
				onRangeSelectionChange={props.onRangeSelectionChange}
			/>
			{/* Overlay slot (e.g., buttons, toolbars) */}
			{props.children}
		</div>
	);
}