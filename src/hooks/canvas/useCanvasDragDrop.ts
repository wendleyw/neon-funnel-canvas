
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
    // Only set isDragOver to false if we're leaving the canvas container
    if (!canvasRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, [canvasRef]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const templateData = e.dataTransfer.getData('application/json');
      if (!templateData) return;
      
      const template: ComponentTemplate = JSON.parse(templateData);
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      
      if (!canvasRect) return;

      // Calcular posição considerando zoom e pan
      const x = (e.clientX - canvasRect.left - panOffset.x) / scale;
      const y = (e.clientY - canvasRect.top - panOffset.y) / scale;

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

      onAddComponent(newComponent);
      console.log('Component added:', newComponent);
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
