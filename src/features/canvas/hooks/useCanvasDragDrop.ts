import { useCallback } from 'react';
import { FunnelComponent, ComponentTemplate } from '../../../types/funnel';

interface UseCanvasDragDropProps {
  onComponentAdd: (component: FunnelComponent) => void;
  setIsDragActive: (isActive: boolean) => void;
}

export const useCanvasDragDrop = ({
  onComponentAdd,
  setIsDragActive
}: UseCanvasDragDropProps) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  
    if (e.dataTransfer.types.includes('application/json') || e.dataTransfer.types.includes('text/plain')) {
      setIsDragActive(true);
      e.dataTransfer.dropEffect = 'copy';
    } else {
      setIsDragActive(false);
      e.dataTransfer.dropEffect = 'none';
    }
  }, [setIsDragActive]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    try {
      const templateData = e.dataTransfer.getData('application/json');
      const template = JSON.parse(templateData) as ComponentTemplate;
      
      const canvasRect = (e.target as HTMLElement).getBoundingClientRect();
      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;

      handleComponentDrop(template, { x, y });
    } catch (error) {
      console.error('Error handling drop:', error);
      // Fallback for mobile/touch devices
      const template = (window as any).__dragTemplate as ComponentTemplate;
      if (template) {
        const canvasRect = (e.target as HTMLElement).getBoundingClientRect();
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;

        handleComponentDrop(template, { x, y });
        (window as any).__dragTemplate = null; // Clear global template
      } else {
        console.warn('No template found in fallback.');
      }
    }
  }, [setIsDragActive, handleComponentDrop]);

  const handleComponentDrop = useCallback((template: ComponentTemplate, position: { x: number; y: number }) => {
    const newComponent: FunnelComponent = {
      id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: template.type as FunnelComponent['type'],
      position,
      data: {
        title: template.data?.title || template.name || 'New Component',
        description: template.data?.description || template.description || '',
        image: template.data?.image || '',
        url: template.data?.url || '',
        status: (template.data?.status as any) || 'draft',
        properties: template.data?.properties || {}
      }
    };

    onComponentAdd(newComponent);
  }, [onComponentAdd]);

  return {
    handleDragOver,
    handleDrop
  };
};
