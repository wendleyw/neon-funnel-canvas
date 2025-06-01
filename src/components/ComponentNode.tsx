
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FunnelComponent } from '../types/funnel';
import { componentTemplates } from '../data/componentTemplates';
import { useComponentDrag } from '../hooks/canvas/useComponentDrag';
import { ComponentEditor } from './ComponentEditor';
import { StatusBadge } from './StatusBadge';
import { Plus, Settings, Eye } from 'lucide-react';

interface ComponentNodeProps {
  component: FunnelComponent;
  isSelected: boolean;
  onSelect: () => void;
  onDrag: (id: string, position: { x: number; y: number }) => void;
  onDelete: () => void;
  onUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
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
  onUpdate,
  onConnectionStart,
  onConnectionEnd,
  isConnecting = false
}) => {
  const [showConnectionPoints, setShowConnectionPoints] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleUpdateComponent = useCallback((updates: Partial<FunnelComponent>) => {
    onUpdate(component.id, updates);
  }, [component.id, onUpdate]);

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
    } ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`,
    [isDragging, isSelected]
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
      onDoubleClick={handleDoubleClick}
    >
      {/* Main Component Card */}
      <div className="w-48 bg-gray-900 rounded-lg border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-600 relative">
        {/* Header */}
        <div className="bg-gray-800 rounded-t-lg p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <span className="text-white text-sm">{template.icon}</span>
            <span className="text-white font-medium text-xs truncate">{template.label}</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={handleEditClick}
              className="text-gray-400 hover:text-blue-400 transition-colors p-1"
              title="Editar componente"
            >
              <Plus className="w-3 h-3" />
            </button>
            {isSelected && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implementar ações avançadas
                  }}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                  title="Configurações avançadas"
                >
                  <Settings className="w-3 h-3" />
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="text-gray-400 hover:text-red-400 transition-colors text-lg font-bold leading-none p-1"
                >
                  ×
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Image Preview */}
        {component.data.image && (
          <div className="px-3 pt-2">
            <img
              src={component.data.image}
              alt={component.data.title}
              className="w-full h-16 object-cover rounded border border-gray-700"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="p-3">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-white font-medium text-sm flex-1 min-w-0 truncate">
              {component.data.title}
            </h4>
            <StatusBadge status={component.data.status} />
          </div>
          
          {component.data.description && (
            <p className="text-gray-400 text-xs leading-relaxed mb-2 line-clamp-2">
              {component.data.description}
            </p>
          )}
          
          {component.data.url && (
            <div className="flex items-center space-x-1 text-xs text-blue-400">
              <Eye className="w-3 h-3" />
              <span className="truncate">{component.data.url}</span>
            </div>
          )}
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
              <div className={`w-4 h-4 rounded-full border-2 border-white transition-colors cursor-pointer shadow-lg ${
                isConnecting ? 'bg-blue-500 hover:bg-blue-400' : 'bg-gray-500 hover:bg-gray-400'
              }`} />
            </div>
          </>
        )}
      </div>

      {/* Editor Panel */}
      {isEditing && (
        <ComponentEditor
          component={component}
          onUpdate={handleUpdateComponent}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
});

ComponentNode.displayName = 'ComponentNode';
