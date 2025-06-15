
import { useCallback, useMemo, useRef } from 'react';
import { FunnelComponent } from '../../../types/funnel';
import { useCanvasDragDrop } from '../hooks/useCanvasDragDrop';
import { useCanvasZoom } from '../hooks/useCanvasZoom';
import { useCanvasSelection } from '../hooks/useCanvasSelection';
import { useCanvasPan } from '../hooks/useCanvasPan';

interface UseCanvasEventHandlersProps {
  onComponentAdd: (component: FunnelComponent) => void;
  onConnectionAdd: (connection: any) => void;
  onConnectionDelete: (connectionId: string) => void;
  onConnectionUpdate?: (connectionId: string, updates: any) => void;
}

export const useCanvasEventHandlers = ({
  onComponentAdd,
  onConnectionAdd,
  onConnectionDelete,
  onConnectionUpdate
}: UseCanvasEventHandlersProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Canvas pan functionality
  const { 
    pan, 
    isPanning, 
    handleMouseDown: panMouseDown, 
    handleMouseMove: panMouseMove, 
    handleMouseUp: panMouseUp,
    handleMouseLeave: panMouseLeave,
    resetPan,
    centerCanvas,
    setPan
  } = useCanvasPan();

  // Canvas zoom functionality with pan support
  const { zoom, handleWheel, handleZoomIn, handleZoomOut, resetZoom, fitToScreen } = useCanvasZoom({
    pan,
    setPan
  });

  // Canvas selection and connection functionality
  const selectionProps = useMemo(() => ({ 
    onConnectionAdd, 
    onConnectionDelete,
    onConnectionUpdate
  }), [onConnectionAdd, onConnectionDelete, onConnectionUpdate]);
  
  const selectionHooks = useCanvasSelection(selectionProps);

  // Canvas drag and drop functionality
  const dragDropProps = useMemo(() => ({ 
    onAddComponent: onComponentAdd, 
    canvasRef,
    scale: zoom,
    panOffset: pan
  }), [onComponentAdd, zoom, pan]);
  
  const dragDropHooks = useCanvasDragDrop(dragDropProps);

  // Enhanced mouse down handler that combines pan and selection
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    // First try pan
    panMouseDown(e);
    
    // If not panning and click was directly on canvas, clear selection
    if (!isPanning && e.target === e.currentTarget) {
      selectionHooks.clearSelection();
    }
  }, [panMouseDown, isPanning, selectionHooks]);

  // Mouse move handler that combines pan and other behaviors
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    panMouseMove(e);
  }, [panMouseMove]);

  // Mouse up handler
  const handleMouseUp = useCallback((e?: React.MouseEvent) => {
    panMouseUp(e);
  }, [panMouseUp]);

  // Context menu handler to prevent default menu during pan
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); // Always prevent context menu in canvas
  }, []);

  // Reset view handler
  const handleResetView = useCallback(() => {
    resetZoom();
    resetPan();
  }, [resetZoom, resetPan]);

  // Fit to screen handler
  const handleFitToScreen = useCallback(() => {
    fitToScreen();
    centerCanvas();
  }, [fitToScreen, centerCanvas]);

  return {
    // Canvas ref
    canvasRef,
    
    // Zoom
    zoom,
    handleWheel,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    handleFitToScreen,
    
    // Pan
    pan,
    isPanning,
    handleMouseDown: panMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave: panMouseLeave,
    handleCanvasMouseDown,
    handleContextMenu,
    
    // Selection
    ...selectionHooks,
    
    // Drag & Drop
    ...dragDropHooks
  };
};
