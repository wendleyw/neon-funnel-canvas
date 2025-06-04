import { useCallback } from 'react';
import { FunnelComponent, ComponentTemplate, FunnelProject } from '../../types/funnel';

export const useComponentHandlers = (
  project: FunnelProject,
  setProject: (project: FunnelProject) => void
) => {
  const handleComponentAdd = useCallback((component: FunnelComponent) => {
    const updatedProject = {
      ...project,
      components: [...project.components, component],
    };
    setProject(updatedProject);
  }, [project, setProject]);

  const handleComponentUpdate = useCallback((id: string, updates: Partial<FunnelComponent>) => {
    const updatedProject = {
      ...project,
      components: project.components.map(comp =>
        comp.id === id ? { ...comp, ...updates } : comp
      ),
    };
    setProject(updatedProject);
  }, [project, setProject]);

  const handleComponentDelete = useCallback((id: string) => {
    const updatedProject = {
      ...project,
      components: project.components.filter(comp => comp.id !== id),
      connections: project.connections.filter(conn => 
        conn.from !== id && conn.to !== id
      ),
    };
    setProject(updatedProject);
  }, [project, setProject]);

  const handleCompleteTemplateAdd = useCallback((template: ComponentTemplate & { components: FunnelComponent[] }) => {
    const updatedProject = {
      ...project,
      components: [...project.components, ...template.components],
    };
    setProject(updatedProject);
  }, [project, setProject]);

  return {
    handleComponentAdd,
    handleComponentUpdate,
    handleComponentDelete,
    handleCompleteTemplateAdd,
  };
};
