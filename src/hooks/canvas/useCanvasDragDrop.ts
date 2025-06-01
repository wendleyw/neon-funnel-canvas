
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
    console.log('Drag enter canvas');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Only set isDragOver to false if we're leaving the canvas container
    if (!canvasRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      console.log('Drag leave canvas');
    }
  }, [canvasRef]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    console.log('Drop event triggered on canvas');
    
    try {
      const templateData = e.dataTransfer.getData('application/json');
      console.log('Template data from drag:', templateData);
      
      if (!templateData) {
        console.warn('No template data found in drag event');
        return;
      }
      
      const template: ComponentTemplate = JSON.parse(templateData);
      console.log('Parsed template:', template);
      
      // Encontrar o canvas container (o elemento com a classe canvas-container)
      const canvasContainer = canvasRef.current?.querySelector('.canvas-container') as HTMLElement;
      const canvasRect = canvasContainer?.getBoundingClientRect() || canvasRef.current?.getBoundingClientRect();
      
      console.log('Canvas container:', canvasContainer);
      console.log('Canvas rect:', canvasRect);
      
      let x, y;
      
      if (canvasRect) {
        // Calcular posição considerando zoom e pan
        x = Math.max(0, (e.clientX - canvasRect.left - panOffset.x) / scale);
        y = Math.max(0, (e.clientY - canvasRect.top - panOffset.y) / scale);
      } else {
        // Fallback: usar posição relativa básica
        x = Math.max(0, (e.clientX - panOffset.x) / scale);
        y = Math.max(0, (e.clientY - panOffset.y) / scale);
        console.warn('Using fallback position calculation');
      }

      console.log('Calculated drop position:', { x, y });

      const newComponent: FunnelComponent = {
        id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: template.type,
        position: { x, y },
        connections: [],
        data: {
          title: template.defaultProps.title,
          description: template.defaultProps.description || '',
          image: template.defaultProps.image || '',
          url: template.defaultProps.url || '',
          status: template.defaultProps.status,
          properties: { ...template.defaultProps.properties }
        }
      };

      console.log('Creating new component:', newComponent);
      onAddComponent(newComponent);
    } catch (error) {
      console.error('Error adding component:', error);
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
