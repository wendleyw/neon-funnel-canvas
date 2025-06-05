import React, { createContext, useContext, useEffect, useRef, useMemo } from 'react';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { useProjects } from '../hooks/useProjects';
import { useWorkspacePersistence } from '../hooks/useWorkspacePersistence';
import { useAuth } from './AuthContext';

interface WorkspaceContextType {
  currentWorkspace: any;
  setCurrentWorkspace: (workspace: any) => void;
  workspaces: any[];
  workspaceProjects: any[];
  createWorkspace: (name: string, description?: string) => Promise<any>;
  deleteWorkspace: (id: string) => Promise<boolean>;
  addProjectToWorkspace: (project: any, workspaceId: string, projectId?: string, isAutoSave?: boolean) => Promise<any>;
  updateProjectName: (id: string, name: string) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  loadWorkspaces: () => Promise<void>;
  getWorkspaceProjects: (workspaceId: string) => any[];
  loadProject: (projectId: string) => any;
  loading: boolean;
  cacheStats: any;
  cancelSave: () => void;
  refreshProjects: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  } = useProjects();

  // Robust control state
  const initializationStateRef = useRef({
    hasInitialized: false,
    currentUserId: null as string | null,
    workspacesLoaded: false,
    projectsLoaded: false,
    isInitializing: false
  });

  // Memoize loading to prevent unnecessary re-renders
  const loading = useMemo(() => {
    return workspacesLoading || projectsLoading;
  }, [workspacesLoading, projectsLoading]);

  // Full reset when user changes
  useEffect(() => {
    if (user?.id !== initializationStateRef.current.currentUserId) {
      console.log('🔄 User changed, resetting workspace state');
      initializationStateRef.current = {
        hasInitialized: false,
        currentUserId: user?.id || null,
        workspacesLoaded: false,
        projectsLoaded: false,
        isInitializing: false
      };
    }
  }, [user?.id]);

  // Sequential and controlled initialization
  useEffect(() => {
    const initializeWorkspaceData = async () => {
      if (!user || initializationStateRef.current.hasInitialized || initializationStateRef.current.isInitializing) {
        return;
      }

      initializationStateRef.current.isInitializing = true;
      
      try {
        // Step 1: Load workspaces if not already loaded
        if (!initializationStateRef.current.workspacesLoaded && workspaces.length === 0) {
          console.log('🏢 WorkspaceContext: Loading workspaces for user');
          await loadWorkspaces();
          initializationStateRef.current.workspacesLoaded = true;
        }

        // Wait for a frame to ensure workspaces have been updated
        await new Promise(resolve => requestAnimationFrame(resolve));

        // Step 2: Load projects only if workspaces exist and projects haven't been loaded
        if (workspaces.length > 0 && !initializationStateRef.current.projectsLoaded) {
          console.log('📁 WorkspaceContext: Loading projects for user');
          await loadProjects(false); // Assuming false means don't force refresh initially
          initializationStateRef.current.projectsLoaded = true;
        }

        // Step 3: Load saved workspace if there's no current workspace
        if (workspaces.length > 0 && !currentWorkspace) {
          loadSavedWorkspace(workspaces);
        }

        initializationStateRef.current.hasInitialized = true;
      } catch (error) {
        console.error('❌ Error initializing workspace data:', error);
      } finally {
        initializationStateRef.current.isInitializing = false;
      }
    };

    initializeWorkspaceData();
  }, [user, workspaces.length, currentWorkspace, loadWorkspaces, loadProjects, loadSavedWorkspace]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      cancelSave();
    };
  }, [cancelSave]);

  const value: WorkspaceContextType = useMemo(() => ({
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
    cacheStats,
    cancelSave,
    refreshProjects: () => {
      initializationStateRef.current.projectsLoaded = false;
      return loadProjects(true);
    }
  }), [
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
    cacheStats,
    cancelSave,
    loadProjects
  ]);

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspaceContext = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspaceContext must be used within a WorkspaceProvider');
  }
  return context;
}; 