// Canvas management hooks
export { useCanvasHandlers } from './useCanvasHandlers';
export { useConnectionManager } from './useConnectionManager';
export { useNodeManager } from './useNodeManager';
export { useCanvasState } from './useCanvasState';

// Existing canvas hooks
export { useCanvasDragDrop } from './useCanvasDragDrop';
export { useCanvasSelection } from './useCanvasSelection';
export { useComponentDrag } from './useComponentDrag';
export { useCanvasPan } from './useCanvasPan';
export { useCanvasZoom } from './useCanvasZoom';
export { 
  useCanvas, 
  useCanvasState as useCanvasContextState, 
  useCanvasActions, 
  useCanvasInteractions 
} from './useCanvasContext'; 