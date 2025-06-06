import { useState, useCallback } from 'react';
import { projectService } from '../../../services/projectService';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'sonner';
import { Database } from '../../../integrations/supabase/types';

type WorkspaceProject = Database['public']['Tables']['workspace_projects']['Row'];

export const useWorkspaceProjects = () => {
  const { user } = useAuth();
  const [workspaceProjects, setWorkspaceProjects] = useState<WorkspaceProject[]>([]);
  const [loading, setLoading] = useState(false);

  const addProjectToWorkspace = useCallback(async (project: any, workspaceId: string, projectId?: string) => {
    if (!user) {
      toast.error('User not authenticated');
      return { success: false };
    }

    setLoading(true);
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

        if (result) {
          console.log('Project updated:', project.name);
        }
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

        if (result) {
          console.log('New project created:', project.name);
        }
      }

      if (result) {
        // Update local state
        setWorkspaceProjects(prev => {
          const filtered = prev.filter(p => p.id !== result.id);
          return [...filtered, result];
        });

        return { success: true, projectId: result.id };
      } else {
        toast.error('Error saving project');
        return { success: false };
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProjectName = useCallback(async (projectId: string, newName: string) => {
    if (!user) {
      toast.error('User not authenticated');
      return false;
    }

    setLoading(true);
    try {
      await projectService.update(projectId, { name: newName }, user.id);
      setWorkspaceProjects(prev => 
        prev.map(p => p.id === projectId ? { ...p, name: newName } : p)
      );
      toast.success('Project name updated!');
      return true;
    } catch (err: any) {
      console.error('Error updating project name in workspace:', err);
      toast.error('Error updating project name');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteProject = useCallback(async (projectId: string) => {
    if (!user) {
      toast.error('User not authenticated');
      return false;
    }

    setLoading(true);
    try {
      const success = await projectService.delete(projectId, user.id);
      
      if (success) {
        setWorkspaceProjects(prev => prev.filter(p => p.id !== projectId));
        toast.success('Project deleted successfully!');
        return true;
      } else {
        toast.error('Error deleting project');
        return false;
      }
    } catch (err: any) {
      console.error('Error deleting project from workspace:', err);
      toast.error('Error deleting project');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadProjects = useCallback(async () => {
    if (!user) {
      setWorkspaceProjects([]);
      return;
    }

    setLoading(true);
    try {
      const data = await projectService.getByUserId(user.id);
      setWorkspaceProjects(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getWorkspaceProjects = useCallback((workspaceId: string) => {
    return workspaceProjects.filter(p => p.workspace_id === workspaceId);
  }, [workspaceProjects]);

  const loadProject = useCallback((projectId: string) => {
    const project = workspaceProjects.find(p => p.id === projectId);
    return project ? project.project_data : null;
  }, [workspaceProjects]);

  return {
    workspaceProjects,
    addProjectToWorkspace,
    updateProjectName,
    deleteProject,
    loadProjects,
    getWorkspaceProjects,
    loadProject,
    loading
  };
};
