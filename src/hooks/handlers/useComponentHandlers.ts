
import { useCallback } from 'react';
import { FunnelComponent, Connection } from '../../types/funnel';

interface UseComponentHandlersProps {
  setProject: React.Dispatch<React.SetStateAction<any>>;
}

export const useComponentHandlers = ({ setProject }: UseComponentHandlersProps) => {
  const handleComponentAdd = useCallback((component: FunnelComponent) => {
    setProject(prev => ({
      ...prev,
      components: [...prev.components, component],
      updatedAt: new Date().toISOString()
    }));
  }, [setProject]);

  const handleComponentUpdate = useCallback((id: string, updates: Partial<FunnelComponent>) => {
    setProject(prev => ({
      ...prev,
      components: prev.components.map(component =>
        component.id === id ? { ...component, ...updates } : component
      ),
      updatedAt: new Date().toISOString()
    }));
  }, [setProject]);

  const handleComponentDelete = useCallback((id: string) => {
    setProject(prev => {
      const updatedComponents = prev.components.filter(component => component.id !== id);
      const updatedConnections = prev.connections.filter(connection =>
        connection.from !== id && connection.to !== id
      );

      return {
        ...prev,
        components: updatedComponents,
        connections: updatedConnections,
        updatedAt: new Date().toISOString()
      };
    });
  }, [setProject]);

  const handleAddCompleteTemplate = useCallback((newComponents: FunnelComponent[], newConnections: Connection[]) => {
    setProject(prev => ({
      ...prev,
      components: [...prev.components, ...newComponents],
      connections: [...prev.connections, ...newConnections],
      updatedAt: new Date().toISOString()
    }));
  }, [setProject]);

  return {
    handleComponentAdd,
    handleComponentUpdate,
    handleComponentDelete,
    handleAddCompleteTemplate
  };
};
