
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

export interface DrawingShape {
  id?: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style?: any;
  text?: string;
  textStyle?: any;
  color?: string;
  funnelStage?: string;
  conversionRate?: number;
  metrics?: any;
}

interface ConnectionEndpoint {
    shapeId: string;
    point: { x: number; y: number };
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
