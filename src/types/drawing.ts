
export type DrawingTool =
  | 'select'
  | 'rectangle'
  | 'circle'
  | 'diamond'
  | 'hexagon'
  | 'star'
  | 'line'
  | 'arrow'
  | 'connector'
  | 'funnel'
  | 'text';

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface DrawingShape {
  id?: string;
  type: string;
  position: Point;
  size: Size;
  style?: any;
  text?: string;
  textStyle?: any;
  color?: string;
  funnelStage?: string;
  conversionRate?: number;
  metrics?: any;
  rotation?: number;
}

interface ConnectionEndpoint {
    shapeId: string;
    point: Point;
    side: string;
}

export interface DrawingConnection {
  id?: string;
  from: ConnectionEndpoint;
  to: ConnectionEndpoint;
  style?: any;
  label?: any;
  type?: 'success' | 'failure' | 'redirect';
}

export interface FunnelTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  metrics?: any;
  shapes: DrawingShape[];
  connections: DrawingConnection[];
}
