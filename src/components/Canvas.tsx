
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
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 });
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    console.log('Drop event triggered on canvas');
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) {
      console.log('No canvas rect found');
      return;
    }

    const templateData = e.dataTransfer.getData('application/json');
    console.log('Template data from dataTransfer:', templateData);
    
    if (!templateData) {
      console.log('No template data found in dataTransfer');
      return;
    }

    try {
      const template: ComponentTemplate = JSON.parse(templateData);
      console.log('Parsed template successfully:', template);
      
      // Calculate position relative to canvas viewport (not accounting for zoom/pan for simplicity)
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      console.log('Calculated position:', { x, y });
      
      const newComponent: FunnelComponent = {
        id: `${template.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: template.type,
        position: { x: Math.max(0, x - 80), y: Math.max(0, y - 40) }, // Center component on cursor
        data: { ...template.defaultData },
        connections: []
      };

      console.log('Creating new component:', newComponent);
      onComponentAdd(newComponent);
    } catch (error) {
      console.error('Error parsing template data:', error);
    }
  }, [onComponentAdd]);

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
    // Only set drag over to false if we're leaving the canvas completely
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
      
      {/* Drop indicator */}
      {isDragOver && (
        <div className="absolute inset-0 border-2 border-dashed border-white opacity-30 pointer-events-none z-50" />
      )}
      
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full relative"
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
        {/* Components Container */}
        <div 
          className="absolute inset-0"
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
    </div>
  );
};
