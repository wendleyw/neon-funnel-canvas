
import React, { useState, useMemo } from 'react';
import { FunnelComponent } from '../../../types/funnel';
import { useComponentTemplates } from '../../templates/hooks/useComponentTemplates';
import { useComponentDrag } from '../hooks/useComponentDrag';
import { useComponentNodeHandlers } from '../hooks/useComponentNodeHandlers';
import { ComponentEditor } from '../../editor/components/ComponentEditor';
import { ComponentNodeCardSimple } from './ComponentNodeCardSimple';
import { ComponentNodeSpecialRenderer } from './ComponentNodeSpecialRenderer';
import { ComponentNodeActions } from './ComponentNodeActions';

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
  const { templates: componentTemplates } = useComponentTemplates();

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
    const foundTemplate = componentTemplates.find(t => t.type === component.type);
    
    if (!foundTemplate) {
      return {
        id: `custom-${component.type}`,
        name: component.data.title || 'Unknown',
        type: component.type,
        category: 'custom',
        icon: '🔧',
        description: component.data.description || 'Custom component',
        data: component.data,
      };
    }
    
    return foundTemplate;
  }, [component.type, component.data, componentTemplates]);

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
    left: component.position.x + 5000,
    top: component.position.y + 5000,
    zIndex: isDragging ? 9999 : isSelected ? 1000 : 1,
    willChange: isDragging ? 'transform' : 'auto',
    transform: isDragging ? 'translateZ(0)' : 'none'
  }), [component.position.x, component.position.y, isSelected, isDragging]);

  const containerClassName = useMemo(() => {
    let classes = `absolute select-none component-node ${
      isDragging ? 'cursor-grabbing dragging' : 'cursor-grab'
    }`;
    
    if (!isDragging) {
      classes += ' transition-all duration-200';
    }
    
    if (isDragging) {
      classes += ' scale-105';
    }
    
    if (canConnect) {
      classes += ' ring-4 ring-green-500 ring-opacity-70 animate-pulse cursor-pointer';
    } else if (isSelected && !isDragging) {
      classes += ' selection-ring ring-2 ring-blue-400 ring-opacity-50';
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
        <ComponentNodeCardSimple
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
        onDeleteClick={handlers.handleDeleteClick}
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
