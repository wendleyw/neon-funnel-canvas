import React from 'react';
import { FunnelComponent } from '../../types/funnel';
import { ComponentEditor } from '../ComponentEditor';
import { NoteComponent } from '../VisualHelpers/NoteComponent';
import { ArrowComponent } from '../VisualHelpers/ArrowComponent';
import { FrameComponent } from '../VisualHelpers/FrameComponent';
import { DiagramComponent } from '../VisualHelpers/DiagramComponent';

interface ComponentNodeSpecialRendererProps {
  component: FunnelComponent;
  isSelected: boolean;
  isEditing: boolean;
  containerClassName: string;
  containerStyle: React.CSSProperties;
  nodeRef: React.RefObject<HTMLDivElement>;
  onUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
  onDelete: () => void;
  onSelect: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
  onUpdateComponent: (updates: Partial<FunnelComponent>) => void;
  onCloseEditor: () => void;
}

export const ComponentNodeSpecialRenderer: React.FC<ComponentNodeSpecialRendererProps> = ({
  component,
  isSelected,
  isEditing,
  containerClassName,
  containerStyle,
  nodeRef,
  onUpdate,
  onDelete,
  onSelect,
  onMouseDown,
  onDoubleClick,
  onUpdateComponent,
  onCloseEditor
}) => {
  // FIRST: Check if it's a diagram shape (takes priority over component type)
  if (component.data.properties?.isDiagramShape) {
    return (
      <>
        <div
          ref={nodeRef}
          className={containerClassName}
          style={containerStyle}
          onMouseDown={onMouseDown}
          onDoubleClick={onDoubleClick}
        >
          <DiagramComponent
            component={component}
            isSelected={isSelected}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onSelect={onSelect}
          />
        </div>
        
        <ComponentEditor
          component={component}
          onUpdate={onUpdateComponent}
          onClose={onCloseEditor}
          isOpen={isEditing}
        />
      </>
    );
  }

  // SECOND: Render regular note component (for user-created notes)
  if (component.type === 'note') {
    return (
      <>
        <div
          ref={nodeRef}
          className={containerClassName}
          style={containerStyle}
          onMouseDown={onMouseDown}
          onDoubleClick={onDoubleClick}
        >
          <NoteComponent
            component={component}
            isSelected={isSelected}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onSelect={onSelect}
          />
        </div>
        
        <ComponentEditor
          component={component}
          onUpdate={onUpdateComponent}
          onClose={onCloseEditor}
          isOpen={isEditing}
        />
      </>
    );
  }

  // Render arrow component
  if (component.type === 'arrow') {
    return (
      <>
        <div
          ref={nodeRef}
          className={containerClassName}
          style={containerStyle}
          onMouseDown={onMouseDown}
          onDoubleClick={onDoubleClick}
        >
          <ArrowComponent
            component={component}
            isSelected={isSelected}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onSelect={onSelect}
          />
        </div>
        
        <ComponentEditor
          component={component}
          onUpdate={onUpdateComponent}
          onClose={onCloseEditor}
          isOpen={isEditing}
        />
      </>
    );
  }

  // Render frame component
  if (component.type === 'frame') {
    return (
      <>
        <div
          ref={nodeRef}
          className={containerClassName}
          style={containerStyle}
          onMouseDown={onMouseDown}
          onDoubleClick={onDoubleClick}
        >
          <FrameComponent
            component={component}
            isSelected={isSelected}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onSelect={onSelect}
          />
        </div>
        
        <ComponentEditor
          component={component}
          onUpdate={onUpdateComponent}
          onClose={onCloseEditor}
          isOpen={isEditing}
        />
      </>
    );
  }

  return null;
};
