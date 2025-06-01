
import React, { useRef, useMemo } from 'react';
import { FunnelComponent, Connection } from '../../types/funnel';
import { ComponentNode } from '../ComponentNode';
import { ConnectionManager } from './ConnectionManager';
import { FlowAnimation } from '../FlowAnimation';
import { ErrorBoundary } from '../ErrorBoundary';

interface CanvasContainerProps {
  components: FunnelComponent[];
  connections: Connection[];
  selectedComponent: string | null;
  connectingFrom: string | null;
  selectedConnection: string | null;
  pan: { x: number; y: number };
  zoom: number;
  isPanning: boolean;
  onComponentUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
  onComponentDelete: (id: string) => void;
  onComponentAdd: (component: FunnelComponent) => void;
  onConnectionSelect: (connectionId: string) => void;
  onConnectionColorChange?: (connectionId: string, newType: string) => void;
  onComponentSelect: (componentId: string) => void;
  startConnection: (componentId: string) => void;
  handleComponentConnect: (componentId: string) => void;
  onCanvasMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onWheel: (e: React.WheelEvent) => void;
  onDrop: (e: React.DragEvent, canvasRef: React.RefObject<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent, canvasRef: React.RefObject<HTMLDivElement>) => void;
  handleMouseDown: (e: React.MouseEvent, canvasRef: React.RefObject<HTMLDivElement>) => void;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({
  components,
  connections,
  selectedComponent,
  connectingFrom,
  selectedConnection,
  pan,
  zoom,
  isPanning,
  onComponentUpdate,
  onComponentDelete,
  onComponentAdd,
  onConnectionSelect,
  onConnectionColorChange,
  onComponentSelect,
  startConnection,
  handleComponentConnect,
  onCanvasMouseDown,
  onMouseMove,
  onMouseUp,
  onWheel,
  onDrop,
  onDragOver,
  onDragEnter,
  onDragLeave,
  handleMouseDown
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleComponentDrag = React.useCallback((id: string, position: { x: number; y: number }) => {
    onComponentUpdate(id, { position });
  }, [onComponentUpdate]);

  const handleComponentDuplicate = React.useCallback((componentId: string) => {
    const originalComponent = components.find(c => c.id === componentId);
    if (originalComponent) {
      const newComponent: FunnelComponent = {
        ...originalComponent,
        id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        position: {
          x: originalComponent.position.x + 50,
          y: originalComponent.position.y + 50
        },
        data: {
          ...originalComponent.data,
          title: `${originalComponent.data.title} (Cópia)`
        },
        connections: []
      };
      onComponentAdd(newComponent);
    }
  }, [components, onComponentAdd]);

  const handleCanvasMouseDown = React.useCallback((e: React.MouseEvent) => {
    // Call the canvas mouse down handler
    onCanvasMouseDown(e);
    // Call the pan mouse down handler with canvasRef
    handleMouseDown(e, canvasRef);
  }, [onCanvasMouseDown, handleMouseDown]);

  const transformStyle = useMemo(() => ({
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
    transformOrigin: '0 0'
  }), [pan.x, pan.y, zoom]);

  const canvasStyle = useMemo(() => ({
    cursor: isPanning ? 'grabbing' : 'grab'
  }), [isPanning]);

  // Handler para deletar conexão
  const handleConnectionDelete = useCallback((connectionId: string) => {
    // Usar o handler já existente do Canvas
    const deleteHandler = onConnectionColorChange; // Este é na verdade o handler de update/delete
    if (deleteHandler) {
      // Para deletar, vamos usar o onConnectionSelect que já tem a lógica de delete
      onConnectionSelect(connectionId);
    }
  }, [onConnectionSelect, onConnectionColorChange]);

  return (
    <div
      ref={canvasRef}
      className="w-full h-full relative canvas-container"
      onDrop={(e) => onDrop(e, canvasRef)}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={(e) => onDragLeave(e, canvasRef)}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onWheel={onWheel}
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
            selectedConnection={selectedConnection}
            onConnectionSelect={onConnectionSelect}
            onConnectionUpdate={onConnectionColorChange}
            onConnectionDelete={handleConnectionDelete}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <FlowAnimation
            components={components}
            connections={connections}
          />
        </ErrorBoundary>

        {/* Components */}
        {components.map((component) => (
          <ErrorBoundary key={component.id}>
            <ComponentNode
              component={component}
              isSelected={selectedComponent === component.id}
              isConnecting={connectingFrom !== null}
              canConnect={connectingFrom !== null && connectingFrom !== component.id}
              onSelect={() => onComponentSelect(component.id)}
              onStartConnection={() => startConnection(component.id)}
              onConnect={() => handleComponentConnect(component.id)}
              onDrag={handleComponentDrag}
              onDelete={() => onComponentDelete(component.id)}
              onUpdate={onComponentUpdate}
              onDuplicate={() => handleComponentDuplicate(component.id)}
            />
          </ErrorBoundary>
        ))}
      </div>
    </div>
  );
};
