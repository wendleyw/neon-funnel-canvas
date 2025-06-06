import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { useWorkspaces } from '@/features/workspace/hooks/useWorkspaces';
import { useUnifiedProjectManager } from '@/features/workspace/hooks/useUnifiedProjectManager';
import { useWorkspacePersistence } from '@/features/workspace/hooks/useWorkspacePersistence';
import { useAuth } from './AuthContext';
import { logger } from '../lib/logger';
import { Database } from '../integrations/supabase/types';

type Workspace = Database['public']['Tables']['workspaces']['Row'];
type WorkspaceProject = Database['public']['Tables']['workspace_projects']['Row'];

interface UnifiedWorkspaceContextType {
  // Workspace state
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  
  // Project state
  projects: WorkspaceProject[];
  currentProjectId: string | null;
  currentWorkspaceId: string | null;
  
  // Loading states
  loading: boolean;
  saving: boolean;
  lastSaved: string | null;
  
  // Workspace actions
  loadWorkspaces: () => Promise<void>;
  createWorkspace: (name: string, description?: string) => Promise<Workspace | null>;
  deleteWorkspace: (id: string) => Promise<boolean>;
  
  // Project actions
  loadProjects: () => Promise<void>;
  saveProject: (projectData: unknown, workspaceId: string, projectId?: string) => Promise<{ success: boolean; projectId?: string }>;
  scheduleAutoSave: (projectData: unknown, workspaceId: string, projectId?: string) => void;
  deleteProject: (projectId: string) => Promise<boolean>;
  updateProjectName: (projectId: string, newName: string) => Promise<boolean>;
  
  // Utility functions
  getProjectsByWorkspace: (workspaceId: string) => WorkspaceProject[];
  getProject: (projectId: string) => WorkspaceProject | null;
  setCurrentContext: (workspaceId: string | null, projectId: string | null) => void;
  
  // Status
  isInitialized: boolean;
}

const UnifiedWorkspaceContext = createContext<UnifiedWorkspaceContextType | undefined>(undefined);

/**
 * Custom hook to use the Unified Workspace Context
 * Throws an error if used outside of provider (fail-fast pattern)
 */
export const useUnifiedWorkspace = (): UnifiedWorkspaceContextType => {
  const context = useContext(UnifiedWorkspaceContext);
  if (context === undefined) {
    throw new Error('useUnifiedWorkspace must be used within a UnifiedWorkspaceProvider');
  }
  return context;
};

/**
 * Unified Workspace Provider Component
 * 
 * This provider consolidates workspace and project management following the custom rules:
 * - Single source of truth for workspace/project state
 * - Clear separation of concerns
 * - Robust error handling
 * - Performance optimized
 * - English naming and clear interfaces
 */
export const UnifiedWorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Use the persistence hook for current workspace
  const { currentWorkspace, setCurrentWorkspace, loadSavedWorkspace } = useWorkspacePersistence();
  
  // Use workspaces hook for workspace management
  const { 
    workspaces, 
    createWorkspace, 
    deleteWorkspace, 
    loadWorkspaces,
    loading: workspacesLoading 
  } = useWorkspaces();
  
  // Use unified project manager for project state and actions
  const projectManager = useUnifiedProjectManager();
  
  // Ref to track if projects have been loaded for this user
  const projectsLoadedRef = useRef<Set<string>>(new Set());

  // Combined loading state
  const loading = useMemo(() => {
    return workspacesLoading || projectManager.loading;
  }, [workspacesLoading, projectManager.loading]);

  // Combined initialization status
  const isInitialized = useMemo(() => {
    return projectManager.isInitialized && workspaces.length >= 0;
  }, [projectManager.isInitialized, workspaces.length]);

  /**
   * Auto-load workspaces when user is available
   */
  useEffect(() => {
    if (user && !workspacesLoading) {
      logger.log('User available, loading workspaces');
      loadWorkspaces();
    }
  }, [user, loadWorkspaces, workspacesLoading]);

  /**
   * Auto-load saved workspace when workspaces are loaded
   */
  useEffect(() => {
    if (workspaces.length > 0 && !currentWorkspace) {
      logger.log('Workspaces loaded, attempting to load saved workspace');
      loadSavedWorkspace(workspaces);
    }
  }, [workspaces, currentWorkspace, loadSavedWorkspace]);

  /**
   * Auto-load projects when user is available (only once per user)
   */
  useEffect(() => {
    if (user && user.id && !projectsLoadedRef.current.has(user.id)) {
      logger.log('User available, loading projects');
      projectsLoadedRef.current.add(user.id);
      projectManager.loadProjects();
    }
    
    // Cleanup when user changes
    if (!user) {
      projectsLoadedRef.current.clear();
    }
  }, [user, projectManager.loadProjects]);

  /**
   * Enhanced save project function with workspace context
   */
  const saveProject = async (
    projectData: unknown, 
    workspaceId: string, 
    projectId?: string
  ): Promise<{ success: boolean; projectId?: string }> => {
    const currentUser = user;
    if (!currentUser || !currentUser.id) {
      logger.error('Cannot save project: user not authenticated', { user: currentUser });
      return { success: false };
    }

    const result = await projectManager.saveProjectManually(projectData, workspaceId, projectId);
    
    if (result.success) {
      // Update current context if this is a new project
      if (!projectId && result.projectId) {
        projectManager.setCurrentContext(workspaceId, result.projectId);
      }
    }

    return result;
  };

  /**
   * Enhanced auto-save with context awareness
   */
  const scheduleAutoSave = (projectData: unknown, workspaceId: string, projectId?: string): void => {
    const currentUser = user;
    if (!currentUser || !currentUser.id) {
      logger.warn('Cannot schedule auto-save: user not authenticated', { user: currentUser });
      return;
    }

    projectManager.scheduleAutoSave(projectData, workspaceId, projectId);
  };

  /**
   * Get projects for current workspace
   */
  const getProjectsByWorkspace = (workspaceId: string): WorkspaceProject[] => {
    return projectManager.getProjectsByWorkspace(workspaceId);
  };

  /**
   * Get specific project
   */
  const getProject = (projectId: string): WorkspaceProject | null => {
    return projectManager.getProject(projectId);
  };

  /**
   * Set current context (workspace and project)
   */
  const setCurrentContext = (workspaceId: string | null, projectId: string | null): void => {
    projectManager.setCurrentContext(workspaceId, projectId);
    
    // Update current workspace if provided and different
    if (workspaceId && currentWorkspace?.id !== workspaceId) {
      const workspace = workspaces.find(w => w.id === workspaceId);
      if (workspace) {
        setCurrentWorkspace(workspace);
      }
    }
  };

  // Create the context value with proper memoization
  const contextValue = useMemo<UnifiedWorkspaceContextType>(() => ({
    // Workspace state
    currentWorkspace,
    workspaces,
    setCurrentWorkspace,
    
    // Project state
    projects: projectManager.projects,
    currentProjectId: projectManager.currentProjectId,
    currentWorkspaceId: projectManager.currentWorkspaceId,
    
    // Loading states
    loading,
    saving: projectManager.saving,
    lastSaved: projectManager.lastSaved,
    
    // Workspace actions
    loadWorkspaces,
    createWorkspace,
    deleteWorkspace,
    
    // Project actions
    loadProjects: projectManager.loadProjects,
    saveProject,
    scheduleAutoSave,
    deleteProject: projectManager.deleteProject,
    updateProjectName: projectManager.updateProjectName,
    
    // Utility functions
    getProjectsByWorkspace,
    getProject,
    setCurrentContext,
    
    // Status
    isInitialized,
  }), [
    currentWorkspace,
    workspaces,
    setCurrentWorkspace,
    projectManager.projects,
    projectManager.currentProjectId,
    projectManager.currentWorkspaceId,
    loading,
    projectManager.saving,
    projectManager.lastSaved,
    loadWorkspaces,
    createWorkspace,
    deleteWorkspace,
    projectManager.loadProjects,
    projectManager.deleteProject,
    projectManager.updateProjectName,
    isInitialized,
  ]);

  return (
    <UnifiedWorkspaceContext.Provider value={contextValue}>
      {children}
    </UnifiedWorkspaceContext.Provider>
  );
}; 