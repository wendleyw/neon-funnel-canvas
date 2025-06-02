
import { useCanvas } from '../../contexts/CanvasContext';

// Hook de conveniência para acessar partes específicas do context
export const useCanvasState = () => {
  const context = useCanvas();
  return {
    components: context.components,
    connections: context.connections,
    selectedComponent: context.selectedComponent,
    connectingFrom: context.connectingFrom,
    selectedConnection: context.selectedConnection,
    pan: context.pan,
    zoom: context.zoom,
    isPanning: context.isPanning,
    isDragOver: context.isDragOver
  };
};

export const useCanvasActions = () => {
  const context = useCanvas();
  return {
    onComponentAdd: context.onComponentAdd,
    onComponentUpdate: context.onComponentUpdate,
    onComponentDelete: context.onComponentDelete,
    onComponentSelect: context.onComponentSelect,
    onConnectionAdd: context.onConnectionAdd,
    onConnectionDelete: context.onConnectionDelete,
    onConnectionUpdate: context.onConnectionUpdate,
    onConnectionSelect: context.onConnectionSelect,
    onConnectionColorChange: context.onConnectionColorChange,
    startConnection: context.startConnection,
    handleComponentConnect: context.handleComponentConnect,
    clearSelection: context.clearSelection,
    setSelectedComponent: context.setSelectedComponent
  };
};

export const useCanvasInteractions = () => {
  const context = useCanvas();
  return {
    // Zoom
    handleZoomIn: context.handleZoomIn,
    handleZoomOut: context.handleZoomOut,
    handleWheel: context.handleWheel,
    
    // Pan
    handleMouseDown: context.handleMouseDown,
    handleMouseMove: context.handleMouseMove,
    handleMouseUp: context.handleMouseUp,
    handleMouseLeave: context.handleMouseLeave,
    handleCanvasMouseDown: context.handleCanvasMouseDown,
    handleContextMenu: context.handleContextMenu,
    
    // Drag & Drop
    handleDrop: context.handleDrop,
    handleDragOver: context.handleDragOver,
    handleDragEnter: context.handleDragEnter,
    handleDragLeave: context.handleDragLeave
  };
};

// Re-export do hook principal para conveniência
export { useCanvas };
