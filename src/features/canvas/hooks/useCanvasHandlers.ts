import { useCallback } from 'react';
import { FunnelComponent, ComponentTemplate, Connection } from '../../../types/funnel';

interface UseCanvasHandlersProps {
  components: FunnelComponent[];
  connections: Connection[];
  onComponentAdd: (component: FunnelComponent) => void;
  onComponentUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
  onComponentDelete: (id: string) => void;
  onConnectionAdd: (connection: Connection) => void;
  onConnectionDelete: (connectionId: string) => void;
  onConnectionUpdate: (connectionId: string, updates: Partial<Connection>) => void;
}

export const useCanvasHandlers = ({
  components,
  connections,
  onComponentAdd,
  onComponentUpdate,
  onComponentDelete,
  onConnectionAdd,
  onConnectionDelete,
  onConnectionUpdate
}: UseCanvasHandlersProps) => {

  const handleComponentUpdate = useCallback((id: string, updates: Partial<FunnelComponent>) => {
    onComponentUpdate(id, updates);
  }, [onComponentUpdate]);

  const handleComponentDelete = useCallback((id: string) => {
    onComponentDelete(id);
  }, [onComponentDelete]);

  const handleConnectionAdd = useCallback((connection: Connection) => {
    onConnectionAdd(connection);
  }, [onConnectionAdd]);

  const handleConnectionDelete = useCallback((connectionId: string) => {
    onConnectionDelete(connectionId);
  }, [onConnectionDelete]);

  const handleConnectionUpdate = useCallback((connectionId: string, updates: Partial<Connection>) => {
    onConnectionUpdate(connectionId, updates);
  }, [onConnectionUpdate]);

  const handleTemplateAdd = useCallback((template: ComponentTemplate, position?: { x: number; y: number }) => {
    const newComponent: FunnelComponent = {
      id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: template.type as FunnelComponent['type'],
      position: position || { x: 200, y: 200 },
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
    handleComponentUpdate,
    handleComponentDelete,
    handleConnectionAdd,
    handleConnectionDelete,
    handleConnectionUpdate,
    handleTemplateAdd
  };
};
