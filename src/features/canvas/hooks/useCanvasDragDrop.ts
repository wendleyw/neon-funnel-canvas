
import { useCallback, useState } from 'react';
import { ComponentTemplate, FunnelComponent } from '../../../types/funnel';
import { screenToCanvas, type ViewportInfo } from '../utils/canvasPositioning';
import { debug, warn, error } from '@/lib/logger';

interface UseCanvasDragDropProps {
  onAddComponent: (component: FunnelComponent) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
  scale: number;
  panOffset: { x: number; y: number };
}

export const useCanvasDragDrop = ({ 
  onAddComponent, 
  canvasRef, 
  scale, 
  panOffset 
}: UseCanvasDragDropProps) => {
  
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && (
      e.clientX < rect.left || 
      e.clientX > rect.right || 
      e.clientY < rect.top || 
      e.clientY > rect.bottom
    )) {
      setIsDragOver(false);
    }
  }, [canvasRef]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    debug('[CanvasDragDrop] Drop event triggered');
    
    try {
      const templateData = e.dataTransfer.getData('application/json');
      
      if (!templateData) {
        warn('[CanvasDragDrop] No template data found');
        return;
      }
      
      const template: ComponentTemplate = JSON.parse(templateData);
      debug('[CanvasDragDrop] Template:', template.label);
      
      // Debug mockup personalizado
      if (template.defaultProps?.image) {
        debug('🖼️ [CanvasDragDrop] Template has custom mockup:', {
          label: template.label,
          imageUrl: template.defaultProps.image,
          customMockup: template.defaultProps.properties?.customMockup
        });
      }
      
      const canvasContainer = canvasRef.current;
      if (!canvasContainer) {
        error('[CanvasDragDrop] Canvas container not found');
        return;
      }
      
      const canvasRect = canvasContainer.getBoundingClientRect();
      
      // Create viewport info for smart positioning
      const viewport: ViewportInfo = {
        x: panOffset.x,
        y: panOffset.y,
        zoom: scale,
        width: canvasRect.width,
        height: canvasRect.height
      };

      // Use smart positioning to convert drop coordinates to canvas coordinates
      const position = screenToCanvas(e.clientX, e.clientY, viewport, canvasRect);

      // Add small random offset to avoid exact overlapping when dropping multiple items
      position.x += (Math.random() - 0.5) * 20;
      position.y += (Math.random() - 0.5) * 20;

      debug('[CanvasDragDrop] Smart drop positioning:', { 
        screen: { x: e.clientX, y: e.clientY },
        canvas: position,
        viewport,
        canvasRect: { width: canvasRect.width, height: canvasRect.height }
      });

      const newComponent: FunnelComponent = {
        id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: template.type as FunnelComponent['type'],
        position: position,
        connections: [],
        data: {
          title: template.defaultProps.title || template.label,
          description: template.defaultProps.description || '',
          image: template.defaultProps.image || '',
          url: template.defaultProps.url || '',
          status: template.defaultProps.status || 'draft',
          properties: template.defaultProps.properties || {}
        }
      };

      debug('[CanvasDragDrop] Creating component at:', newComponent.position);
      onAddComponent(newComponent);
    } catch (err) {
      error('[CanvasDragDrop] Error:', err);
    }
  }, [onAddComponent, canvasRef, scale, panOffset]);

  return {
    isDragOver,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop
  };
};
