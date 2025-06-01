
import React, { useRef, useState, useCallback } from 'react';
import { FunnelComponent, ComponentTemplate } from '../types/funnel';
import { ComponentNode } from './ComponentNode';

interface CanvasProps {
  components: FunnelComponent[];
  onComponentAdd: (component: FunnelComponent) => void;
  onComponentUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
  onComponentDelete: (id: string) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  components,
  onComponentAdd,
  onComponentUpdate,
  onComponentDelete
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 });

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const templateData = e.dataTransfer.getData('application/json');
    if (!templateData) return;

    const template: ComponentTemplate = JSON.parse(templateData);
    
    const newComponent: FunnelComponent = {
      id: `${template.type}-${Date.now()}`,
      type: template.type,
      position: {
        x: (e.clientX - rect.left - pan.x) / zoom,
        y: (e.clientY - rect.top - pan.y) / zoom
      },
      data: template.defaultData,
      connections: []
    };

    onComponentAdd(newComponent);
  }, [onComponentAdd, zoom, pan]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setIsPanning(true);
      setLastPanPosition({ x: e.clientX, y: e.clientY });
      setSelectedComponent(null);
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

  return (
    <div className="flex-1 relative overflow-hidden bg-gray-950">
      {/* Canvas Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      />
      
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        {/* Components */}
        <div 
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {components.map((component) => (
            <ComponentNode
              key={component.id}
              component={component}
              isSelected={selectedComponent === component.id}
              onSelect={() => setSelectedComponent(component.id)}
              onDrag={handleComponentDrag}
              onDelete={() => onComponentDelete(component.id)}
            />
          ))}
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
        <button
          onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
          className="w-10 h-10 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg flex items-center justify-center text-white transition-colors"
        >
          +
        </button>
        <div className="w-10 h-8 bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center text-xs text-gray-300">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
          className="w-10 h-10 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg flex items-center justify-center text-white transition-colors"
        >
          -
        </button>
      </div>

      {/* Mini Map */}
      <div className="absolute top-6 right-6 w-48 h-32 bg-gray-900 border border-gray-700 rounded-lg p-2">
        <div className="text-xs text-gray-400 mb-2">Minimap</div>
        <div className="relative w-full h-20 bg-gray-800 rounded overflow-hidden">
          {components.map((component) => (
            <div
              key={component.id}
              className="absolute w-2 h-2 bg-blue-400 rounded-sm"
              style={{
                left: `${(component.position.x / 2000) * 100}%`,
                top: `${(component.position.y / 1000) * 100}%`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
