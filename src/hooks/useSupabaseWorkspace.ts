import { useEffect } from 'react';
import { useWorkspaces } from './useWorkspaces';
import { useOptimizedWorkspaceProjects } from './useOptimizedWorkspaceProjects';
import { useWorkspacePersistence } from './useWorkspacePersistence';
import { useAuth } from '../contexts/AuthContext';

export const useSupabaseWorkspace = () => {
  const { user } = useAuth();
  const { currentWorkspace, setCurrentWorkspace, loadSavedWorkspace } = useWorkspacePersistence();
  
  const { 
    workspaces, 
    createWorkspace, 
    deleteWorkspace, 
    loadWorkspaces,
    loading: workspacesLoading 
  } = useWorkspaces();
  
  const { 
    workspaceProjects, 
    addProjectToWorkspace, 
    updateProjectName, 
    deleteProject, 
    loadProjects,
    getWorkspaceProjects, 
    loadProject,
    loading: projectsLoading,
    cacheStats,
    cancelSave
  } = useOptimizedWorkspaceProjects();

  const loading = workspacesLoading || projectsLoading;

  useEffect(() => {
    if (user) {
      // Carregar dados apenas uma vez por sessão, usando cache depois
      loadWorkspaces();
      loadProjects(false); // false = não forçar refresh se já tem cache
    }
  }, [user, loadWorkspaces, loadProjects]);

  useEffect(() => {
    loadSavedWorkspace(workspaces);
  }, [workspaces, loadSavedWorkspace]);

  // Cleanup quando componente desmonta
  useEffect(() => {
    return () => {
      cancelSave(); // Cancelar saves pendentes ao desmontar
    };
  }, [cancelSave]);

  return {
    currentWorkspace,
    setCurrentWorkspace,
    workspaces,
    workspaceProjects,
    createWorkspace,
    deleteWorkspace,
    addProjectToWorkspace,
    updateProjectName,
    deleteProject,
    loadWorkspaces,
    getWorkspaceProjects,
    loadProject,
    loading,
    cacheStats, // Estatísticas do cache para debugging
    cancelSave,
    refreshProjects: () => loadProjects(true) // Função para forçar refresh quando necessário
  };
};
