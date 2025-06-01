
import React, { useMemo, useCallback } from 'react';
import { FunnelComponent, Connection } from '../../types/funnel';
import { ComponentNode } from '../ComponentNode';
import { ConnectionManager } from './ConnectionManager';
import { FlowAnimation } from '../FlowAnimation';
import { ErrorBoundary } from '../ErrorBoundary';

interface CanvasContainerProps {
  canvasRef: React.RefObject<HTMLDivElement>;
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
  onConnectionColorChange?: (connectionId: string, updates: Partial<Connection>) => void;
  onComponentSelect: (componentId: string) => void;
  startConnection: (componentId: string) => void;
  handleComponentConnect: (componentId: string) => void;
  onCanvasMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onWheel: (e: React.WheelEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  isDragOver?: boolean;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({
  canvasRef,
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
  handleMouseDown,
  isDragOver = false
}) => {
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
    // Call the pan mouse down handler
    handleMouseDown(e);
  }, [onCanvasMouseDown, handleMouseDown]);

  const transformStyle = useMemo(() => ({
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
    transformOrigin: '0 0'
  }), [pan.x, pan.y, zoom]);

  const canvasStyle = useMemo(() => ({
    cursor: isPanning ? 'grabbing' : isDragOver ? 'copy' : 'grab'
  }), [isPanning, isDragOver]);

  // Handler para deletar conexão
  const handleConnectionDelete = useCallback((connectionId: string) => {
    onConnectionSelect(connectionId);
  }, [onConnectionSelect]);

  return (
    <div
      ref={canvasRef}
      className={`w-full h-full relative canvas-container ${
        isDragOver ? 'bg-blue-900/10 border-2 border-blue-500 border-dashed' : ''
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onWheel={onWheel}
      style={canvasStyle}
    >
      <div 
        className="absolute inset-0 canvas-background"
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
