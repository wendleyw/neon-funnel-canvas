
import React, { useRef, useCallback } from 'react';
import { FunnelComponent, ComponentTemplate, Connection } from '../types/funnel';
import { ComponentNode } from './ComponentNode';
import { CanvasGrid } from './Canvas/CanvasGrid';
import { CanvasControls } from './Canvas/CanvasControls';
import { ConnectionManager } from './Canvas/ConnectionManager';
import { useCanvasDragDrop } from '../hooks/canvas/useCanvasDragDrop';
import { useCanvasZoom } from '../hooks/canvas/useCanvasZoom';
import { useCanvasSelection } from '../hooks/canvas/useCanvasSelection';
import { useCanvasPan } from '../hooks/canvas/useCanvasPan';

interface CanvasProps {
  components: FunnelComponent[];
  connections: Connection[];
  onComponentAdd: (component: FunnelComponent) => void;
  onComponentUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
  onComponentDelete: (id: string) => void;
  onConnectionAdd: (connection: Connection) => void;
  onConnectionDelete: (connectionId: string) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
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
  const {
    selectedComponent,
    setSelectedComponent,
    connectingFrom,
    handleConnectionStart,
    handleConnectionEnd,
    clearSelection
  } = useCanvasSelection({ onConnectionAdd });

  // Canvas drag and drop functionality
  const {
    isDragOver,
    handleDrop,
    handleDragOver,
    handleDragEnter,
    handleDragLeave
  } = useCanvasDragDrop({ onComponentAdd, pan, zoom });

  // Enhanced mouse down handler that combines pan and selection
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    handleMouseDown(e, canvasRef);
    clearSelection();
  }, [handleMouseDown, clearSelection]);

  const handleComponentDrag = useCallback((id: string, position: { x: number; y: number }) => {
    onComponentUpdate(id, { position });
  }, [onComponentUpdate]);

  return (
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
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        <div 
          className="absolute inset-0"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          <ConnectionManager
            components={components}
            connections={connections}
            connectingFrom={connectingFrom}
          />

          {/* Components */}
          {components.map((component) => (
            <ComponentNode
              key={component.id}
              component={component}
              isSelected={selectedComponent === component.id}
              onSelect={() => setSelectedComponent(component.id)}
              onDrag={handleComponentDrag}
              onDelete={() => onComponentDelete(component.id)}
              onConnectionStart={handleConnectionStart}
              onConnectionEnd={handleConnectionEnd}
              isConnecting={connectingFrom !== null}
            />
          ))}
        </div>
      </div>

      <CanvasControls
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
    </div>
  );
};
