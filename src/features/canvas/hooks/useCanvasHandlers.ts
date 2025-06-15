import { useCallback, useState } from 'react';
import { useReactFlow } from 'reactflow';
import { toast } from 'sonner';
import { ComponentTemplate, FunnelComponent } from '../../../types/funnel';
import { error as logError, warn } from '@/lib/logger';

interface UseCanvasHandlersProps {
  onComponentAdd: (component: FunnelComponent) => void;
  setHighlightedNodeId: (id: string | null) => void;
  components: FunnelComponent[];
}

interface UseCanvasHandlersReturn {
  isDragOver: boolean;
  onDragOver: (event: React.DragEvent) => void;
  onDragEnter: (event: React.DragEvent) => void;
  onDragLeave: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
}

/**
 * Custom hook for handling canvas drag & drop operations
 * Extracted from ReactFlowCanvas for better modularity
 */
export const useCanvasHandlers = ({
  onComponentAdd,
  setHighlightedNodeId,
  components
}: UseCanvasHandlersProps): UseCanvasHandlersReturn => {
  const reactFlowInstance = useReactFlow();
  const [isDragOver, setIsDragOver] = useState(false);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  }, []);

  const onDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    
    // Only set dragOver to false when actually leaving the component
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    try {
      const templateData = event.dataTransfer.getData('application/json');
      
      if (!templateData) {
        toast.error('Erro: Nenhum componente encontrado no drag. Verifique se você está arrastando de um item da sidebar.');
        return;
      }
      
      const template: ComponentTemplate = JSON.parse(templateData);

      // Validate template
      if (!template.type || !template.label) {
        logError('❌ Template inválido:', template);
        toast.error('Template inválido: faltam campos obrigatórios');
        return;
      }

      // Calculate position
      const viewport = reactFlowInstance.getViewport();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      
      const viewportCenterX = (-viewport.x + reactFlowBounds.width / 2) / viewport.zoom;
      const viewportCenterY = (-viewport.y + reactFlowBounds.height / 2) / viewport.zoom;
      
      const randomOffset = () => (Math.random() - 0.5) * 50; // ±25px offset
      
      const position = {
        x: viewportCenterX + randomOffset(),
        y: viewportCenterY + randomOffset()
      };

      // Create new component
      const newComponent: FunnelComponent = {
        id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: template.type as FunnelComponent['type'],
        position: position,
        connections: [],
        data: {
          title: template.defaultProps?.title || template.label,
          description: template.defaultProps?.description || '',
          image: template.defaultProps?.image || '',
          url: template.defaultProps?.url || '',
          status: template.defaultProps?.status || 'draft',
          properties: template.defaultProps?.properties || {}
        }
      };

      onComponentAdd(newComponent);
      
      // Enhanced visibility strategies
      setTimeout(() => {
        try {
          const currentNodes = reactFlowInstance.getNodes();
          const newNode = currentNodes.find(n => n.id === newComponent.id);
          
          if (newNode) {
            reactFlowInstance.setCenter(newNode.position.x, newNode.position.y, { 
              zoom: 1.2, 
              duration: 800 
            });
          } else {
            reactFlowInstance.setCenter(position.x, position.y, { zoom: 1.2, duration: 800 });
          }
        } catch (err) {
          warn('Failed to center on new component:', err);
        }
      }, 200);

      setTimeout(() => {
        try {
          const currentNodes = reactFlowInstance.getNodes();
          
          if (currentNodes.length > 0) {
            reactFlowInstance.fitView({ 
              padding: 0.15, 
              includeHiddenNodes: true,
              duration: 1000,
              maxZoom: 1.5,
              minZoom: 0.1
            });
          }
        } catch (err) {
          warn('Failed to fit view:', err);
        }
      }, 800);

      setTimeout(() => {
        try {
          reactFlowInstance.setCenter(position.x, position.y, { 
            zoom: 1.0,
            duration: 600 
          });
        } catch (err) {
          warn('Failed to force center:', err);
        }
      }, 1500);

      // Visual highlight
      setHighlightedNodeId(newComponent.id);
      setTimeout(() => {
        setHighlightedNodeId(null);
      }, 5000);

      // Success notification with action
      const componentDistance = Math.sqrt(
        Math.pow(position.x - viewportCenterX, 2) + Math.pow(position.y - viewportCenterY, 2)
      );
      
      toast.success(`✅ ${template.label} adicionado!`, {
        description: `Posição: (${Math.round(position.x)}, ${Math.round(position.y)}) - ${components.length + 1} componentes total - Distância do centro: ${Math.round(componentDistance)}px`,
        duration: 10000,
        action: {
          label: "🎯 Focar Agora",
          onClick: () => {
            reactFlowInstance.setCenter(position.x, position.y, { 
              zoom: 1.8, 
              duration: 500 
            });
            setHighlightedNodeId(newComponent.id);
            setTimeout(() => setHighlightedNodeId(null), 5000);
          }
        }
      });
      
    } catch (err) {
      logError('❌ Error in drop handler:', err);
      toast.error('Erro ao adicionar componente. Verifique o console para mais detalhes.');
    }
  }, [reactFlowInstance, onComponentAdd, components.length, setHighlightedNodeId]);

  return {
    isDragOver,
    onDragOver,
    onDragEnter,
    onDragLeave,
    onDrop
  };
};
