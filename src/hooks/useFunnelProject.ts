import { useState, useCallback } from 'react';
import { FunnelProject, FunnelComponent, Connection } from '../types/funnel';
import { toast } from 'sonner';

export const useFunnelProject = () => {
  const [project, setProject] = useState<FunnelProject>({
    id: 'project-' + Date.now(),
    name: 'Untitled Funnel',
    components: [],
    connections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const addComponent = useCallback((component: FunnelComponent) => {
    setProject(prev => ({
      ...prev,
      components: [...prev.components, component],
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const updateComponent = useCallback((id: string, updates: Partial<FunnelComponent>) => {
    setProject(prev => ({
      ...prev,
      components: prev.components.map(comp => 
        comp.id === id ? { ...comp, ...updates } : comp
      ),
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const deleteComponent = useCallback((id: string) => {
    setProject(prev => ({
      ...prev,
      components: prev.components.filter(comp => comp.id !== id),
      connections: prev.connections.filter(conn => conn.from !== id && conn.to !== id),
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const addConnection = useCallback((connection: Connection) => {
    setProject(prev => ({
      ...prev,
      connections: [...prev.connections, connection],
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const deleteConnection = useCallback((connectionId: string) => {
    setProject(prev => ({
      ...prev,
      connections: prev.connections.filter(conn => conn.id !== connectionId),
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const exportProject = useCallback(() => {
    try {
      const dataStr = JSON.stringify(project, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      toast.success('Project exported successfully!');
    } catch (error) {
      console.error('Error exporting project:', error);
      toast.error('Error exporting project');
    }
  }, [project]);

  const clearProject = useCallback(() => {
    setProject({
      id: 'project-' + Date.now(),
      name: 'Untitled Funnel',
      components: [],
      connections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }, []);

  const updateProjectName = useCallback((name: string) => {
    setProject(prev => ({
      ...prev,
      name,
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const setProjectData = useCallback((projectData: FunnelProject) => {
    setProject(projectData);
  }, []);

  return {
    project,
    addComponent,
    updateComponent,
    deleteComponent,
    addConnection,
    deleteConnection,
    exportProject,
    clearProject,
    updateProjectName,
    setProjectData
  };
};
