
export interface CanvasPosition {
  x: number;
  y: number;
}

export interface CanvasTransform {
  pan: CanvasPosition;
  zoom: number;
}

export interface DragState {
  isDragging: boolean;
  dragOffset: CanvasPosition;
}

export interface ConnectionState {
  connectingFrom: string | null;
  selectedComponent: string | null;
}

export interface CanvasInteractionHandlers {
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onWheel: (e: React.WheelEvent) => void;
}

export interface ComponentDragHandlers {
  onDrag: (id: string, position: CanvasPosition) => void;
  onSelect: () => void;
}
