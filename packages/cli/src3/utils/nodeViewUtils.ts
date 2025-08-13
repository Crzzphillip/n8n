import type { XYPosition } from '../stores/workflows';

// Canvas constants
export const GRID_SIZE = 16;
export const DEFAULT_NODE_SIZE: [number, number] = [GRID_SIZE * 6, GRID_SIZE * 6];
export const CONFIGURATION_NODE_SIZE: [number, number] = [GRID_SIZE * 5, GRID_SIZE * 5];
export const CONFIGURABLE_NODE_SIZE: [number, number] = [GRID_SIZE * 16, GRID_SIZE * 6];
export const DEFAULT_START_POSITION_X = GRID_SIZE * 11;
export const DEFAULT_START_POSITION_Y = GRID_SIZE * 15;
export const HEADER_HEIGHT = 65;
export const PUSH_NODES_OFFSET = DEFAULT_NODE_SIZE[0] * 2 + GRID_SIZE;

// Viewport boundaries type
export type ViewportBoundaries = {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
};

export const DEFAULT_VIEWPORT_BOUNDARIES: ViewportBoundaries = {
  xMin: -Infinity,
  yMin: -Infinity,
  xMax: Infinity,
  yMax: Infinity,
};

// The top-center of the configuration node is not a multiple of GRID_SIZE,
// therefore we need to offset non-main inputs to align with the nodes top-center
export const CONFIGURATION_NODE_OFFSET = (CONFIGURATION_NODE_SIZE[0] / 2) % GRID_SIZE;

/**
 * Utility functions for returning nodes found at the edges of a group
 */
export const getLeftmostTopNode = <T extends { position: XYPosition }>(nodes: T[]): T => {
  return nodes.reduce((leftmostTop, node) => {
    if (node.position[0] > leftmostTop.position[0] || node.position[1] > leftmostTop.position[1]) {
      return leftmostTop;
    }
    return node;
  }, nodes[0]);
};

export const getLeftMostNode = <T extends { position: XYPosition }>(nodes: T[]): T => {
  return nodes.reduce((leftmost, node) => {
    if (node.position[0] < leftmost.position[0]) {
      return node;
    }
    return leftmost;
  }, nodes[0]);
};

export const getTopMostNode = <T extends { position: XYPosition }>(nodes: T[]): T => {
  return nodes.reduce((topmost, node) => {
    if (node.position[1] < topmost.position[1]) {
      return node;
    }
    return topmost;
  }, nodes[0]);
};

export const getRightMostNode = <T extends { position: XYPosition }>(nodes: T[]): T => {
  return nodes.reduce((rightmost, node) => {
    if (node.position[0] > rightmost.position[0]) {
      return node;
    }
    return rightmost;
  }, nodes[0]);
};

export const getBottomMostNode = <T extends { position: XYPosition }>(nodes: T[]): T => {
  return nodes.reduce((bottommost, node) => {
    if (node.position[1] > bottommost.position[1]) {
      return node;
    }
    return bottommost;
  }, nodes[0]);
};

/**
 * Get the bounds of nodes
 */
export const getBounds = (nodes: { position: XYPosition }[]): ViewportBoundaries => {
  if (nodes.length === 0) {
    return DEFAULT_VIEWPORT_BOUNDARIES;
  }

  const leftmost = getLeftMostNode(nodes);
  const rightmost = getRightMostNode(nodes);
  const topmost = getTopMostNode(nodes);
  const bottommost = getBottomMostNode(nodes);

  return {
    xMin: leftmost.position[0],
    yMin: topmost.position[1],
    xMax: rightmost.position[0] + DEFAULT_NODE_SIZE[0],
    yMax: bottommost.position[1] + DEFAULT_NODE_SIZE[1],
  };
};

/**
 * Get bounds from viewport transform and dimensions
 */
export const getBoundsFromViewport = (
  viewport: { x: number; y: number; zoom: number },
  dimensions: { width: number; height: number }
): ViewportBoundaries => {
  const { x, y, zoom } = viewport;
  const { width, height } = dimensions;

  return {
    xMin: -x / zoom,
    yMin: -y / zoom,
    xMax: (-x + width) / zoom,
    yMax: (-y + height) / zoom,
  };
};

/**
 * Get the current NodeView tab based on the route
 */
export const getNodeViewTab = (searchParams: URLSearchParams): string | null => {
  const tab = searchParams.get('tab');
  return tab || 'workflow';
};

/**
 * Get nodes with normalized positions
 */
export const getNodesWithNormalizedPosition = <T extends { position: XYPosition }>(
  nodes: T[]
): T[] => {
  return nodes.map((node) => ({
    ...node,
    position: [
      Math.round(node.position[0] / GRID_SIZE) * GRID_SIZE,
      Math.round(node.position[1] / GRID_SIZE) * GRID_SIZE,
    ] as XYPosition,
  }));
};

/**
 * Get new node position
 */
export const getNewNodePosition = (
  existingNodes: { position: XYPosition }[],
  basePosition: XYPosition = [DEFAULT_START_POSITION_X, DEFAULT_START_POSITION_Y],
  options: {
    offset?: number;
    gridSnap?: boolean;
  } = {}
): XYPosition => {
  const { offset = PUSH_NODES_OFFSET, gridSnap = true } = options;

  if (existingNodes.length === 0) {
    return gridSnap
      ? [
          Math.round(basePosition[0] / GRID_SIZE) * GRID_SIZE,
          Math.round(basePosition[1] / GRID_SIZE) * GRID_SIZE,
        ]
      : basePosition;
  }

  // Find the rightmost node
  const rightmost = getRightMostNode(existingNodes);
  const newX = rightmost.position[0] + offset;
  const newY = rightmost.position[1];

  return gridSnap
    ? [
        Math.round(newX / GRID_SIZE) * GRID_SIZE,
        Math.round(newY / GRID_SIZE) * GRID_SIZE,
      ]
    : [newX, newY];
};

/**
 * Calculate node size based on content
 */
export const calculateNodeSize = (
  nodeType: string,
  parameters: Record<string, any> = {}
): [number, number] => {
  // Default size
  let width = DEFAULT_NODE_SIZE[0];
  let height = DEFAULT_NODE_SIZE[1];

  // Adjust based on node type
  if (nodeType.includes('configuration')) {
    width = CONFIGURATION_NODE_SIZE[0];
    height = CONFIGURATION_NODE_SIZE[1];
  } else if (nodeType.includes('configurable')) {
    width = CONFIGURABLE_NODE_SIZE[0];
    height = CONFIGURABLE_NODE_SIZE[1];
  }

  // Adjust based on parameters
  if (parameters.resource && parameters.operation) {
    // Resource nodes might need more space
    width = Math.max(width, GRID_SIZE * 8);
  }

  return [width, height];
};

/**
 * Get mouse position relative to canvas
 */
export const getMousePosition = (
  event: MouseEvent,
  canvasElement: HTMLElement
): XYPosition => {
  const rect = canvasElement.getBoundingClientRect();
  return [
    event.clientX - rect.left,
    event.clientY - rect.top,
  ];
};

/**
 * Update viewport to contain all nodes
 */
export const updateViewportToContainNodes = (
  nodes: { position: XYPosition }[],
  viewport: { x: number; y: number; zoom: number },
  dimensions: { width: number; height: number }
): { x: number; y: number; zoom: number } => {
  if (nodes.length === 0) {
    return viewport;
  }

  const bounds = getBounds(nodes);
  const padding = 50;

  // Calculate required zoom to fit all nodes
  const requiredWidth = bounds.xMax - bounds.xMin + padding * 2;
  const requiredHeight = bounds.yMax - bounds.yMin + padding * 2;
  
  const zoomX = dimensions.width / requiredWidth;
  const zoomY = dimensions.height / requiredHeight;
  const newZoom = Math.min(zoomX, zoomY, 1); // Don't zoom in more than 1x

  // Calculate new viewport position
  const centerX = (bounds.xMin + bounds.xMax) / 2;
  const centerY = (bounds.yMin + bounds.yMax) / 2;
  
  const newX = dimensions.width / 2 - centerX * newZoom;
  const newY = dimensions.height / 2 - centerY * newZoom;

  return {
    x: newX,
    y: newY,
    zoom: newZoom,
  };
};

/**
 * Get mid canvas position
 */
export const getMidCanvasPosition = (
  canvasElement: HTMLElement
): XYPosition => {
  const rect = canvasElement.getBoundingClientRect();
  return [
    rect.width / 2,
    rect.height / 2,
  ];
};

/**
 * Snap position to grid
 */
export const snapToGrid = (position: XYPosition): XYPosition => {
  return [
    Math.round(position[0] / GRID_SIZE) * GRID_SIZE,
    Math.round(position[1] / GRID_SIZE) * GRID_SIZE,
  ];
};

/**
 * Check if position is within bounds
 */
export const isPositionWithinBounds = (
  position: XYPosition,
  bounds: ViewportBoundaries
): boolean => {
  return (
    position[0] >= bounds.xMin &&
    position[0] <= bounds.xMax &&
    position[1] >= bounds.yMin &&
    position[1] <= bounds.yMax
  );
};

/**
 * Get distance between two positions
 */
export const getDistance = (pos1: XYPosition, pos2: XYPosition): number => {
  const dx = pos2[0] - pos1[0];
  const dy = pos2[1] - pos1[1];
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Get nodes within radius of a position
 */
export const getNodesWithinRadius = <T extends { position: XYPosition }>(
  nodes: T[],
  center: XYPosition,
  radius: number
): T[] => {
  return nodes.filter((node) => getDistance(node.position, center) <= radius);
};

/**
 * Get nodes in rectangle
 */
export const getNodesInRectangle = <T extends { position: XYPosition }>(
  nodes: T[],
  rect: { x: number; y: number; width: number; height: number }
): T[] => {
  return nodes.filter((node) => {
    const [x, y] = node.position;
    return (
      x >= rect.x &&
      x <= rect.x + rect.width &&
      y >= rect.y &&
      y <= rect.y + rect.height
    );
  });
};