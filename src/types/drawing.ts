export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface DrawingBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type DrawingTool = 
  | 'select'
  | 'rectangle'
  | 'circle'
  | 'arrow'
  | 'line'
  | 'text'
  | 'funnel'
  | 'diamond'
  | 'hexagon'
  | 'star'
  | 'connector';

export type FunnelStage = 
  | 'awareness'
  | 'interest'
  | 'consideration'
  | 'intent'
  | 'evaluation'
  | 'purchase'
  | 'retention'
  | 'advocacy';

export interface ShapeStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  borderRadius?: number;
  shadow?: boolean;
  gradient?: {
    type: 'linear' | 'radial';
    colors: string[];
    direction?: number;
  };
}

export interface TextStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  align?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
}

export interface DrawingShape {
  id: string;
  type: DrawingTool;
  position: Point;
  size: Size;
  style: ShapeStyle;
  textStyle?: TextStyle;
  text?: string;
  rotation?: number;
  locked?: boolean;
  visible?: boolean;
  data?: Record<string, any>;
  // For funnel-specific data
  funnelStage?: FunnelStage;
  conversionRate?: number;
  metrics?: {
    visitors?: number;
    conversions?: number;
    revenue?: number;
  };
}

export interface DrawingConnection {
  id: string;
  from: {
    shapeId: string;
    point: Point;
    side: 'top' | 'right' | 'bottom' | 'left';
  };
  to: {
    shapeId: string;
    point: Point;
    side: 'top' | 'right' | 'bottom' | 'left';
  };
  style: {
    stroke: string;
    strokeWidth: number;
    strokeDasharray?: string;
    animated?: boolean;
    arrowType?: 'none' | 'start' | 'end' | 'both';
  };
  label?: {
    text: string;
    position: Point;
    style: TextStyle;
  };
}

export interface FunnelTemplate {
  id: string;
  name: string;
  description: string;
  category: 'marketing' | 'sales' | 'customer-journey' | 'conversion';
  shapes: Omit<DrawingShape, 'id'>[];
  connections: Omit<DrawingConnection, 'id'>[];
  thumbnail: string;
  metrics?: {
    stages: number;
    expectedConversionRate: number;
  };
}

export interface DrawingLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  shapes: string[]; // shape IDs
}

export interface DrawingDocument {
  id: string;
  name: string;
  description?: string;
  canvas: {
    width: number;
    height: number;
    background: string;
    grid: {
      enabled: boolean;
      size: number;
      color: string;
      opacity: number;
    };
    snap: {
      enabled: boolean;
      threshold: number;
    };
  };
  shapes: DrawingShape[];
  connections: DrawingConnection[];
  layers: DrawingLayer[];
  activeLayer: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface DrawingState {
  document: DrawingDocument | null;
  activeTool: DrawingTool;
  selectedShapes: string[];
  selectedConnections: string[];
  clipboard: (DrawingShape | DrawingConnection)[];
  history: {
    past: DrawingDocument[];
    future: DrawingDocument[];
  };
  settings: {
    snapToGrid: boolean;
    showGrid: boolean;
    gridSize: number;
    autoSave: boolean;
    theme: 'light' | 'dark' | 'neon';
  };
} 