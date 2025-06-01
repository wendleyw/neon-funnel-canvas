
import React, { useCallback } from 'react';
import { FunnelComponent, Connection } from '../types/funnel';
import { CanvasGrid } from './Canvas/CanvasGrid';
import { CanvasControls } from './Canvas/CanvasControls';
import { CanvasHelpers } from './Canvas/CanvasHelpers';
import { CanvasContainer } from './Canvas/CanvasContainer';
import { ErrorBoundary } from './ErrorBoundary';
import { useCanvasEventHandlers } from './Canvas/CanvasEventHandlers';
import { MiniMap } from './MiniMap';

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

  const handleAddCompleteTemplate = useCallback((newComponents: FunnelComponent[], newConnections: Connection[]) => {
    // Adicionar todos os componentes
    newComponents.forEach(component => {
      onComponentAdd(component);
    });
    
    // Adicionar todas as conexões
    newConnections.forEach(connection => {
      onConnectionAdd(connection);
    });
  }, [onComponentAdd, onConnectionAdd]);

  return (
    <ErrorBoundary>
      <div className="flex-1 relative overflow-hidden bg-black">
        <CanvasGrid 
          zoom={eventHandlers.zoom} 
          pan={eventHandlers.pan} 
          isDragOver={eventHandlers.isDragOver} 
        />
        
        <CanvasHelpers
          connectingFrom={eventHandlers.connectingFrom}
          selectedConnection={eventHandlers.selectedConnection}
        />
        
        <CanvasContainer
          components={components}
          connections={connections}
          selectedComponent={eventHandlers.selectedComponent}
          connectingFrom={eventHandlers.connectingFrom}
          selectedConnection={eventHandlers.selectedConnection}
          pan={eventHandlers.pan}
          zoom={eventHandlers.zoom}
          isPanning={eventHandlers.isPanning}
          onComponentUpdate={onComponentUpdate}
          onComponentDelete={onComponentDelete}
          onComponentAdd={onComponentAdd}
          onConnectionSelect={eventHandlers.handleConnectionSelect}
          onConnectionColorChange={eventHandlers.handleConnectionColorChange}
          onComponentSelect={eventHandlers.handleComponentSelect}
          startConnection={eventHandlers.startConnection}
          handleComponentConnect={eventHandlers.handleComponentConnect}
          onCanvasMouseDown={eventHandlers.handleCanvasMouseDown}
          onMouseMove={eventHandlers.handleMouseMove}
          onMouseUp={eventHandlers.handleMouseUp}
          onWheel={eventHandlers.handleWheel}
          onDrop={eventHandlers.handleDrop}
          onDragOver={eventHandlers.handleDragOver}
          onDragEnter={eventHandlers.handleDragEnter}
          onDragLeave={eventHandlers.handleDragLeave}
          handleMouseDown={eventHandlers.handleMouseDown}
        />

        <CanvasControls
          zoom={eventHandlers.zoom}
          onZoomIn={eventHandlers.handleZoomIn}
          onZoomOut={eventHandlers.handleZoomOut}
        />

        <MiniMap
          components={components}
          connections={connections}
          canvasTransform={{ pan: eventHandlers.pan, zoom: eventHandlers.zoom }}
          onComponentClick={handleMiniMapComponentClick}
        />
      </div>
    </ErrorBoundary>
  );
});

Canvas.displayName = 'Canvas';
