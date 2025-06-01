
import React, { useState, useMemo } from 'react';
import { FunnelComponent } from '../types/funnel';
import { useComponentTemplates } from '../hooks/useComponentTemplates';
import { useComponentDrag } from '../hooks/canvas/useComponentDrag';
import { useComponentNodeHandlers } from '../hooks/useComponentNodeHandlers';
import { ComponentEditor } from './ComponentEditor';
import { ComponentNodeCard } from './ComponentNode/ComponentNodeCard';
import { ComponentNodeSpecialRenderer } from './ComponentNode/ComponentNodeSpecialRenderer';
import { ComponentNodeActions } from './ComponentNode/ComponentNodeActions';

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
    
    if (!foundTemplate) {
      return {
        type: component.type,
        icon: '🔧',
        label: component.data.title || 'Unknown Component',
        color: '#6B7280',
        category: 'custom',
        defaultProps: component.data
      } as const;
    }
    
    return foundTemplate;
  }, [component.type, component.data, getTemplateByType]);

  const handlers = useComponentNodeHandlers({
    component,
    canConnect,
    onSelect,
    onConnect,
    onDelete,
    onStartConnection,
    onUpdate,
    onDuplicate,
    setIsEditing
  });

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

  // Render special components (note, arrow, frame)
  const specialComponent = ComponentNodeSpecialRenderer({
    component,
    isSelected,
    isEditing,
    containerClassName,
    containerStyle,
    nodeRef,
    onUpdate,
    onDelete,
    onSelect,
    onMouseDown: handleMouseDown,
    onDoubleClick: handlers.handleDoubleClick,
    onUpdateComponent: handlers.handleUpdateComponent,
    onCloseEditor: () => setIsEditing(false)
  });

  if (specialComponent) {
    return specialComponent;
  }

  // Default component rendering
  return (
    <>
      <div
        ref={nodeRef}
        className={containerClassName}
        style={containerStyle}
        onMouseDown={handleMouseDown}
        onDoubleClick={handlers.handleDoubleClick}
        onClick={handlers.handleClick}
      >
        <ComponentNodeCard
          component={component}
          template={template}
          isSelected={isSelected}
          isConnecting={isConnecting}
          canConnect={canConnect}
          onEditClick={handlers.handleEditClick}
          onDeleteClick={handlers.handleDeleteClick}
          onConnectionClick={handlers.handleConnectionClick}
          onDuplicateClick={handlers.handleDuplicateClick}
        />
      </div>

      <ComponentNodeActions
        component={component}
        isSelected={isSelected}
        isConnecting={isConnecting}
        onDuplicateClick={handlers.handleDuplicateClick}
        onConnectionClick={handlers.handleConnectionClick}
        onEditClick={handlers.handleEditClick}
      />

      <ComponentEditor
        component={component}
        onUpdate={handlers.handleUpdateComponent}
        onClose={() => setIsEditing(false)}
        isOpen={isEditing}
      />
    </>
  );
});

ComponentNode.displayName = 'ComponentNode';
