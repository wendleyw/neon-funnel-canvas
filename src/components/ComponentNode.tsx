
import React, { useState, useMemo, useCallback } from 'react';
import { Copy, Link } from 'lucide-react';
import { FunnelComponent } from '../types/funnel';
import { useComponentTemplates } from '../hooks/useComponentTemplates';
import { useComponentDrag } from '../hooks/canvas/useComponentDrag';
import { ComponentEditor } from './ComponentEditor';
import { ComponentNodeCard } from './ComponentNode/ComponentNodeCard';

interface ComponentNodeProps {
  component: FunnelComponent;
  isSelected: boolean;
  isConnecting?: boolean;
  canConnect?: boolean;
  onSelect: () => void;
  onStartConnection: () => void;
  onConnect: () => void;
  onDrag: (id: string, position: { x: number; y: number }) => void;
  onDelete: () => void;
  onUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
  onDuplicate?: () => void;
}

export const ComponentNode = React.memo<ComponentNodeProps>(({
  component,
  isSelected,
  isConnecting = false,
  canConnect = false,
  onSelect,
  onStartConnection,
  onConnect,
  onDrag,
  onDelete,
  onUpdate,
  onDuplicate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const { getTemplateByType } = useComponentTemplates();

  const dragHandlers = useMemo(() => ({
    componentId: component.id,
    onDrag,
    onSelect
  }), [component.id, onDrag, onSelect]);

  const {
    isDragging,
    nodeRef,
    handleMouseDown
  } = useComponentDrag(dragHandlers);

  const template = useMemo(() => {
    const foundTemplate = getTemplateByType(component.type);
    
    // If template not found, create a fallback template
    if (!foundTemplate) {
      console.warn(`Template not found for component type: ${component.type}, creating fallback`);
      return {
        type: component.type,
        icon: '🔧',
        label: component.data.title || 'Unknown Component',
        color: '#6B7280',
        category: 'custom',
        defaultProps: component.data
      };
    }
    
    return foundTemplate;
  }, [component.type, component.data, getTemplateByType]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  }, [onDelete]);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleDuplicateClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate?.();
  }, [onDuplicate]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleUpdateComponent = useCallback((updates: Partial<FunnelComponent>) => {
    onUpdate(component.id, updates);
  }, [component.id, onUpdate]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Se pode conectar, conecta em vez de selecionar
    if (canConnect) {
      onConnect();
      return;
    }
    
    // Não seleciona se clicou em botões
    if ((e.target as Element).closest('button')) {
      return;
    }
    
    console.log('Componente clicado:', component.id);
    onSelect();
  }, [onSelect, onConnect, canConnect, component.id]);

  const handleConnectionClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onStartConnection();
  }, [onStartConnection]);

  const containerStyle = useMemo(() => ({
    left: component.position.x,
    top: component.position.y,
    zIndex: isSelected ? 1000 : isDragging ? 999 : 1
  }), [component.position.x, component.position.y, isSelected, isDragging]);

  const containerClassName = useMemo(() => {
    let classes = `absolute select-none transition-all duration-200 ${
      isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab'
    }`;
    
    if (canConnect) {
      classes += ' ring-4 ring-green-500 ring-opacity-70 animate-pulse cursor-pointer';
    } else if (isSelected) {
      classes += ' ring-2 ring-blue-400 ring-opacity-50';
    }
    
    return classes;
  }, [isDragging, isSelected, canConnect]);

  return (
    <>
      <div
        ref={nodeRef}
        className={containerClassName}
        style={containerStyle}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
      >
        <ComponentNodeCard
          component={component}
          template={template}
          isSelected={isSelected}
          isConnecting={isConnecting}
          canConnect={canConnect}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onConnectionClick={handleConnectionClick}
          onDuplicateClick={handleDuplicateClick}
        />
      </div>

      {/* Botões externos abaixo do componente */}
      {isSelected && !isConnecting && (
        <div 
          className="absolute flex items-center justify-center space-x-3"
          style={{
            left: component.position.x + 96 - 40, // Centraliza os botões (96 é metade da largura do card)
            top: component.position.y + 180, // 20px abaixo do card
            zIndex: 1001
          }}
        >
          <button
            onClick={handleDuplicateClick}
            className="w-8 h-8 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
            title="Duplicar componente"
          >
            <Copy className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleConnectionClick}
            className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
            title="Conectar com outro componente"
          >
            <Link className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editor Modal */}
      <ComponentEditor
        component={component}
        onUpdate={handleUpdateComponent}
        onClose={() => setIsEditing(false)}
        isOpen={isEditing}
      />
    </>
  );
});

ComponentNode.displayName = 'ComponentNode';
