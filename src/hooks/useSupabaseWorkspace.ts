
import { useEffect } from 'react';
import { useWorkspaces } from './useWorkspaces';
import { useWorkspaceProjects } from './useWorkspaceProjects';
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
    loading: projectsLoading 
  } = useWorkspaceProjects();

  const loading = workspacesLoading || projectsLoading;

  useEffect(() => {
    if (user) {
      loadWorkspaces();
      loadProjects();
    }
  }, [user, loadWorkspaces, loadProjects]);

  useEffect(() => {
    loadSavedWorkspace(workspaces);
  }, [workspaces, loadSavedWorkspace]);

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
    loading
  };
};
