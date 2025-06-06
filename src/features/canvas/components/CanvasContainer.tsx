import React, { useMemo, useCallback } from 'react';
import { FunnelComponent } from '../../../types/funnel';
import { ComponentNode } from '../ComponentNode';
import { ConnectionManager } from './ConnectionManager';
import { FlowAnimation } from '../FlowAnimation';
import { ErrorBoundary } from '@/features/shared/components/ErrorBoundary';
import { useCanvas } from '../../../contexts/CanvasContext';

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
          title: `${originalComponent.data.title} (Copy)`
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

  const handleContextMenuInternal = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleContextMenu?.(e);
  }, [handleContextMenu]);

  const handleConnectionDelete = useCallback((connectionId: string) => {
    onConnectionSelect(connectionId);
  }, [onConnectionSelect]);

  // Optimized transform style - memoized to prevent unnecessary recalculations
  const transformStyle = useMemo(() => ({
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
    transformOrigin: '0 0',
    width: '10000px',
    height: '10000px',
    position: 'absolute' as const,
    left: '-5000px',
    top: '-5000px'
  }), [pan.x, pan.y, zoom]);

  // Optimized canvas style - memoized
  const canvasStyle = useMemo(() => ({
    cursor: isPanning ? 'grabbing' : isDragOver ? 'copy' : 'default',
    userSelect: (isPanning ? 'none' : 'auto') as 'none' | 'auto',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative' as const,
    backgroundColor: '#000000'
  }), [isPanning, isDragOver]);

  // Memoized component list to prevent unnecessary re-renders
  const componentNodes = useMemo(() => {
    return components.map((component) => (
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
    ));
  }, [
    components,
    selectedComponent,
    connectingFrom,
    onComponentSelect,
    startConnection,
    handleComponentConnect,
    handleComponentDrag,
    onComponentDelete,
    onComponentUpdate,
    handleComponentDuplicate
  ]);

  return (
    <div
      ref={canvasRef}
      className={`canvas-container absolute inset-0 w-full h-full ${
        isDragOver ? 'ring-4 ring-blue-500/50 ring-inset' : ''
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
      onContextMenu={handleContextMenuInternal}
      style={canvasStyle}
    >
      {/* Infinite canvas viewport */}
      <div 
        className="canvas-viewport"
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

        {/* Optimized component rendering */}
        {componentNodes}
      </div>
    </div>
  );
};
