import { useCallback } from 'react';
import { FunnelComponent, ComponentTemplate } from '../../../types/funnel';

interface UseComponentHandlersProps {
  setProject: React.Dispatch<React.SetStateAction<any>>;
}

export const useComponentHandlers = ({ setProject }: UseComponentHandlersProps) => {
  const handleComponentAdd = useCallback((component: FunnelComponent) => {
    setProject(prev => {
      const updatedProject = {
        ...prev,
        components: [...(prev.components || []), component],
        updatedAt: new Date().toISOString()
      };
      return updatedProject;
    });
  }, [setProject]);

  const handleComponentUpdate = useCallback((id: string, updates: Partial<FunnelComponent>) => {
    setProject(prev => {
      const updatedProject = {
        ...prev,
        components: (prev.components || []).map(component =>
          component.id === id ? { ...component, ...updates } : component
        ),
        updatedAt: new Date().toISOString()
      };
      return updatedProject;
    });
  }, [setProject]);

  const handleComponentDelete = useCallback((id: string) => {
    setProject(prev => {
      const updatedComponents = (prev.components || []).filter(component => component.id !== id);
      const updatedConnections = (prev.connections || []).filter(connection =>
        connection.from !== id && connection.to !== id
      );

      const updatedProject = {
        ...prev,
        components: updatedComponents,
        connections: updatedConnections,
        updatedAt: new Date().toISOString()
      };
      
      return updatedProject;
    });
  }, [setProject]);

  const handleCompleteTemplateAdd = useCallback((template: ComponentTemplate & { components: FunnelComponent[] }) => {
    setProject(prev => {
      const updatedProject = {
        ...prev,
        components: [...(prev.components || []), ...template.components],
        updatedAt: new Date().toISOString()
      };
      return updatedProject;
    });
  }, [setProject]);

  return {
    handleComponentAdd,
    handleComponentUpdate,
    handleComponentDelete,
    handleCompleteTemplateAdd,
  };
};
