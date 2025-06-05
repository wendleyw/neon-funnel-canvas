import { FunnelComponent } from '../types/funnel';

export interface ConnectionPoint {
  x: number;
  y: number;
  side: 'top' | 'right' | 'bottom' | 'left';
}

export interface ComponentDimensions {
  width: number;
  height: number;
}

// Default component size (based on the new improved design)
export const DEFAULT_COMPONENT_SIZE: ComponentDimensions = {
  width: 288, // Width based on w-72 = 18rem = 288px
  height: 200 // Height of the new improved card
};

// Base dimensions for different component types
const COMPONENT_DIMENSIONS = {
  // Marketing components (default)
  default: { width: 288, height: 200 },
  
  // Specialized components
  funnel: { width: 280, height: 190 },
  journey: { width: 290, height: 210 },
  process: { width: 270, height: 180 },
  
  // Social Media components with appropriate aspect ratios
  'social-media': { width: 288, height: 220 }, // Generic
  'instagram-post': { width: 250, height: 250 }, // 1:1 - Square
  'instagram-story': { width: 180, height: 320 }, // 9:16 - Vertical
  'instagram-reels': { width: 180, height: 320 }, // 9:16 - Vertical (like Stories)
  'instagram-carousel': { width: 250, height: 250 }, // 1:1 - Square
  'tiktok-video': { width: 180, height: 320 }, // 9:16 - Vertical
  'youtube-short': { width: 180, height: 320 }, // 9:16 - Vertical
  'youtube-video': { width: 320, height: 180 }, // 16:9 - Horizontal
  'youtube-thumbnail': { width: 280, height: 158 }, // 16:9 - Horizontal (smaller)
  'facebook-post': { width: 310, height: 162 }, // 1.91:1 - Horizontal
  'facebook-ad': { width: 310, height: 162 }, // 1.91:1 - Horizontal
  'linkedin-post': { width: 310, height: 162 }, // 1.91:1 - Horizontal
  'twitter-post': { width: 300, height: 169 } // 16:9 - Horizontal
};

// Determine component category in a simplified way
function getComponentCategory(type: string): 'funnel' | 'journey' | 'process' | 'social-media' | 'instagram-post' | 'instagram-story' | 'instagram-reels' | 'instagram-carousel' | 'tiktok-video' | 'youtube-short' | 'youtube-video' | 'youtube-thumbnail' | 'facebook-post' | 'facebook-ad' | 'linkedin-post' | 'twitter-post' | 'default' {
  // Check specific social media types first
  if (type === 'instagram-post') return 'instagram-post';
  if (type === 'instagram-story') return 'instagram-story';
  if (type === 'instagram-reels') return 'instagram-reels';
  if (type === 'instagram-carousel') return 'instagram-carousel';
  if (type === 'tiktok-video') return 'tiktok-video';
  if (type === 'youtube-short') return 'youtube-short';
  if (type === 'youtube-video') return 'youtube-video';
  if (type === 'youtube-thumbnail') return 'youtube-thumbnail';
  if (type === 'facebook-post') return 'facebook-post';
  if (type === 'facebook-ad') return 'facebook-ad';
  if (type === 'linkedin-post') return 'linkedin-post';
  if (type === 'twitter-post') return 'twitter-post';
  
  // General categories
  if (type.startsWith('funnel-') || type.includes('metric')) return 'funnel';
  if (type.startsWith('journey-') || type.includes('emotion') || type.includes('touchpoint')) return 'journey';
  if (type.startsWith('flow-') || type.includes('process')) return 'process';
  if (type === 'instagram-grid' || type.includes('social-media')) return 'social-media';
  return 'default';
}

// Get component dimensions
export function getComponentDimensions(type: string): { width: number; height: number } {
  const category = getComponentCategory(type);
  return COMPONENT_DIMENSIONS[category];
}

// Function to get component dimensions based on type
export const getComponentDimensionsForComponent = (component: FunnelComponent): ComponentDimensions => {
  // If it's a visual component with custom dimensions
  if (component.data.properties?.width && component.data.properties?.height) {
    return {
      width: component.data.properties.width as number,
      height: component.data.properties.height as number
    };
  }

  // Return dimensions based on type using the new function
  return getComponentDimensions(component.type);
};

// Function to calculate the best connection between two components
export function calculateBestConnectionPoints(
  fromComponent: FunnelComponent,
  toComponent: FunnelComponent
): { from: ConnectionPoint; to: ConnectionPoint } {
  const fromPos = fromComponent.position;
  const toPos = toComponent.position;
  const fromDims = getComponentDimensionsForComponent(fromComponent);
  const toDims = getComponentDimensionsForComponent(toComponent);

  // Calculate component centers
  const fromCenter = {
    x: fromPos.x + fromDims.width / 2,
    y: fromPos.y + fromDims.height / 2
  };

  const toCenter = {
    x: toPos.x + toDims.width / 2,
    y: toPos.y + toDims.height / 2
  };

  // Calculate differences
  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;

  // Determine the best side for connection based on direction
  let fromSide: 'top' | 'right' | 'bottom' | 'left';
  let toSide: 'top' | 'right' | 'bottom' | 'left';

  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal connection is better
    if (dx > 0) {
      fromSide = 'right';
      toSide = 'left';
    } else {
      fromSide = 'left';
      toSide = 'right';
    }
  } else {
    // Vertical connection is better
    if (dy > 0) {
      fromSide = 'bottom';
      toSide = 'top';
    } else {
      fromSide = 'top';
      toSide = 'bottom';
    }
  }

  const fromPoint = getConnectionPoint(fromComponent, fromSide);
  const toPoint = getConnectionPoint(toComponent, toSide);

  return {
    from: { ...fromPoint, side: fromSide },
    to: { ...toPoint, side: toSide }
  };
}

// Function to get the connection point on a specific side of the component
export const getConnectionPoint = (
  component: FunnelComponent,
  side: 'top' | 'right' | 'bottom' | 'left'
): { x: number; y: number } => {
  const dims = getComponentDimensionsForComponent(component);
  const pos = component.position;

  switch (side) {
    case 'top':
      return { x: pos.x + dims.width / 2, y: pos.y };
    case 'right':
      return { x: pos.x + dims.width, y: pos.y + dims.height / 2 };
    case 'bottom':
      return { x: pos.x + dims.width / 2, y: pos.y + dims.height };
    case 'left':
      return { x: pos.x, y: pos.y + dims.height / 2 };
  }
};

// Function to check if two components are aligned
export const areComponentsAligned = (
  comp1: FunnelComponent,
  comp2: FunnelComponent,
  threshold: number = 50
): { horizontal: boolean; vertical: boolean } => {
  const dims1 = getComponentDimensionsForComponent(comp1);
  const dims2 = getComponentDimensionsForComponent(comp2);

  const center1 = {
    x: comp1.position.x + dims1.width / 2,
    y: comp1.position.y + dims1.height / 2
  };

  const center2 = {
    x: comp2.position.x + dims2.width / 2,
    y: comp2.position.y + dims2.height / 2
  };

  return {
    horizontal: Math.abs(center1.y - center2.y) <= threshold,
    vertical: Math.abs(center1.x - center2.x) <= threshold
  };
};

// Calculate connection points for component instances
export function getConnectionPoints(component: FunnelComponent): {
  top: { x: number; y: number };
  right: { x: number; y: number };
  bottom: { x: number; y: number };
  left: { x: number; y: number };
} {
  const { width, height } = getComponentDimensions(component.type);
  const centerX = component.position.x + width / 2;
  const centerY = component.position.y + height / 2;

  return {
    top: { x: centerX, y: component.position.y },
    right: { x: component.position.x + width, y: centerY },
    bottom: { x: centerX, y: component.position.y + height },
    left: { x: component.position.x, y: centerY }
  };
}

// Find the best connection point
export function findBestConnectionPoint(
  from: FunnelComponent,
  to: FunnelComponent
): {
  start: { x: number; y: number };
  end: { x: number; y: number };
} {
  const fromPoints = getConnectionPoints(from);
  const toPoints = getConnectionPoints(to);

  // Calculate component centers
  const fromDims = getComponentDimensions(from.type);
  const toDims = getComponentDimensions(to.type);
  
  const fromCenter = {
    x: from.position.x + fromDims.width / 2,
    y: from.position.y + fromDims.height / 2
  };
  
  const toCenter = {
    x: to.position.x + toDims.width / 2,
    y: to.position.y + toDims.height / 2
  };

  // Determine the main direction
  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;

  // Choose points based on the main direction
  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal
    if (dx > 0) {
      return { start: fromPoints.right, end: toPoints.left };
    } else {
      return { start: fromPoints.left, end: toPoints.right };
    }
  } else {
    // Vertical
    if (dy > 0) {
      return { start: fromPoints.bottom, end: toPoints.top };
    } else {
      return { start: fromPoints.top, end: toPoints.bottom };
    }
  }
}

// Function to create an optimized connection path SVG based on connection points
export const createOptimizedConnectionPath = (
  fromPoint: ConnectionPoint,
  toPoint: ConnectionPoint,
  style: 'straight' | 'curved' | 'stepped' = 'curved'
): string => {
  const { x: x1, y: y1, side: fromSide } = fromPoint;
  const { x: x2, y: y2, side: toSide } = toPoint;

  if (style === 'straight') {
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }

  if (style === 'stepped') {
    // Connection in steps (cleaner for organized layouts)
    if (fromSide === 'right' && toSide === 'left') {
      const midX = x1 + (x2 - x1) / 2;
      return `M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`;
    }
    if (fromSide === 'bottom' && toSide === 'top') {
      const midY = y1 + (y2 - y1) / 2;
      return `M ${x1} ${y1} V ${midY} H ${x2} V ${y2}`;
    }
  }

  // Curved connection (default)
  const dx = x2 - x1;
  const dy = y2 - y1;

  // Calculate control points based on directions
  let cp1x, cp1y, cp2x, cp2y;

  if (fromSide === 'right' && toSide === 'left') {
    const offset = Math.abs(dx) * 0.5;
    cp1x = x1 + offset;
    cp1y = y1;
    cp2x = x2 - offset;
    cp2y = y2;
  } else if (fromSide === 'bottom' && toSide === 'top') {
    const offset = Math.abs(dy) * 0.5;
    cp1x = x1;
    cp1y = y1 + offset;
    cp2x = x2;
    cp2y = y2 - offset;
  } else if (fromSide === 'left' && toSide === 'right') {
    const offset = Math.abs(dx) * 0.5;
    cp1x = x1 - offset;
    cp1y = y1;
    cp2x = x2 + offset;
    cp2y = y2;
  } else if (fromSide === 'top' && toSide === 'bottom') {
    const offset = Math.abs(dy) * 0.5;
    cp1x = x1;
    cp1y = y1 - offset;
    cp2x = x2;
    cp2y = y2 + offset;
  } else {
    // Fallback for diagonal connections
    cp1x = x1 + dx * 0.5;
    cp1y = y1;
    cp2x = x1 + dx * 0.5;
    cp2y = y2;
  }

  return `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
}; 