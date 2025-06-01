
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
    
    console.log('Drop event triggered');
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) {
      console.error('Canvas rect not found');
      return;
    }

    // Try to get template data from drag event
    let templateData = '';
    try {
      templateData = e.dataTransfer.getData('application/json');
      console.log('Template data from dataTransfer:', templateData);
    } catch (error) {
      console.error('Error getting data from dataTransfer:', error);
    }

    // If no JSON data, try getting text data
    if (!templateData) {
      try {
        templateData = e.dataTransfer.getData('text/plain');
        console.log('Template data from text/plain:', templateData);
      } catch (error) {
        console.error('Error getting text data from dataTransfer:', error);
      }
    }

    if (!templateData) {
      console.error('No template data found in drop event');
      console.log('Available data types:', e.dataTransfer.types);
      return;
    }

    try {
      const template: ComponentTemplate = JSON.parse(templateData);
      console.log('Dropping template on canvas:', template);
      
      // Calcula a posição correta considerando zoom e pan
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      
      // Gera um ID único para o componente
      const componentId = `${template.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const newComponent: FunnelComponent = {
        id: componentId,
        type: template.type,
        position: { x: Math.max(0, x - 80), y: Math.max(0, y - 40) },
        data: { 
          ...template.defaultData,
          title: template.defaultData?.title || template.label,
          description: template.defaultData?.description || '',
          status: template.defaultData?.status || 'draft',
          properties: template.defaultData?.properties || {}
        },
        connections: []
      };

      console.log('Creating new component:', newComponent);
      onComponentAdd(newComponent);
    } catch (error) {
      console.error('Error parsing template data:', error);
      console.log('Raw template data:', templateData);
    }
  }, [onComponentAdd, pan, zoom]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragOver) {
      setIsDragOver(true);
    }
  }, [isDragOver]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent, canvasRef: React.RefObject<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Só remove o isDragOver se realmente saiu do canvas
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
