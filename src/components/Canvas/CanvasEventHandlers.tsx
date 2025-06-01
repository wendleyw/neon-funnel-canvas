
import { useCallback, useMemo, useRef, useEffect } from 'react';
import { FunnelComponent } from '../../types/funnel';
import { useCanvasDragDrop } from '../../hooks/canvas/useCanvasDragDrop';
import { useCanvasZoom } from '../../hooks/canvas/useCanvasZoom';
import { useCanvasSelection } from '../../hooks/canvas/useCanvasSelection';
import { useCanvasPan } from '../../hooks/canvas/useCanvasPan';

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

  // Canvas zoom functionality
  const { zoom, handleWheel, handleZoomIn, handleZoomOut } = useCanvasZoom();

  // Canvas pan functionality
  const { 
    pan, 
    isPanning, 
    handleMouseDown: panMouseDown, 
    handleMouseMove: panMouseMove, 
    handleMouseUp: panMouseUp,
    handleMouseLeave: panMouseLeave
  } = useCanvasPan();

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

  // Add wheel event listener with passive: false to allow preventDefault
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Create a synthetic React wheel event
      const syntheticEvent = {
        deltaY: e.deltaY,
        preventDefault: () => e.preventDefault(),
        stopPropagation: () => e.stopPropagation()
      } as React.WheelEvent;
      
      handleWheel(syntheticEvent);
    };

    canvas.addEventListener('wheel', wheelHandler, { passive: false });
    
    return () => {
      canvas.removeEventListener('wheel', wheelHandler);
    };
  }, [handleWheel]);

  // Enhanced mouse down handler that combines pan and selection
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    // Primeiro tentar o pan
    panMouseDown(e);
    
    // Se não está fazendo pan e clique foi diretamente no canvas, limpar seleção
    if (!isPanning && e.target === e.currentTarget) {
      selectionHooks.clearSelection();
    }
  }, [panMouseDown, isPanning, selectionHooks]);

  // Mouse move handler que combina pan e outros comportamentos
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    panMouseMove(e);
  }, [panMouseMove]);

  // Mouse up handler
  const handleMouseUp = useCallback((e?: React.MouseEvent) => {
    panMouseUp(e);
  }, [panMouseUp]);

  // Context menu handler para prevenir menu padrão durante pan
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      e.preventDefault();
    }
  }, [isPanning]);

  // Wheel handler that doesn't use preventDefault in React event
  const handleWheelEvent = useCallback((e: React.WheelEvent) => {
    // Don't call preventDefault here since we handle it in the native event listener
  }, []);

  return {
    // Canvas ref
    canvasRef,
    
    // Zoom
    zoom,
    handleWheel: handleWheelEvent,
    handleZoomIn,
    handleZoomOut,
    
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
