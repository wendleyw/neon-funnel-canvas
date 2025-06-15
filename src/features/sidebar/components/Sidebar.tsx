
import React, { useCallback, useState } from 'react';
import { ComponentTemplate } from '../types/funnel';
import { DrawingShape } from '../types/drawing';
import { ErrorBoundary } from './ErrorBoundary';
import { IconSidebar } from './ModernSidebar/IconSidebar';
import { FunnelComponent, Connection } from '../types/funnel';
import { error, debug } from '@/lib/logger';

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
  
  // FIXED: Handle multiple parameter patterns - some components pass (e, template), others just (template)
  const handleDragStartAdapter = useCallback((eventOrTemplate: any, maybeTemplate?: ComponentTemplate) => {
    let template: ComponentTemplate;
    
    // Determine which parameter is the template
    if (maybeTemplate) {
      // Called with (e, template) pattern
      template = maybeTemplate;
    } else if (eventOrTemplate && typeof eventOrTemplate === 'object' && eventOrTemplate.type && eventOrTemplate.label) {
      // Called with (template) pattern
      template = eventOrTemplate;
    } else {
      error('[Sidebar] No valid template found in drag start parameters:', { eventOrTemplate, maybeTemplate });
      return;
    }
    
    if (!template || !template.label) {
      error('[Sidebar] Template is invalid or undefined:', template);
      return;
    }
    
    debug('[Sidebar] Drag start adapter called with template:', template.label);
    
    try {
      // Just pass the template directly - no synthetic events needed
      onDragStart(template);
    } catch (err) {
      error('[Sidebar] Error in handleDragStartAdapter:', err);
    }
  }, [onDragStart]);

  return (
    <ErrorBoundary>
      <IconSidebar
        onDragStart={handleDragStartAdapter}
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
