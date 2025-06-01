
import { useCallback, useState } from 'react';
import { ComponentTemplate, FunnelComponent } from '../../types/funnel';

interface UseCanvasDragDropOptions {
  onComponentAdd: (component: FunnelComponent) => void;
  pan: { x: number; y: number };
  zoom: number;
}

export const useCanvasDragDrop = ({ onComponentAdd, pan, zoom }: UseCanvasDragDropOptions) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent, canvasRef: React.RefObject<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const templateData = e.dataTransfer.getData('application/json');
    if (!templateData) return;

    try {
      const template: ComponentTemplate = JSON.parse(templateData);
      
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      
      const newComponent: FunnelComponent = {
        id: `${template.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: template.type,
        position: { x: Math.max(0, x - 80), y: Math.max(0, y - 40) },
        data: { ...template.defaultData },
        connections: []
      };

      onComponentAdd(newComponent);
    } catch (error) {
      console.error('Error parsing template data:', error);
    }
  }, [onComponentAdd, pan, zoom]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent, canvasRef: React.RefObject<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const isInsideCanvas = e.clientX >= rect.left && 
                           e.clientX <= rect.right && 
                           e.clientY >= rect.top && 
                           e.clientY <= rect.bottom;
      if (!isInsideCanvas) {
        setIsDragOver(false);
      }
    }
  }, []);

  return {
    isDragOver,
    handleDrop,
    handleDragOver,
    handleDragEnter,
    handleDragLeave
  };
};
