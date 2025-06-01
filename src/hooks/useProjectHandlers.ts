
import { useCallback } from 'react';
import { FunnelComponent, Connection, FunnelProject } from '../types/funnel';
import { useWorkspace } from './useWorkspace';
import { toast } from 'sonner';

interface UseProjectHandlersProps {
  project: FunnelProject;
  setProject: React.Dispatch<React.SetStateAction<FunnelProject>>;
  currentProjectId: string | null;
  setCurrentProjectId: React.Dispatch<React.SetStateAction<string | null>>;
  loadProjectData: (projectData: FunnelProject, projectId?: string) => void;
  resetProject: () => void;
  enterEditor: () => void;
}

export const useProjectHandlers = ({
  project,
  setProject,
  currentProjectId,
  setCurrentProjectId,
  loadProjectData,
  resetProject,
  enterEditor
}: UseProjectHandlersProps) => {
  const { currentWorkspace, addProjectToWorkspace, loadProject } = useWorkspace();

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

  const handleConnectionAdd = useCallback((connection: Connection) => {
    setProject(prev => ({
      ...prev,
      connections: [...prev.connections, connection],
      updatedAt: new Date().toISOString()
    }));
  }, [setProject]);

  const handleConnectionDelete = useCallback((connectionId: string) => {
    setProject(prev => ({
      ...prev,
      connections: prev.connections.filter(connection => connection.id !== connectionId),
      updatedAt: new Date().toISOString()
    }));
  }, [setProject]);

  const handleConnectionUpdate = useCallback((connectionId: string, updates: Partial<Connection>) => {
    setProject(prev => ({
      ...prev,
      connections: prev.connections.map(connection =>
        connection.id === connectionId ? { ...connection, ...updates } : connection
      ),
      updatedAt: new Date().toISOString()
    }));
  }, [setProject]);

  const handleProjectSelect = useCallback((projectId: string) => {
    try {
      const projectData = loadProject(projectId);
      if (projectData && typeof projectData === 'object' && 'name' in projectData) {
        const typedProject = projectData as FunnelProject;
        console.log('Project loaded:', typedProject.name);
        loadProjectData(typedProject, projectId);
      } else {
        toast.error('Projeto não encontrado');
      }
    } catch (error) {
      console.error('Erro ao carregar projeto:', error);
      toast.error('Erro ao carregar projeto');
    }
  }, [loadProject, loadProjectData]);

  const handleNewProject = useCallback(() => {
    resetProject();
    enterEditor();
  }, [resetProject, enterEditor]);

  const handleAddCompleteTemplate = useCallback((newComponents: FunnelComponent[], newConnections: Connection[]) => {
    setProject(prev => ({
      ...prev,
      components: [...prev.components, ...newComponents],
      connections: [...prev.connections, ...newConnections],
      updatedAt: new Date().toISOString()
    }));
  }, [setProject]);

  const handleSave = useCallback(async () => {
    if (!currentWorkspace) {
      toast.error('Nenhum workspace selecionado');
      return;
    }

    const projectToSave = {
      ...project,
      updatedAt: new Date().toISOString()
    };

    console.log('Salvando projeto:', projectToSave.name, 'no workspace:', currentWorkspace.name);
    console.log('Current project ID:', currentProjectId);

    const result = await addProjectToWorkspace(projectToSave, currentWorkspace.id, currentProjectId || undefined);
    if (result.success) {
      setProject(projectToSave);
      toast.success('Projeto salvo com sucesso!');
      
      if (result.projectId && !currentProjectId) {
        setCurrentProjectId(result.projectId);
      }
    }
  }, [project, currentWorkspace, addProjectToWorkspace, currentProjectId, setCurrentProjectId, setProject]);

  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(project, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('Projeto exportado!');
  }, [project]);

  const handleClear = useCallback(() => {
    if (window.confirm('Tem certeza que deseja limpar o projeto?')) {
      resetProject();
      toast.success('Projeto limpo!');
    }
  }, [resetProject]);

  return {
    handleComponentAdd,
    handleComponentUpdate,
    handleComponentDelete,
    handleConnectionAdd,
    handleConnectionDelete,
    handleConnectionUpdate,
    handleProjectSelect,
    handleNewProject,
    handleAddCompleteTemplate,
    handleSave,
    handleExport,
    handleClear
  };
};
