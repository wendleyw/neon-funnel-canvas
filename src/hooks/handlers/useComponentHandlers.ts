
import { useCallback } from 'react';
import { FunnelComponent, Connection } from '../../types/funnel';

interface UseComponentHandlersProps {
  setProject: React.Dispatch<React.SetStateAction<any>>;
}

export const useComponentHandlers = ({ setProject }: UseComponentHandlersProps) => {
  const handleComponentAdd = useCallback((component: FunnelComponent) => {
    console.log('Adding component:', component);
    setProject(prev => {
      const updatedProject = {
        ...prev,
        components: [...prev.components, component],
        updatedAt: new Date().toISOString()
      };
      console.log('Project after component add:', {
        componentsCount: updatedProject.components.length,
        newComponent: component.data.title
      });
      return updatedProject;
    });
  }, [setProject]);

  const handleComponentUpdate = useCallback((id: string, updates: Partial<FunnelComponent>) => {
    console.log('Updating component:', id, updates);
    setProject(prev => {
      const updatedProject = {
        ...prev,
        components: prev.components.map(component =>
          component.id === id ? { ...component, ...updates } : component
        ),
        updatedAt: new Date().toISOString()
      };
      console.log('Project after component update:', {
        componentsCount: updatedProject.components.length,
        updatedComponent: id
      });
      return updatedProject;
    });
  }, [setProject]);

  const handleComponentDelete = useCallback((id: string) => {
    console.log('Deleting component:', id);
    setProject(prev => {
      const updatedComponents = prev.components.filter(component => component.id !== id);
      const updatedConnections = prev.connections.filter(connection =>
        connection.from !== id && connection.to !== id
      );

      const updatedProject = {
        ...prev,
        components: updatedComponents,
        connections: updatedConnections,
        updatedAt: new Date().toISOString()
      };
      
      console.log('Project after component delete:', {
        componentsCount: updatedProject.components.length,
        connectionsCount: updatedProject.connections.length,
        deletedComponent: id
      });
      
      return updatedProject;
    });
  }, [setProject]);

  const handleAddCompleteTemplate = useCallback((newComponents: FunnelComponent[], newConnections: Connection[]) => {
    console.log('Adding complete template:', { 
      componentsCount: newComponents.length, 
      connectionsCount: newConnections.length 
    });
    setProject(prev => {
      const updatedProject = {
        ...prev,
        components: [...prev.components, ...newComponents],
        connections: [...prev.connections, ...newConnections],
        updatedAt: new Date().toISOString()
      };
      console.log('Project after template add:', {
        totalComponentsCount: updatedProject.components.length,
        totalConnectionsCount: updatedProject.connections.length
      });
      return updatedProject;
    });
  }, [setProject]);

  return {
    handleComponentAdd,
    handleComponentUpdate,
    handleComponentDelete,
    handleAddCompleteTemplate
  };
};
