
import { useCallback, useMemo, useRef } from 'react';
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
  const { pan, isPanning, handleMouseDown, handleMouseMove, handleMouseUp } = useCanvasPan();

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
    // Só limpa a seleção se o clique foi diretamente no canvas (não em componentes ou conexões)
    if (e.target === e.currentTarget) {
      selectionHooks.clearSelection();
    }
  }, [selectionHooks]);

  return {
    // Zoom
    zoom,
    handleWheel,
    handleZoomIn,
    handleZoomOut,
    
    // Pan
    pan,
    isPanning,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleCanvasMouseDown,
    
    // Selection
    ...selectionHooks,
    
    // Drag & Drop
    ...dragDropHooks
  };
};
