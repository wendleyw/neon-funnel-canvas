
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Database } from '../integrations/supabase/types';

type Workspace = Database['public']['Tables']['workspaces']['Row'];
type WorkspaceInsert = Database['public']['Tables']['workspaces']['Insert'];
type WorkspaceProject = Database['public']['Tables']['workspace_projects']['Row'];
type WorkspaceProjectInsert = Database['public']['Tables']['workspace_projects']['Insert'];

export const useSupabaseWorkspace = () => {
  const { user } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspaceProjects, setWorkspaceProjects] = useState<WorkspaceProject[]>([]);
  const [loading, setLoading] = useState(false);

  const createWorkspace = useCallback(async (name: string, description?: string) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return null;
    }

    setLoading(true);
    try {
      const newWorkspace: WorkspaceInsert = {
        name,
        description,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('workspaces')
        .insert(newWorkspace)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar workspace:', error);
        toast.error('Erro ao criar workspace');
        return null;
      }

      setWorkspaces(prev => [...prev, data]);
      toast.success('Workspace criado com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao criar workspace:', error);
      toast.error('Erro ao criar workspace');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteWorkspace = useCallback(async (workspaceId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', workspaceId);

      if (error) {
        console.error('Erro ao deletar workspace:', error);
        toast.error('Erro ao deletar workspace');
        return;
      }

      setWorkspaces(prev => prev.filter(w => w.id !== workspaceId));
      setWorkspaceProjects(prev => prev.filter(p => p.workspace_id !== workspaceId));
      
      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(null);
        localStorage.removeItem(`current-workspace-${user.id}`);
      }
      
      toast.success('Workspace deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar workspace:', error);
      toast.error('Erro ao deletar workspace');
    } finally {
      setLoading(false);
    }
  }, [user, currentWorkspace]);

  const addProjectToWorkspace = useCallback(async (project: any, workspaceId: string) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    setLoading(true);
    try {
      const workspaceProject: WorkspaceProjectInsert = {
        name: project.name,
        workspace_id: workspaceId,
        project_data: project,
        components_count: project.components.length,
        connections_count: project.connections.length,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('workspace_projects')
        .upsert(workspaceProject, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar projeto:', error);
        toast.error('Erro ao salvar projeto');
        return false;
      }

      setWorkspaceProjects(prev => {
        const filtered = prev.filter(p => p.id !== data.id);
        return [...filtered, data];
      });

      return true;
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      toast.error('Erro ao salvar projeto');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadWorkspaces = useCallback(async () => {
    if (!user) {
      setWorkspaces([]);
      setWorkspaceProjects([]);
      return;
    }

    setLoading(true);
    try {
      const { data: workspacesData, error: workspacesError } = await supabase
        .from('workspaces')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (workspacesError) {
        console.error('Erro ao carregar workspaces:', workspacesError);
        toast.error('Erro ao carregar workspaces');
        return;
      }

      const { data: projectsData, error: projectsError } = await supabase
        .from('workspace_projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (projectsError) {
        console.error('Erro ao carregar projetos:', projectsError);
        toast.error('Erro ao carregar projetos');
        return;
      }

      setWorkspaces(workspacesData || []);
      setWorkspaceProjects(projectsData || []);
    } catch (error) {
      console.error('Erro ao carregar workspaces:', error);
      toast.error('Erro ao carregar workspaces');
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

  const setCurrentWorkspaceWithPersistence = useCallback((workspace: Workspace | null) => {
    console.log('Setting current workspace:', workspace?.name || 'null');
    setCurrentWorkspace(workspace);
    
    if (user && workspace) {
      localStorage.setItem(`current-workspace-${user.id}`, JSON.stringify(workspace));
    } else if (user) {
      localStorage.removeItem(`current-workspace-${user.id}`);
    }
  }, [user]);

  // Carregar dados quando usuário mudar
  useEffect(() => {
    if (user) {
      loadWorkspaces();
      
      // Tentar carregar workspace atual salvo
      try {
        const savedCurrentWorkspace = localStorage.getItem(`current-workspace-${user.id}`);
        if (savedCurrentWorkspace) {
          const workspace = JSON.parse(savedCurrentWorkspace);
          console.log('Loading saved current workspace:', workspace.name);
          setCurrentWorkspace(workspace);
        }
      } catch (error) {
        console.error('Erro ao carregar workspace atual:', error);
      }
    } else {
      setWorkspaces([]);
      setWorkspaceProjects([]);
      setCurrentWorkspace(null);
    }
  }, [user, loadWorkspaces]);

  return {
    currentWorkspace,
    setCurrentWorkspace: setCurrentWorkspaceWithPersistence,
    workspaces,
    workspaceProjects,
    createWorkspace,
    deleteWorkspace,
    addProjectToWorkspace,
    loadWorkspaces,
    getWorkspaceProjects,
    loadProject,
    loading
  };
};
