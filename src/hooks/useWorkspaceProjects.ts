
import { useState, useCallback } from 'react';
import { projectService } from '../services/projectService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Database } from '../integrations/supabase/types';

type WorkspaceProject = Database['public']['Tables']['workspace_projects']['Row'];

export const useWorkspaceProjects = () => {
  const { user } = useAuth();
  const [workspaceProjects, setWorkspaceProjects] = useState<WorkspaceProject[]>([]);
  const [loading, setLoading] = useState(false);

  const addProjectToWorkspace = useCallback(async (project: any, workspaceId: string, projectId?: string) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return { success: false };
    }

    setLoading(true);
    try {
      let result;
      
      if (projectId) {
        // Atualizar projeto existente
        result = await projectService.update(projectId, {
          name: project.name,
          project_data: project,
          components_count: project.components.length,
          connections_count: project.connections.length
        }, user.id);

        if (result) {
          console.log('Projeto atualizado:', project.name);
        }
      } else {
        // Criar novo projeto
        result = await projectService.create({
          name: project.name,
          workspace_id: workspaceId,
          project_data: project,
          components_count: project.components.length,
          connections_count: project.connections.length,
          user_id: user.id
        });

        if (result) {
          console.log('Novo projeto criado:', project.name);
        }
      }

      if (result) {
        // Atualizar o estado local
        setWorkspaceProjects(prev => {
          const filtered = prev.filter(p => p.id !== result.id);
          return [...filtered, result];
        });

        return { success: true, projectId: result.id };
      } else {
        toast.error('Erro ao salvar projeto');
        return { success: false };
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProjectName = useCallback(async (projectId: string, newName: string) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    setLoading(true);
    try {
      const result = await projectService.update(projectId, { name: newName }, user.id);
      
      if (result) {
        setWorkspaceProjects(prev => 
          prev.map(p => p.id === projectId ? result : p)
        );
        toast.success('Nome do projeto atualizado!');
        return true;
      } else {
        toast.error('Erro ao atualizar nome do projeto');
        return false;
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteProject = useCallback(async (projectId: string) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    setLoading(true);
    try {
      const success = await projectService.delete(projectId, user.id);
      
      if (success) {
        setWorkspaceProjects(prev => prev.filter(p => p.id !== projectId));
        toast.success('Projeto deletado com sucesso!');
        return true;
      } else {
        toast.error('Erro ao deletar projeto');
        return false;
      }
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
