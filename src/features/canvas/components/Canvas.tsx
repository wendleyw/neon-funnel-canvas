import React, { useCallback, useState, useEffect } from 'react';
import { FunnelComponent, Connection } from '../types/funnel';
import { DrawingShape } from '../types/drawing';
import { CanvasGrid } from './Canvas/CanvasGrid';
import { CanvasControls } from './Canvas/CanvasControls';
import { CanvasHelpers } from './Canvas/CanvasHelpers';
import { CanvasContainer } from './Canvas/CanvasContainer';
import { CanvasNavigationHelp } from './Canvas/CanvasNavigationHelp';
import { ErrorBoundary } from './ErrorBoundary';
import { useCanvasEventHandlers } from './Canvas/CanvasEventHandlers';
import { CanvasProvider } from '../contexts/CanvasContext';
import { useSequenceAnimation } from '../contexts/SequenceAnimationContext';
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
  onShapeAdd?: (shape: DrawingShape) => void;
}

export const Canvas = React.memo<CanvasProps>(({
  components,
  connections,
  onComponentAdd,
  onComponentUpdate,
  onComponentDelete,
  onConnectionAdd,
  onConnectionDelete,
  onConnectionUpdate,
  onShapeAdd
}) => {
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const { analyzeAndStartSequences } = useSequenceAnimation();

  // Expose connections globally for ConnectionLine components
  useEffect(() => {
    (window as any).__currentConnections = connections;
  }, [connections]);

  // Detect connection changes and analyze sequences
  useEffect(() => {
    if (connections.length > 0 && components.length > 0) {
      console.log('[Canvas] Connections or components changed, analyzing sequences...');
      analyzeAndStartSequences(connections, components);
    }
  }, [connections, components, analyzeAndStartSequences]);

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

  // Handle shape addition
  const handleShapeAdd = useCallback((shape: DrawingShape) => {
    if (onShapeAdd) {
      // Convert DrawingShape to FunnelComponent for now
      // This is a temporary solution - ideally we'd have proper diagram integration
      const funnelComponent: FunnelComponent = {
        id: shape.id,
        type: 'note', // Map to note component as it's more appropriate for diagram elements
        position: shape.position,
        data: {
          title: shape.text || 'Diagram Element',
          description: `${shape.type} shape added from diagrams`,
          status: 'active' as const,
          properties: {
            shapeType: shape.type,
            originalStyle: shape.style,
            textStyle: shape.textStyle,
            content: shape.text || '',
            width: shape.size.width,
            height: shape.size.height,
            background: shape.style?.fill || '#FFFFFF',
            border: `${shape.style?.strokeWidth || 1}px solid ${shape.style?.stroke || '#000000'}`,
            borderRadius: shape.style?.borderRadius || 0,
          },
        },
        connections: []
      };
      
      onComponentAdd(funnelComponent);
    }
  }, [onComponentAdd, onShapeAdd]);

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

          <CanvasNavigationHelp />

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
