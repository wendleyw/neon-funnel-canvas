import React, { useRef, useState, useCallback } from 'react';
import { FunnelComponent, ComponentTemplate, Connection } from '../types/funnel';
import { ComponentNode } from './ComponentNode';
import { ConnectionLine } from './ConnectionLine';

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
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 });
  const [isDragOver, setIsDragOver] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const templateData = e.dataTransfer.getData('application/json');
    if (!templateData) return;

    try {
      const template: ComponentTemplate = JSON.parse(templateData);
      
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      
      const newComponent: FunnelComponent = {
        id: `${template.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: template.type,
        position: { x: Math.max(0, x - 80), y: Math.max(0, y - 40) },
        data: { ...template.defaultData },
        connections: []
      };

      onComponentAdd(newComponent);
    } catch (error) {
      console.error('Error parsing template data:', error);
    }
  }, [onComponentAdd, pan, zoom]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const isInsideCanvas = e.clientX >= rect.left && 
                           e.clientX <= rect.right && 
                           e.clientY >= rect.top && 
                           e.clientY <= rect.bottom;
      if (!isInsideCanvas) {
        setIsDragOver(false);
      }
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as Element).closest('.canvas-background')) {
      setIsPanning(true);
      setLastPanPosition({ x: e.clientX, y: e.clientY });
      setSelectedComponent(null);
      setConnectingFrom(null);
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPosition.x;
      const deltaY = e.clientY - lastPanPosition.y;
      
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPosition({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPosition]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const newZoom = e.deltaY > 0 
      ? Math.max(0.5, zoom - zoomIntensity)
      : Math.min(2, zoom + zoomIntensity);
    
    setZoom(newZoom);
  }, [zoom]);

  const handleComponentDrag = useCallback((id: string, position: { x: number; y: number }) => {
    onComponentUpdate(id, { position });
  }, [onComponentUpdate]);

  const handleConnectionStart = useCallback((componentId: string) => {
    setConnectingFrom(componentId);
  }, []);

  const handleConnectionEnd = useCallback((componentId: string) => {
    if (connectingFrom && connectingFrom !== componentId) {
      const newConnection: Connection = {
        id: `connection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        from: connectingFrom,
        to: componentId,
        type: 'success'
      };
      
      onConnectionAdd(newConnection);
    }
    setConnectingFrom(null);
  }, [connectingFrom, onConnectionAdd]);

  return (
    <div className="flex-1 relative overflow-hidden bg-black">
      {/* Canvas Grid */}
      <div 
        className={`absolute inset-0 opacity-5 canvas-background ${isDragOver ? 'bg-gray-900' : ''}`}
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      />
      
      {isDragOver && (
        <div className="absolute inset-0 border-2 border-dashed border-white opacity-30 pointer-events-none z-50" />
      )}
      
      <div
        ref={canvasRef}
        className="w-full h-full relative canvas-container"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onMouseDown={handleMouseDown}
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
          {/* SVG for connections */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
          >
            {connections.map((connection) => {
              const fromComponent = components.find(c => c.id === connection.from);
              const toComponent = components.find(c => c.id === connection.to);
              
              if (!fromComponent || !toComponent) return null;
              
              return (
                <ConnectionLine
                  key={connection.id}
                  connection={connection}
                  fromPosition={fromComponent.position}
                  toPosition={toComponent.position}
                />
              );
            })}
          </svg>

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

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-10">
        <button
          onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
          className="w-8 h-8 bg-gray-900 hover:bg-gray-700 border border-gray-600 rounded flex items-center justify-center text-white text-sm transition-colors"
        >
          +
        </button>
        <div className="w-8 h-6 bg-gray-900 border border-gray-600 rounded flex items-center justify-center text-xs text-white">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
          className="w-8 h-8 bg-gray-900 hover:bg-gray-700 border border-gray-600 rounded flex items-center justify-center text-xs text-white transition-colors"
        >
          -
        </button>
      </div>

      {connectingFrom && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Clique em outro componente para conectar
        </div>
      )}
    </div>
  );
};
