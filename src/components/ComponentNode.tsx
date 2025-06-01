
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
  isFirstSelected?: boolean;
  onSelect: () => void;
  onDrag: (id: string, position: { x: number; y: number }) => void;
  onDelete: () => void;
  onUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
}

export const ComponentNode = React.memo<ComponentNodeProps>(({
  component,
  isSelected,
  isFirstSelected = false,
  onSelect,
  onDrag,
  onDelete,
  onUpdate
}) => {
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

  const containerStyle = useMemo(() => ({
    left: component.position.x,
    top: component.position.y,
    zIndex: isSelected ? 1000 : isDragging ? 999 : 1
  }), [component.position.x, component.position.y, isSelected, isDragging]);

  const containerClassName = useMemo(() => {
    let classes = `absolute select-none transition-all duration-200 ${
      isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab'
    }`;
    
    if (isFirstSelected) {
      classes += ' ring-4 ring-blue-500 ring-opacity-70 animate-pulse';
    } else if (isSelected) {
      classes += ' ring-2 ring-blue-400 ring-opacity-50';
    }
    
    return classes;
  }, [isDragging, isSelected, isFirstSelected]);

  if (!template) return null;

  return (
    <div
      ref={nodeRef}
      className={containerClassName}
      style={containerStyle}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Main Component Card */}
      <div className="w-48 bg-gray-900 rounded-lg border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-600 relative group">
        {/* Indicator para primeiro selecionado */}
        {isFirstSelected && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
            1
          </div>
        )}
        
        {/* Header */}
        <div className="bg-gray-800 rounded-t-lg p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <span className="text-white text-sm">{template.icon}</span>
            <span className="text-white font-medium text-xs truncate">{template.label}</span>
          </div>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 bg-gray-500 rounded-full border-2 border-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
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
