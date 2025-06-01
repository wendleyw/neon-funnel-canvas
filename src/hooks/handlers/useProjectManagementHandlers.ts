
import { useCallback } from 'react';
import { FunnelProject } from '../../types/funnel';
import { useWorkspace } from '../useWorkspace';
import { toast } from 'sonner';

interface UseProjectManagementHandlersProps {
  project: FunnelProject;
  setProject: React.Dispatch<React.SetStateAction<FunnelProject>>;
  currentProjectId: string | null;
  setCurrentProjectId: React.Dispatch<React.SetStateAction<string | null>>;
  loadProjectData: (projectData: FunnelProject, projectId?: string) => void;
  resetProject: () => void;
  enterEditor: () => void;
}

export const useProjectManagementHandlers = ({
  project,
  setProject,
  currentProjectId,
  setCurrentProjectId,
  loadProjectData,
  resetProject,
  enterEditor
}: UseProjectManagementHandlersProps) => {
  const { currentWorkspace, addProjectToWorkspace, workspaceProjects } = useWorkspace();

  const handleProjectSelect = useCallback((projectId: string) => {
    try {
      console.log('Loading project with ID:', projectId);
      
      const projectRecord = workspaceProjects.find(p => p.id === projectId);
      
      if (!projectRecord) {
        console.error('Project not found in workspaceProjects:', projectId);
        toast.error('Projeto não encontrado');
        return;
      }

      console.log('Found project record:', projectRecord);
      
      const projectData = projectRecord.project_data as unknown as FunnelProject;
      
      if (!projectData || typeof projectData !== 'object') {
        console.error('Invalid project data:', projectData);
        toast.error('Dados do projeto inválidos');
        return;
      }

      if (!projectData.id || !projectData.name || !Array.isArray(projectData.components) || !Array.isArray(projectData.connections)) {
        console.error('Project data missing required fields:', projectData);
        toast.error('Estrutura do projeto inválida');
        return;
      }

      console.log('Loading project:', projectData.name);
      loadProjectData(projectData, projectId);
      toast.success(`Projeto "${projectData.name}" carregado com sucesso!`);
    } catch (error) {
      console.error('Erro ao carregar projeto:', error);
      toast.error('Erro ao carregar projeto');
    }
  }, [workspaceProjects, loadProjectData]);

  const handleNewProject = useCallback(() => {
    resetProject();
    enterEditor();
  }, [resetProject, enterEditor]);

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
    handleProjectSelect,
    handleNewProject,
    handleSave,
    handleExport,
    handleClear
  };
};
