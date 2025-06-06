import { useState, useCallback, useRef, useEffect } from 'react';
import { projectService } from '../../../services/projectService';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'sonner';
import { logger } from '../../../lib/logger';
import { Database } from '../../../integrations/supabase/types';

type WorkspaceProject = Database['public']['Tables']['workspace_projects']['Row'];
type Json = Database['public']['Tables']['workspace_projects']['Row']['project_data'];

interface UnifiedProjectState {
  projects: WorkspaceProject[];
  loading: boolean;
  saving: boolean;
  lastSaved: string | null;
  currentProjectId: string | null;
  currentWorkspaceId: string | null;
}

/**
 * Unified Project Manager Hook
 * 
 * This hook consolidates all project management functionality following the custom rules:
 * - Single source of truth for project state
 * - Clear separation of concerns
 * - Robust error handling
 * - Performance optimized with caching
 * - English naming and clear interfaces
 */
export const useUnifiedProjectManager = () => {
  const { user } = useAuth();
  
  // Unified state following single responsibility principle
  const [state, setState] = useState<UnifiedProjectState>({
    projects: [],
    loading: false,
    saving: false,
    lastSaved: null,
    currentProjectId: null,
    currentWorkspaceId: null,
  });

  // Performance optimizations with refs
  const cacheRef = useRef<Map<string, WorkspaceProject>>(new Map());
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedProjectDataRef = useRef<string>('');
  const isLoadingRef = useRef<boolean>(false);
  const initializationRef = useRef({
    isInitialized: false,
    userId: null as string | null,
  });

  // Auto-save configuration
  const AUTO_SAVE_DELAY = 2000; // 2 seconds
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Update state helper with immutability
   */
  const updateState = useCallback((updates: Partial<UnifiedProjectState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Cache management functions
   */
  const getCachedProject = useCallback((projectId: string): WorkspaceProject | null => {
    return cacheRef.current.get(projectId) || null;
  }, []);

  const setCachedProject = useCallback((project: WorkspaceProject) => {
    cacheRef.current.set(project.id, project);
    logger.log('Project cached:', project.id);
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    logger.log('Project cache cleared');
  }, []);

  /**
   * Initialize the manager when user changes
   */
  useEffect(() => {
    if (user?.id !== initializationRef.current.userId) {
      if (user?.id) {
        logger.log('User changed, initializing project manager for:', user.id);
      } else if (initializationRef.current.userId) {
        // Only log when actually clearing an existing user, not on initial load
        logger.log('User logged out, clearing project manager');
      }
      
      // Reset state
      updateState({
        projects: [],
        loading: false,
        saving: false,
        lastSaved: null,
        currentProjectId: null,
        currentWorkspaceId: null,
      });
      
      // Clear cache
      clearCache();
      
      // Clear any pending auto-save
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
        autoSaveTimeoutRef.current = null;
      }
      
      // Reset loading ref
      isLoadingRef.current = false;
      
      // Update initialization state
      initializationRef.current = {
        isInitialized: false,
        userId: user?.id || null,
      };
    }
  }, [user?.id, updateState, clearCache]);

  /**
   * Load all projects for the current user
   */
  const loadProjects = useCallback(async (forceRefresh: boolean = false): Promise<void> => {
    if (!user) {
      logger.warn('Cannot load projects: user not authenticated');
      updateState({ projects: [] });
      return;
    }

    if (isLoadingRef.current && !forceRefresh) {
      logger.log('Project loading already in progress');
      return;
    }

    isLoadingRef.current = true;
    updateState({ loading: true });

    try {
      logger.log('Loading projects for user:', user.id);
      const projects = await projectService.getByUserId(user.id);
      
      // Update cache
      clearCache();
      projects.forEach(setCachedProject);
      
      updateState({ 
        projects, 
        loading: false,
      });
      
      initializationRef.current.isInitialized = true;
      logger.log(`✅ Projects loaded successfully: ${projects.length} found`);
      
    } catch (error) {
      logger.error('Failed to load projects:', error);
      toast.error('Failed to load projects');
      updateState({ loading: false });
    } finally {
      isLoadingRef.current = false;
    }
  }, [user, updateState, clearCache, setCachedProject]);

  /**
   * Auto-save functionality with debouncing
   */
  const scheduleAutoSave = useCallback((projectData: unknown, workspaceId: string, projectId?: string) => {
    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Create hash for change detection
    const dataHash = JSON.stringify(projectData);
    if (dataHash === lastSavedProjectDataRef.current) {
      logger.log('No changes detected, skipping auto-save');
      return;
    }

    logger.log('Scheduling auto-save in', AUTO_SAVE_DELAY, 'ms');
    
    autoSaveTimeoutRef.current = setTimeout(async () => {
      await saveProject(projectData, workspaceId, projectId, true);
    }, AUTO_SAVE_DELAY);
  }, []);

  /**
   * Core save functionality - used by both manual and auto-save
   */
  const saveProject = useCallback(async (
    projectData: unknown, 
    workspaceId: string, 
    projectId?: string,
    isAutoSave: boolean = false
  ): Promise<{ success: boolean; projectId?: string }> => {
    // Additional null checks for user
    const currentUser = user;
    
    // Debug logging for user state
    if (!isAutoSave) {
      logger.log('💾 Save attempt:', { 
        projectId, 
        workspaceId, 
        isAutoSave, 
        userExists: !!currentUser, 
        userId: currentUser?.id,
        userEmail: currentUser?.email 
      });
    }
    
    if (!currentUser || !currentUser.id) {
      const message = 'Cannot save project: user not authenticated';
      logger.error(message, { 
        user: currentUser, 
        userId: currentUser?.id,
        userType: typeof currentUser,
        isAutoSave,
        projectId,
        workspaceId
      });
      if (!isAutoSave) toast.error(message);
      return { success: false };
    }

    updateState({ saving: true });

    try {
      const payload = {
        name: (projectData as { name?: string })?.name || 'Untitled Project',
        workspace_id: workspaceId,
        project_data: projectData as Json,
        components_count: (projectData as { components?: unknown[] })?.components?.length || 0,
        connections_count: (projectData as { connections?: unknown[] })?.connections?.length || 0,
        user_id: currentUser.id,
      };

      let result: WorkspaceProject | null;

      if (projectId) {
        // Update existing project
        logger.log('Updating existing project:', projectId);
        result = await projectService.update(projectId, payload, currentUser.id);
      } else {
        // Create new project
        logger.log('Creating new project:', payload.name);
        result = await projectService.create(payload);
      }

      if (result) {
        // Update cache and state
        setCachedProject(result);
        
        setState(prev => ({
          ...prev,
          projects: prev.projects.some(p => p.id === result!.id)
            ? prev.projects.map(p => p.id === result!.id ? result! : p)
            : [...prev.projects, result!],
          saving: false,
          lastSaved: new Date().toISOString(),
          currentProjectId: result.id,
          currentWorkspaceId: workspaceId,
        }));

        // Update saved data hash
        lastSavedProjectDataRef.current = JSON.stringify(projectData);

        logger.log('✅ Project saved successfully:', result.id);
        if (!isAutoSave) {
          toast.success('Project saved successfully!');
        }

        return { success: true, projectId: result.id };
      } else {
        throw new Error('Save operation returned null result');
      }

    } catch (error) {
      logger.error('Failed to save project:', error);
      updateState({ saving: false });
      
      if (!isAutoSave) {
        toast.error('Failed to save project');
      }
      
      return { success: false };
    }
  }, [user, updateState, setCachedProject]);

  /**
   * Manual save - cancels auto-save and saves immediately
   */
  const saveProjectManually = useCallback(async (
    projectData: unknown,
    workspaceId: string,
    projectId?: string
  ): Promise<{ success: boolean; projectId?: string }> => {
    // Cancel any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = null;
    }

    return await saveProject(projectData, workspaceId, projectId, false);
  }, [saveProject]);

  /**
   * Delete project
   */
  const deleteProject = useCallback(async (projectId: string): Promise<boolean> => {
    const currentUser = user;
    if (!currentUser || !currentUser.id) {
      toast.error('Cannot delete project: user not authenticated');
      return false;
    }

    updateState({ loading: true });

    try {
      const success = await projectService.delete(projectId, currentUser.id);
      
      if (success) {
        // Remove from cache and state
        cacheRef.current.delete(projectId);
        setState(prev => ({
          ...prev,
          projects: prev.projects.filter(p => p.id !== projectId),
          loading: false,
          currentProjectId: prev.currentProjectId === projectId ? null : prev.currentProjectId,
        }));

        toast.success('Project deleted successfully!');
        logger.log('Project deleted:', projectId);
        return true;
      } else {
        throw new Error('Delete operation failed');
      }

    } catch (error) {
      logger.error('Failed to delete project:', error);
      updateState({ loading: false });
      toast.error('Failed to delete project');
      return false;
    }
  }, [user, updateState]);

  /**
   * Get projects by workspace
   */
  const getProjectsByWorkspace = useCallback((workspaceId: string): WorkspaceProject[] => {
    return state.projects.filter(p => p.workspace_id === workspaceId);
  }, [state.projects]);

  /**
   * Get specific project
   */
  const getProject = useCallback((projectId: string): WorkspaceProject | null => {
    // Try from state first
    const fromState = state.projects.find(p => p.id === projectId);
    if (fromState) return fromState;

    // Try from cache
    return getCachedProject(projectId);
  }, [state.projects, getCachedProject]);

  /**
   * Set current context
   */
  const setCurrentContext = useCallback((workspaceId: string | null, projectId: string | null) => {
    updateState({
      currentWorkspaceId: workspaceId,
      currentProjectId: projectId,
    });
    logger.log('Context updated:', { workspaceId, projectId });
  }, [updateState]);

  /**
   * Cleanup function
   */
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Update project name
   */
  const updateProjectName = useCallback(async (projectId: string, newName: string): Promise<boolean> => {
    const currentUser = user;
    if (!currentUser || !currentUser.id) {
      toast.error('Cannot update project: user not authenticated');
      return false;
    }

    if (!newName.trim()) {
      toast.error('Project name cannot be empty');
      return false;
    }

    updateState({ saving: true });

    try {
      const project = getProject(projectId);
      if (!project) {
        throw new Error('Project not found');
      }

      const success = await projectService.update(projectId, { 
        name: newName.trim() 
      }, currentUser.id);
      
      if (success) {
        // Update project in state and cache
        const updatedProject = { ...project, name: newName.trim() };
        setCachedProject(updatedProject);
        
        setState(prev => ({
          ...prev,
          projects: prev.projects.map(p => p.id === projectId ? updatedProject : p),
          saving: false,
        }));

        toast.success('Project name updated successfully!');
        logger.log('Project name updated:', projectId, newName);
        return true;
      } else {
        throw new Error('Update operation failed');
      }

    } catch (error) {
      logger.error('Failed to update project name:', error);
      updateState({ saving: false });
      toast.error('Failed to update project name');
      return false;
    }
  }, [user, updateState, getProject, setCachedProject]);

  // Public API following clear interface pattern
  return {
    // State
    projects: state.projects,
    loading: state.loading,
    saving: state.saving,
    lastSaved: state.lastSaved,
    currentProjectId: state.currentProjectId,
    currentWorkspaceId: state.currentWorkspaceId,
    isInitialized: initializationRef.current.isInitialized,

    // Actions
    loadProjects,
    saveProjectManually,
    scheduleAutoSave,
    deleteProject,
    getProjectsByWorkspace,
    getProject,
    setCurrentContext,
    updateProjectName,

    // Utilities
    clearCache,
  };
}; 