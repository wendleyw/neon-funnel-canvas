import React, { useCallback, useState } from 'react';
import { ComponentTemplate } from '../types/funnel';
import { DrawingShape } from '../types/drawing';
import { ErrorBoundary } from './ErrorBoundary';
import { IconSidebar } from './ModernSidebar/IconSidebar';
import { FunnelComponent, Connection } from '../types/funnel';

interface SidebarProps {
  onDragStart: (template: ComponentTemplate) => void;
  onAddCompleteTemplate?: (components: FunnelComponent[], connections: Connection[]) => void;
  onShapeAdd?: (shape: DrawingShape) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
  componentCount?: number;
  connectionCount?: number;
  onPanelStateChange?: (isExpanded: boolean) => void;
}

export const Sidebar = React.memo<SidebarProps>(({ 
  onDragStart, 
  onAddCompleteTemplate,
  onShapeAdd,
  onTemplateClick,
  componentCount = 0,
  connectionCount = 0,
  onPanelStateChange
}) => {
  return (
    <ErrorBoundary>
      <IconSidebar
        onDragStart={onDragStart}
        onAddCompleteTemplate={onAddCompleteTemplate}
        onShapeAdd={onShapeAdd}
        onTemplateClick={onTemplateClick}
        componentCount={componentCount}
        connectionCount={connectionCount}
        onPanelStateChange={onPanelStateChange}
      />
    </ErrorBoundary>
  );
});

Sidebar.displayName = 'Sidebar';
