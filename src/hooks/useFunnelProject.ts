import { useState, useCallback } from 'react';
import { FunnelProject, FunnelComponent, Connection } from '../types/funnel';

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

  const saveProject = useCallback(() => {
    const projectData = JSON.stringify(project, null, 2);
    localStorage.setItem(`funnel-project-${project.id}`, projectData);
    
    const existingProjects = JSON.parse(localStorage.getItem('funnel-projects') || '[]');
    const updatedProjects = existingProjects.filter((p: FunnelProject) => p.id !== project.id);
    updatedProjects.push({
      id: project.id,
      name: project.name,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    });
    localStorage.setItem('funnel-projects', JSON.stringify(updatedProjects));
    
    console.log('Project saved successfully!');
  }, [project]);

  const loadProject = useCallback((projectId: string) => {
    const projectData = localStorage.getItem(`funnel-project-${projectId}`);
    if (projectData) {
      setProject(JSON.parse(projectData));
      console.log('Project loaded successfully!');
    }
  }, []);

  const exportProject = useCallback(() => {
    const dataStr = JSON.stringify(project, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
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

  return {
    project,
    addComponent,
    updateComponent,
    deleteComponent,
    addConnection,
    deleteConnection,
    saveProject,
    loadProject,
    exportProject,
    clearProject,
    updateProjectName
  };
};
