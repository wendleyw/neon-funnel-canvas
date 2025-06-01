
import React, { useState, useRef } from 'react';
import { FunnelComponent } from '../types/funnel';
import { componentTemplates } from '../data/componentTemplates';

interface ComponentNodeProps {
  component: FunnelComponent;
  isSelected: boolean;
  onSelect: () => void;
  onDrag: (id: string, position: { x: number; y: number }) => void;
  onDelete: () => void;
}

export const ComponentNode: React.FC<ComponentNodeProps> = ({
  component,
  isSelected,
  onSelect,
  onDrag,
  onDelete
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);

  const template = componentTemplates.find(t => t.type === component.type);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    onSelect();
    
    const rect = nodeRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      };
      onDrag(component.id, newPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  if (!template) return null;

  return (
    <div
      ref={nodeRef}
      className={`absolute select-none cursor-move ${
        isSelected ? 'ring-1 ring-white' : ''
      }`}
      style={{
        left: component.position.x,
        top: component.position.y,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        zIndex: isSelected ? 1000 : 1
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Main Component Card */}
      <div className="w-40 bg-gray-900 rounded border border-gray-800 shadow-lg hover:shadow-xl transition-all">
        {/* Header */}
        <div className="bg-gray-800 rounded-t p-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm">{template.icon}</span>
            <span className="text-white font-medium text-xs">{template.label}</span>
          </div>
          {isSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-white hover:text-red-400 transition-colors text-xs"
            >
              ×
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className="p-2">
          <h4 className="text-white font-medium text-xs mb-1">{component.data.title}</h4>
          <p className="text-gray-400 text-xs">{component.data.description}</p>
        </div>
        
        {/* Connection Points */}
        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
          <div className="w-3 h-3 bg-white rounded-full border border-gray-800 hover:bg-gray-200 transition-colors cursor-crosshair" />
        </div>
        <div className="absolute -left-1 top-1/2 transform -translate-y-1/2">
          <div className="w-3 h-3 bg-white rounded-full border border-gray-800 hover:bg-gray-200 transition-colors cursor-crosshair" />
        </div>
      </div>
    </div>
  );
};
