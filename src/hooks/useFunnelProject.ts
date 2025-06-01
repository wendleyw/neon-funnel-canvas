
import { useState, useCallback } from 'react';
import { FunnelProject, FunnelComponent, Connection } from '../types/funnel';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export const useFunnelProject = () => {
  const { user } = useAuth();
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

  const saveProject = useCallback((workspaceId?: string) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    try {
      // Salvar projeto completo com ID do usuário
      localStorage.setItem(`funnel-project-${project.id}-${user.id}`, JSON.stringify(project));
      
      // Se um workspace foi fornecido, salvar referência do projeto nele
      if (workspaceId) {
        const savedProjects = JSON.parse(localStorage.getItem(`funnel-projects-${user.id}`) || '[]');
        const workspaceProject = {
          id: project.id,
          name: project.name,
          workspaceId,
          componentsCount: project.components.length,
          connectionsCount: project.connections.length,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt
        };
        
        const updatedProjects = savedProjects.filter((p: any) => p.id !== project.id);
        updatedProjects.push(workspaceProject);
        localStorage.setItem(`funnel-projects-${user.id}`, JSON.stringify(updatedProjects));
      }
      
      toast.success('Projeto salvo com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      toast.error('Erro ao salvar projeto');
      return false;
    }
  }, [project, user]);

  const loadProject = useCallback((projectId: string) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    try {
      // Tentar carregar com ID do usuário primeiro
      let projectData = localStorage.getItem(`funnel-project-${projectId}-${user.id}`);
      
      if (projectData) {
        const loadedProject = JSON.parse(projectData);
        setProject(loadedProject);
        toast.success('Projeto carregado com sucesso!');
        return true;
      } else {
        toast.error('Projeto não encontrado');
        return false;
      }
    } catch (error) {
      console.error('Erro ao carregar projeto:', error);
      toast.error('Erro ao carregar projeto');
      return false;
    }
  }, [user]);

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
      toast.success('Projeto exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar projeto:', error);
      toast.error('Erro ao exportar projeto');
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
    saveProject,
    loadProject,
    exportProject,
    clearProject,
    updateProjectName,
    setProjectData
  };
};
