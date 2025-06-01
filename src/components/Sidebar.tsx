
import React, { useCallback, useState } from 'react';
import { ComponentTemplate } from '../types/funnel';
import { ErrorBoundary } from './ErrorBoundary';
import { ModernSidebar } from './ModernSidebar/ModernSidebar';
import { FunnelComponent, Connection } from '../types/funnel';

interface SidebarProps {
  onDragStart: (template: ComponentTemplate) => void;
  onAddCompleteTemplate?: (components: FunnelComponent[], connections: Connection[]) => void;
  componentCount?: number;
  connectionCount?: number;
}

export const Sidebar = React.memo<SidebarProps>(({ 
  onDragStart, 
  onAddCompleteTemplate,
  componentCount = 0,
  connectionCount = 0 
}) => {
  return (
    <ErrorBoundary>
      <ModernSidebar
        onDragStart={onDragStart}
        onAddCompleteTemplate={onAddCompleteTemplate}
        componentCount={componentCount}
        connectionCount={connectionCount}
      />
    </ErrorBoundary>
  );
});

Sidebar.displayName = 'Sidebar';
