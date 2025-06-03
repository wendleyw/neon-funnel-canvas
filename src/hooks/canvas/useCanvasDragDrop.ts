import { useCallback, useState } from 'react';
import { ComponentTemplate, FunnelComponent } from '../../types/funnel';

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
    
    console.log('[CanvasDragDrop] Drop event triggered');
    
    try {
      const templateData = e.dataTransfer.getData('application/json');
      
      if (!templateData) {
        console.warn('[CanvasDragDrop] No template data found');
        return;
      }
      
      const template: ComponentTemplate = JSON.parse(templateData);
      console.log('[CanvasDragDrop] Template:', template.label);
      
      const canvasContainer = canvasRef.current;
      if (!canvasContainer) {
        console.error('[CanvasDragDrop] Canvas container not found');
        return;
      }
      
      const canvasRect = canvasContainer.getBoundingClientRect();
      
      // Calculate screen position relative to canvas
      const screenX = e.clientX - canvasRect.left;
      const screenY = e.clientY - canvasRect.top;
      
      // Simple coordinate conversion for the infinite canvas
      // The canvas viewport has transform: translate(panX, panY) scale(scale)
      // To get world coordinates: (screen - pan) / scale
      const worldX = (screenX - panOffset.x) / scale;
      const worldY = (screenY - panOffset.y) / scale;

      console.log('[CanvasDragDrop] Position:', { 
        screen: { x: screenX, y: screenY },
        world: { x: worldX, y: worldY },
        pan: panOffset,
        scale 
      });

      const newComponent: FunnelComponent = {
        id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: template.type as FunnelComponent['type'],
        position: { x: worldX, y: worldY },
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

      console.log('[CanvasDragDrop] Creating component at:', newComponent.position);
      onAddComponent(newComponent);
    } catch (error) {
      console.error('[CanvasDragDrop] Error:', error);
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
