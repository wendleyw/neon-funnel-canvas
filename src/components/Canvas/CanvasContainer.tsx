
import React, { useMemo, useCallback } from 'react';
import { FunnelComponent } from '../../types/funnel';
import { ComponentNode } from '../ComponentNode';
import { ConnectionManager } from './ConnectionManager';
import { FlowAnimation } from '../FlowAnimation';
import { ErrorBoundary } from '../ErrorBoundary';
import { useCanvas } from '../../contexts/CanvasContext';

export const CanvasContainer: React.FC = () => {
  const {
    canvasRef,
    components,
    connections,
    selectedComponent,
    connectingFrom,
    selectedConnection,
    pan,
    zoom,
    isPanning,
    isDragOver,
    onComponentUpdate,
    onComponentDelete,
    onComponentAdd,
    onConnectionSelect,
    onConnectionColorChange,
    onComponentSelect,
    startConnection,
    handleComponentConnect,
    handleCanvasMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleWheel,
    handleDrop,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleMouseDown,
    handleContextMenu
  } = useCanvas();

  const handleComponentDrag = useCallback((id: string, position: { x: number; y: number }) => {
    console.log('Component dragged to position:', position);
    onComponentUpdate(id, { position });
  }, [onComponentUpdate]);

  const handleComponentDuplicate = useCallback((componentId: string) => {
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

  const handleCanvasMouseDownInternal = useCallback((e: React.MouseEvent) => {
    handleCanvasMouseDown(e);
    handleMouseDown(e);
  }, [handleCanvasMouseDown, handleMouseDown]);

  const transformStyle = useMemo(() => ({
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
    transformOrigin: '0 0'
  }), [pan.x, pan.y, zoom]);

  const canvasStyle = useMemo(() => ({
    cursor: isPanning ? 'grabbing' : isDragOver ? 'copy' : 'grab',
    userSelect: (isPanning ? 'none' : 'auto') as 'none' | 'auto'
  }), [isPanning, isDragOver]);

  const handleConnectionDelete = useCallback((connectionId: string) => {
    onConnectionSelect(connectionId);
  }, [onConnectionSelect]);

  console.log('CanvasContainer render:', {
    componentsCount: components.length,
    connectionsCount: connections.length,
    pan,
    zoom,
    isDragOver,
    isPanning
  });

  return (
    <div
      ref={canvasRef}
      className={`canvas-container w-full h-full relative overflow-hidden ${
        isDragOver ? 'bg-blue-900/10 border-2 border-blue-500 border-dashed' : ''
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onMouseDown={handleCanvasMouseDownInternal}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
      onContextMenu={handleContextMenu}
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
        {components.map((component) => {
          console.log('Rendering component:', component.id, component.position);
          return (
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
          );
        })}
      </div>
    </div>
  );
};
