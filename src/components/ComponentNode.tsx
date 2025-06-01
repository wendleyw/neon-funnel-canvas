
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FunnelComponent } from '../types/funnel';
import { componentTemplates } from '../data/componentTemplates';
import { useComponentDrag } from '../hooks/canvas/useComponentDrag';

interface ComponentNodeProps {
  component: FunnelComponent;
  isSelected: boolean;
  onSelect: () => void;
  onDrag: (id: string, position: { x: number; y: number }) => void;
  onDelete: () => void;
  onConnectionStart?: (componentId: string) => void;
  onConnectionEnd?: (componentId: string) => void;
  isConnecting?: boolean;
}

export const ComponentNode = React.memo<ComponentNodeProps>(({
  component,
  isSelected,
  onSelect,
  onDrag,
  onDelete,
  onConnectionStart,
  onConnectionEnd,
  isConnecting = false
}) => {
  const [showConnectionPoints, setShowConnectionPoints] = useState(false);

  const dragHandlers = useMemo(() => ({
    componentId: component.id,
    onDrag,
    onSelect
  }), [component.id, onDrag, onSelect]);

  const {
    isDragging,
    nodeRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useComponentDrag(dragHandlers);

  const template = useMemo(() => 
    componentTemplates.find(t => t.type === component.type), 
    [component.type]
  );

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleConnectionPointClick = useCallback((e: React.MouseEvent, isOutput: boolean) => {
    e.stopPropagation();
    
    if (isOutput && onConnectionStart) {
      onConnectionStart(component.id);
    } else if (!isOutput && onConnectionEnd && isConnecting) {
      onConnectionEnd(component.id);
    }
  }, [component.id, onConnectionStart, onConnectionEnd, isConnecting]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  }, [onDelete]);

  const handleMouseEnter = useCallback(() => {
    setShowConnectionPoints(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowConnectionPoints(false);
  }, []);

  const containerStyle = useMemo(() => ({
    left: component.position.x,
    top: component.position.y,
    zIndex: isSelected ? 1000 : isDragging ? 999 : 1
  }), [component.position.x, component.position.y, isSelected, isDragging]);

  const containerClassName = useMemo(() => 
    `absolute select-none transition-all duration-200 ${
      isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab'
    } ${isSelected ? 'ring-2 ring-white ring-opacity-50' : ''}`,
    [isDragging, isSelected]
  );

  const connectionPointClassName = useMemo(() => 
    `w-4 h-4 rounded-full border-2 border-white transition-colors cursor-pointer shadow-lg ${
      isConnecting ? 'bg-blue-500 hover:bg-blue-400' : 'bg-gray-500 hover:bg-gray-400'
    }`,
    [isConnecting]
  );

  if (!template) return null;

  return (
    <div
      ref={nodeRef}
      className={containerClassName}
      style={containerStyle}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Component Card */}
      <div className="w-40 bg-gray-900 rounded-lg border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-600">
        {/* Header */}
        <div className="bg-gray-800 rounded-t-lg p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm">{template.icon}</span>
            <span className="text-white font-medium text-xs">{template.label}</span>
          </div>
          {isSelected && (
            <button
              onClick={handleDeleteClick}
              className="text-white hover:text-red-400 transition-colors text-lg font-bold leading-none"
            >
              ×
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className="p-3">
          <h4 className="text-white font-medium text-sm mb-1">{component.data.title}</h4>
          <p className="text-gray-400 text-xs leading-relaxed">{component.data.description}</p>
        </div>
        
        {/* Connection Points */}
        {(showConnectionPoints || isConnecting) && (
          <>
            {/* Output connection point (right) */}
            <div 
              className="absolute -right-2 top-1/2 transform -translate-y-1/2 connection-point"
              onClick={(e) => handleConnectionPointClick(e, true)}
            >
              <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white hover:bg-green-400 transition-colors cursor-pointer shadow-lg" />
            </div>
            
            {/* Input connection point (left) */}
            <div 
              className="absolute -left-2 top-1/2 transform -translate-y-1/2 connection-point"
              onClick={(e) => handleConnectionPointClick(e, false)}
            >
              <div className={connectionPointClassName} />
            </div>
          </>
        )}
      </div>
    </div>
  );
});

ComponentNode.displayName = 'ComponentNode';
