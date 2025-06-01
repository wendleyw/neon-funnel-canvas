
import { useCallback, useMemo } from 'react';
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
  const dragDropProps = useMemo(() => ({ onComponentAdd, pan, zoom }), [onComponentAdd, pan, zoom]);
  const dragDropHooks = useCanvasDragDrop(dragDropProps);

  // Enhanced mouse down handler that combines pan and selection
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent, canvasRef: React.RefObject<HTMLDivElement>) => {
    // Só limpa a seleção se o clique foi diretamente no canvas (não em componentes ou conexões)
    if (e.target === e.currentTarget) {
      selectionHooks.clearSelection();
    }
    handleMouseDown(e, canvasRef);
  }, [handleMouseDown, selectionHooks]);

  return {
    // Zoom
    zoom,
    handleWheel,
    handleZoomIn,
    handleZoomOut,
    
    // Pan
    pan,
    isPanning,
    handleMouseMove,
    handleMouseUp,
    handleCanvasMouseDown,
    
    // Selection
    ...selectionHooks,
    
    // Drag & Drop
    ...dragDropHooks
  };
};
