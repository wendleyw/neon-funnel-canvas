
import React, { useCallback, useState } from 'react';
import { FunnelComponent, Connection } from '../types/funnel';
import { CanvasGrid } from './Canvas/CanvasGrid';
import { CanvasControls } from './Canvas/CanvasControls';
import { CanvasHelpers } from './Canvas/CanvasHelpers';
import { CanvasContainer } from './Canvas/CanvasContainer';
import { ErrorBoundary } from './ErrorBoundary';
import { useCanvasEventHandlers } from './Canvas/CanvasEventHandlers';
import { CanvasProvider } from '../contexts/CanvasContext';
import { MiniMap } from './MiniMap';
import { MobilePreviewButton } from './Canvas/MobilePreviewButton';
import { InstagramMockupModal } from '../features/social-media/instagram/components/InstagramMockupModal';

interface CanvasProps {
  components: FunnelComponent[];
  connections: Connection[];
  onComponentAdd: (component: FunnelComponent) => void;
  onComponentUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
  onComponentDelete: (id: string) => void;
  onConnectionAdd: (connection: Connection) => void;
  onConnectionDelete: (connectionId: string) => void;
  onConnectionUpdate?: (connectionId: string, updates: Partial<Connection>) => void;
}

export const Canvas = React.memo<CanvasProps>(({
  components,
  connections,
  onComponentAdd,
  onComponentUpdate,
  onComponentDelete,
  onConnectionAdd,
  onConnectionDelete,
  onConnectionUpdate
}) => {
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);

  const eventHandlers = useCanvasEventHandlers({
    onComponentAdd,
    onConnectionAdd,
    onConnectionDelete,
    onConnectionUpdate
  });

  const handleMiniMapComponentClick = useCallback((componentId: string) => {
    const component = components.find(c => c.id === componentId);
    if (component) {
      eventHandlers.setSelectedComponent(componentId);
    }
  }, [components, eventHandlers]);

  const handleMobilePreviewClick = useCallback(() => {
    setIsInstagramModalOpen(true);
  }, []);

  // Criar o valor do context com todas as props e handlers
  const canvasContextValue = {
    // Estado
    components,
    connections,
    selectedComponent: eventHandlers.selectedComponent,
    connectingFrom: eventHandlers.connectingFrom,
    selectedConnection: eventHandlers.selectedConnection,
    pan: eventHandlers.pan,
    zoom: eventHandlers.zoom,
    isPanning: eventHandlers.isPanning,
    isDragOver: eventHandlers.isDragOver,
    canvasRef: eventHandlers.canvasRef,
    
    // Actions externas
    onComponentAdd,
    onComponentUpdate,
    onComponentDelete,
    onConnectionAdd,
    onConnectionDelete,
    onConnectionUpdate,
    
    // Actions internas dos handlers
    onComponentSelect: eventHandlers.handleComponentSelect,
    onConnectionSelect: eventHandlers.handleConnectionSelect,
    onConnectionColorChange: eventHandlers.handleConnectionColorChange,
    startConnection: eventHandlers.startConnection,
    handleComponentConnect: eventHandlers.handleComponentConnect,
    clearSelection: eventHandlers.clearSelection,
    setSelectedComponent: eventHandlers.setSelectedComponent,
    
    // Zoom
    handleZoomIn: eventHandlers.handleZoomIn,
    handleZoomOut: eventHandlers.handleZoomOut,
    handleWheel: eventHandlers.handleWheel,
    
    // Pan
    handleMouseDown: eventHandlers.handleMouseDown,
    handleMouseMove: eventHandlers.handleMouseMove,
    handleMouseUp: eventHandlers.handleMouseUp,
    handleMouseLeave: eventHandlers.handleMouseLeave,
    handleCanvasMouseDown: eventHandlers.handleCanvasMouseDown,
    handleContextMenu: eventHandlers.handleContextMenu,
    
    // Drag & Drop
    handleDrop: eventHandlers.handleDrop,
    handleDragOver: eventHandlers.handleDragOver,
    handleDragEnter: eventHandlers.handleDragEnter,
    handleDragLeave: eventHandlers.handleDragLeave
  };

  return (
    <ErrorBoundary>
      <CanvasProvider value={canvasContextValue}>
        <div className="absolute inset-0 w-full h-full bg-black">
          <CanvasGrid 
            zoom={eventHandlers.zoom} 
            pan={eventHandlers.pan} 
            isDragOver={eventHandlers.isDragOver} 
          />
          
          <CanvasHelpers
            connectingFrom={eventHandlers.connectingFrom}
            selectedConnection={eventHandlers.selectedConnection}
          />
          
          <CanvasContainer />

          <CanvasControls
            zoom={eventHandlers.zoom}
            onZoomIn={eventHandlers.handleZoomIn}
            onZoomOut={eventHandlers.handleZoomOut}
            onResetView={eventHandlers.handleResetView}
            onFitToScreen={eventHandlers.handleFitToScreen}
          />

          <MiniMap
            components={components}
            connections={connections}
            canvasTransform={{ pan: eventHandlers.pan, zoom: eventHandlers.zoom }}
            onComponentClick={handleMiniMapComponentClick}
          />

          <MobilePreviewButton onClick={handleMobilePreviewClick} />

          <InstagramMockupModal
            isOpen={isInstagramModalOpen}
            onClose={() => setIsInstagramModalOpen(false)}
          />
        </div>
      </CanvasProvider>
    </ErrorBoundary>
  );
});

Canvas.displayName = 'Canvas';
