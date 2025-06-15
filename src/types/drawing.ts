
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
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text?: string;
}

export interface DrawingConnection {
  id: string;
  from: string;
  to: string;
  type: 'success' | 'failure' | 'redirect';
}

export interface FunnelTemplate {
  id: string;
  name: string;
  description: string;
  shapes: DrawingShape[];
  connections: DrawingConnection[];
}
