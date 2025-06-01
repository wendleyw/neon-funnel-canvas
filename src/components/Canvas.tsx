import React, { useRef, useCallback, useMemo } from 'react';
import { FunnelComponent, ComponentTemplate, Connection } from '../types/funnel';
import { ComponentNode } from './ComponentNode';
import { CanvasGrid } from './Canvas/CanvasGrid';
import { CanvasControls } from './Canvas/CanvasControls';
import { ConnectionManager } from './Canvas/ConnectionManager';
import { ErrorBoundary } from './ErrorBoundary';
import { useCanvasDragDrop } from '../hooks/canvas/useCanvasDragDrop';
import { useCanvasZoom } from '../hooks/canvas/useCanvasZoom';
import { useCanvasSelection } from '../hooks/canvas/useCanvasSelection';
import { useCanvasPan } from '../hooks/canvas/useCanvasPan';
import { MiniMap } from './MiniMap';

interface CanvasProps {
  components: FunnelComponent[];
  connections: Connection[];
  onComponentAdd: (component: FunnelComponent) => void;
  onComponentUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
  onComponentDelete: (id: string) => void;
  onConnectionAdd: (connection: Connection) => void;
  onConnectionDelete: (connectionId: string) => void;
}

export const Canvas = React.memo<CanvasProps>(({
  components,
  connections,
  onComponentAdd,
  onComponentUpdate,
  onComponentDelete,
  onConnectionAdd,
  onConnectionDelete
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Canvas zoom functionality
  const { zoom, handleWheel, handleZoomIn, handleZoomOut } = useCanvasZoom();

  // Canvas pan functionality
  const { pan, isPanning, handleMouseDown, handleMouseMove, handleMouseUp } = useCanvasPan();

  // Canvas selection and connection functionality
  const selectionProps = useMemo(() => ({ onConnectionAdd }), [onConnectionAdd]);
  const {
    selectedComponent,
    setSelectedComponent,
    connectingFrom,
    handleConnectionStart,
    handleConnectionEnd,
    clearSelection
  } = useCanvasSelection(selectionProps);

  // Canvas drag and drop functionality
  const dragDropProps = useMemo(() => ({ onComponentAdd, pan, zoom }), [onComponentAdd, pan, zoom]);
  const {
    isDragOver,
    handleDrop,
    handleDragOver,
    handleDragEnter,
    handleDragLeave
  } = useCanvasDragDrop(dragDropProps);

  // Enhanced mouse down handler that combines pan and selection
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    handleMouseDown(e, canvasRef);
    clearSelection();
  }, [handleMouseDown, clearSelection]);

  const handleComponentDrag = useCallback((id: string, position: { x: number; y: number }) => {
    onComponentUpdate(id, { position });
  }, [onComponentUpdate]);

  const handleMiniMapComponentClick = useCallback((componentId: string) => {
    const component = components.find(c => c.id === componentId);
    if (component) {
      // Centralizar o componente na tela
      const newPan = {
        x: -component.position.x * zoom + window.innerWidth / 2,
        y: -component.position.y * zoom + window.innerHeight / 2
      };
      // TODO: Implementar setPan no hook useCanvasPan
      setSelectedComponent(componentId);
    }
  }, [components, zoom, setSelectedComponent]);

  const transformStyle = useMemo(() => ({
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
    transformOrigin: '0 0'
  }), [pan.x, pan.y, zoom]);

  const canvasStyle = useMemo(() => ({
    cursor: isPanning ? 'grabbing' : 'grab'
  }), [isPanning]);

  return (
    <ErrorBoundary>
      <div className="flex-1 relative overflow-hidden bg-black">
        <CanvasGrid zoom={zoom} pan={pan} isDragOver={isDragOver} />
        
        <div
          ref={canvasRef}
          className="w-full h-full relative canvas-container"
          onDrop={(e) => handleDrop(e, canvasRef)}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={(e) => handleDragLeave(e, canvasRef)}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          style={canvasStyle}
        >
          <div 
            className="absolute inset-0"
            style={transformStyle}
          >
            <ErrorBoundary>
              <ConnectionManager
                components={components}
                connections={connections}
                connectingFrom={connectingFrom}
              />
            </ErrorBoundary>

            {/* Components */}
            {components.map((component) => (
              <ErrorBoundary key={component.id}>
                <ComponentNode
                  component={component}
                  isSelected={selectedComponent === component.id}
                  onSelect={() => setSelectedComponent(component.id)}
                  onDrag={handleComponentDrag}
                  onDelete={() => onComponentDelete(component.id)}
                  onUpdate={onComponentUpdate}
                  onConnectionStart={handleConnectionStart}
                  onConnectionEnd={handleConnectionEnd}
                  isConnecting={connectingFrom !== null}
                />
              </ErrorBoundary>
            ))}
          </div>
        </div>

        <CanvasControls
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />

        <MiniMap
          components={components}
          connections={connections}
          canvasTransform={{ pan, zoom }}
          onComponentClick={handleMiniMapComponentClick}
        />
      </div>
    </ErrorBoundary>
  );
});

Canvas.displayName = 'Canvas';
