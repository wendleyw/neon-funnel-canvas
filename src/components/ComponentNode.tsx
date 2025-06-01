
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

  const handleDoubleClick = () => {
    // Open properties panel
    console.log('Edit component:', component.id);
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Show context menu
    console.log('Context menu for:', component.id);
  };

  if (!template) return null;

  return (
    <div
      ref={nodeRef}
      className={`absolute select-none cursor-move group ${
        isSelected ? 'ring-2 ring-blue-400' : ''
      }`}
      style={{
        left: component.position.x,
        top: component.position.y,
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
        zIndex: isSelected ? 1000 : 1
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleRightClick}
    >
      {/* Main Component Card */}
      <div className="w-48 bg-gray-800 rounded-lg border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-200">
        {/* Header */}
        <div className={`${template.color} rounded-t-lg p-3 flex items-center justify-between`}>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{template.icon}</span>
            <span className="text-white font-medium text-sm">{template.label}</span>
          </div>
          {isSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-white hover:text-red-300 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className="p-3">
          <h4 className="text-white font-medium text-sm mb-1">{component.data.title}</h4>
          <p className="text-gray-400 text-xs mb-3">{component.data.description}</p>
          
          {/* Properties Preview */}
          <div className="space-y-1">
            {Object.entries(component.data.properties).slice(0, 2).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-gray-400 capitalize">{key.replace('_', ' ')}:</span>
                <span className="text-gray-300">
                  {typeof value === 'number' ? value : String(value).slice(0, 10)}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Connection Points */}
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-gray-800 hover:bg-blue-400 transition-colors cursor-crosshair" />
        </div>
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800 hover:bg-green-400 transition-colors cursor-crosshair" />
        </div>
      </div>
      
      {/* Success Rate Indicator */}
      {component.data.properties.conversionRate && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
          {component.data.properties.conversionRate}%
        </div>
      )}
    </div>
  );
};
