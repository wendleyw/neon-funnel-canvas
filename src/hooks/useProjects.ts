import { useState, useCallback, useRef, useMemo } from 'react';
import { projectService } from '../services/projectService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Database } from '../integrations/supabase/types';
import { useDebounceProjectSave } from './useDebounceProjectSave';

type WorkspaceProject = Database['public']['Tables']['workspace_projects']['Row'];

export const useProjects = () => { // Renamed from useOptimizedWorkspaceProjects
  const { user } = useAuth();
  const [workspaceProjects, setWorkspaceProjects] = useState<WorkspaceProject[]>([]);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef<Map<string, WorkspaceProject>>(new Map());
  const lastFetchRef = useRef<number>(0);
  const loadingRef = useRef(false); // Guard to prevent multiple simultaneous calls
  const lastLoadedUserId = useRef<string | null>(null); // Control by user
  const isInitializedRef = useRef(false); // Initialization control
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  const currentWorkspaceIdRef = useRef<string>('');
  const currentProjectIdRef = useRef<string | undefined>();

  // Local cache to avoid unnecessary refetch
  const getCachedProject = useCallback((projectId: string): WorkspaceProject | null => {
    return cacheRef.current.get(projectId) || null;
  }, []);

  const setCachedProject = useCallback((project: WorkspaceProject) => {
    cacheRef.current.set(project.id, project);
  }, []);

  // Optimized save operation with debounce
  const saveProjectOptimized = useCallback(async (project: any) => {
    if (!user) {
      return { success: false };
    }

    const workspaceId = currentWorkspaceIdRef.current;
    const projectId = currentProjectIdRef.current;

    try {
      let result;
      
      if (projectId) {
        // Update existing project
        result = await projectService.update(projectId, {
          name: project.name,
          project_data: project,
          components_count: project.components.length,
          connections_count: project.connections.length
        }, user.id);
      } else {
        // Create new project
        result = await projectService.create({
          name: project.name,
          workspace_id: workspaceId,
          project_data: project,
          components_count: project.components.length,
          connections_count: project.connections.length,
          user_id: user.id
        });
      }

      if (result) {
        // Update local cache
        setCachedProject(result);
        
        // Update local state
        setWorkspaceProjects(prev => {
          const filtered = prev.filter(p => p.id !== result.id);
          return [...filtered, result];
        });

        // Update project ID if it's a new project
        if (!projectId) {
          currentProjectIdRef.current = result.id;
        }

        return { success: true, projectId: result.id };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error('Error saving project:', error);
      return { success: false };
    }
  }, [user, setCachedProject]);

  // Debounce hook for auto-save
  const { debouncedSave, forceSave, cancelSave } = useDebounceProjectSave({
    onSave: saveProjectOptimized,
    delay: 5000 // 5 seconds delay for auto-save
  });

  const addProjectToWorkspace = useCallback(async (project: any, workspaceId: string, projectId?: string, isAutoSave: boolean = false) => {
    if (!user) {
      toast.error('User not authenticated');
      return { success: false };
    }

    // Update refs for optimized save
    currentWorkspaceIdRef.current = workspaceId;
    currentProjectIdRef.current = projectId;

    // If auto-save, use debounced save
    if (isAutoSave) {
      return await debouncedSave(project);
    }

    // If manual save, force immediate save
    setLoading(true);
    try {
      const result = await forceSave(project);
      if (result.success) {
        toast.success('Project saved successfully!');
      } else {
        toast.error('Error saving project');
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, [user, debouncedSave, forceSave]);

  const updateProjectName = useCallback(async (projectId: string, newName: string) => {
    if (!user) {
      toast.error('User not authenticated');
      return false;
    }

    // Update local cache first (optimistic update)
    const cachedProject = getCachedProject(projectId);
    if (cachedProject) {
      const updatedProject = { ...cachedProject, name: newName };
      setCachedProject(updatedProject);
      setWorkspaceProjects(prev => 
        prev.map(p => p.id === projectId ? updatedProject : p)
      );
    }

    setLoading(true);
    try {
      const result = await projectService.update(projectId, { name: newName }, user.id);
      
      if (result) {
        setCachedProject(result);
        setWorkspaceProjects(prev => 
          prev.map(p => p.id === projectId ? result : p)
        );
        toast.success('Project name updated!');
        return true;
      } else {
        // Revert optimistic update in case of error
        if (cachedProject) {
          setCachedProject(cachedProject);
          setWorkspaceProjects(prev => 
            prev.map(p => p.id === projectId ? cachedProject : p)
          );
        }
        toast.error('Error updating project name');
        return false;
      }
    } finally {
      setLoading(false);
    }
  }, [user, getCachedProject, setCachedProject]);

  const deleteProject = useCallback(async (projectId: string) => {
    if (!user) {
      toast.error('User not authenticated');
      return false;
    }

    // Cancel any pending save
    cancelSave();

    setLoading(true);
    try {
      const success = await projectService.delete(projectId, user.id);
      
      if (success) {
        // Remove from cache
        cacheRef.current.delete(projectId);
        
        setWorkspaceProjects(prev => prev.filter(p => p.id !== projectId));
        toast.success('Project deleted successfully!');
        return true;
      } else {
        toast.error('Error deleting project');
        return false;
      }
    } finally {
      setLoading(false);
    }
  }, [user, cancelSave]);

  const loadProjects = useCallback(async (forceRefresh: boolean = false) => {
    if (!user) {
      setWorkspaceProjects([]);
      lastLoadedUserId.current = null;
      isInitializedRef.current = false;
      return;
    }

    // Robust checks to prevent multiple calls
    if (loadingRef.current) {
      console.log('⏳ LoadProjects is already running, skipping...');
      return;
    }

    // If already loaded for this user and not a forced refresh, don't load again
    if (lastLoadedUserId.current === user.id && isInitializedRef.current && !forceRefresh) {
      console.log('✅ Projects already loaded for this user');
      return;
    }

    // Check if user has changed
    if (lastLoadedUserId.current !== user.id) {
      console.log('🔄 User changed, resetting projects state');
      setWorkspaceProjects([]);
      cacheRef.current.clear();
      isInitializedRef.current = false;
      lastFetchRef.current = 0;
    }

    const now = Date.now();
    const hasValidCache = lastFetchRef.current > 0 && (now - lastFetchRef.current < CACHE_DURATION);
    
    if (!forceRefresh && hasValidCache && workspaceProjects.length > 0 && isInitializedRef.current) {
      console.log('📦 Using cached projects');
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    try {
      console.log('🔄 Fetching projects from database');
      const data = await projectService.getByUserId(user.id);
      
      // Update cache
      cacheRef.current.clear(); // Clear previous cache
      data.forEach(project => setCachedProject(project));
      
      setWorkspaceProjects(data);
      lastFetchRef.current = now;
      lastLoadedUserId.current = user.id;
      isInitializedRef.current = true;
      console.log(`✅ Projects loaded: ${data.length} found`);
    } catch (error) {
      console.error('❌ Error loading projects:', error);
      toast.error('Error loading projects');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [user, setCachedProject]);
  
  // Returns all projects for a given workspace ID
  const getWorkspaceProjects = useCallback((workspaceId: string) => {
    return workspaceProjects.filter(p => p.workspace_id === workspaceId);
  }, [workspaceProjects]);

  // Loads a specific project (first from local state, then from cache)
  const loadProject = useCallback(async (projectId: string): Promise<WorkspaceProject | null> => {
    if (!projectId) return null;

    // Try to get from local state first (populated by loadProjects)
    const projectFromState = workspaceProjects.find(p => p.id === projectId);
    if (projectFromState) {
      return projectFromState;
    }
    
    // Then try cache (might have specific items not in general list or for quick access)
    const cached = getCachedProject(projectId);
    if (cached) {
      return cached;
    }

    // If not found in local state or cache, it means it's not loaded or doesn't exist.
    // A dedicated fetch for a single project (e.g., projectService.getById) is not currently implemented.
    // For now, we return null if not found locally.
    // Consider adding projectService.getById for a more robust fetch-on-demand capability if needed.
    console.warn(`Project ${projectId} not found in local state or cache.`);
    return null;
  }, [getCachedProject, workspaceProjects]);

  // Utility function to get cache statistics (for debugging)
  const cacheStats = useMemo(() => ({
    size: cacheRef.current.size,
    lastFetch: lastFetchRef.current,
    isInitialized: isInitializedRef.current,
    isLoading: loading
  }), [loading]);

  return {
    workspaceProjects,
    addProjectToWorkspace,
    updateProjectName,
    deleteProject,
    loadProjects,
    getWorkspaceProjects,
    loadProject,
    loading,
    cacheStats,
    cancelSave, // Expose cancelSave from useDebounceProjectSave
  };
}; 