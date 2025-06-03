import { useState, useCallback, useRef, useMemo } from 'react';
import { projectService } from '../services/projectService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Database } from '../integrations/supabase/types';
import { useDebounceProjectSave } from './useDebounceProjectSave';

type WorkspaceProject = Database['public']['Tables']['workspace_projects']['Row'];

export const useOptimizedWorkspaceProjects = () => {
  const { user } = useAuth();
  const [workspaceProjects, setWorkspaceProjects] = useState<WorkspaceProject[]>([]);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef<Map<string, WorkspaceProject>>(new Map());
  const lastFetchRef = useRef<number>(0);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  const currentWorkspaceIdRef = useRef<string>('');
  const currentProjectIdRef = useRef<string | undefined>();

  // Cache local para evitar refetch desnecessário
  const getCachedProject = useCallback((projectId: string): WorkspaceProject | null => {
    return cacheRef.current.get(projectId) || null;
  }, []);

  const setCachedProject = useCallback((project: WorkspaceProject) => {
    cacheRef.current.set(project.id, project);
  }, []);

  // Operação de salvamento otimizada com debounce
  const saveProjectOptimized = useCallback(async (project: any) => {
    if (!user) {
      return { success: false };
    }

    const workspaceId = currentWorkspaceIdRef.current;
    const projectId = currentProjectIdRef.current;

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
      }

      if (result) {
        // Atualizar cache local
        setCachedProject(result);
        
        // Atualizar estado local
        setWorkspaceProjects(prev => {
          const filtered = prev.filter(p => p.id !== result.id);
          return [...filtered, result];
        });

        // Atualizar project ID se for um novo projeto
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

  // Hook de debounce para auto-save
  const { debouncedSave, forceSave, cancelSave } = useDebounceProjectSave({
    onSave: saveProjectOptimized,
    delay: 5000 // 5 segundos de delay para auto-save
  });

  const addProjectToWorkspace = useCallback(async (project: any, workspaceId: string, projectId?: string, isAutoSave: boolean = false) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return { success: false };
    }

    // Atualizar referências para o save otimizado
    currentWorkspaceIdRef.current = workspaceId;
    currentProjectIdRef.current = projectId;

    // Se for auto-save, usar debounced save
    if (isAutoSave) {
      return await debouncedSave(project);
    }

    // Se for save manual, forçar save imediato
    setLoading(true);
    try {
      const result = await forceSave(project);
      if (result.success) {
        toast.success('Projeto salvo com sucesso!');
      } else {
        toast.error('Erro ao salvar projeto');
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, [user, debouncedSave, forceSave]);

  const updateProjectName = useCallback(async (projectId: string, newName: string) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    // Atualizar cache local primeiro (otimistic update)
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
        toast.success('Nome do projeto atualizado!');
        return true;
      } else {
        // Reverter optimistic update em caso de erro
        if (cachedProject) {
          setCachedProject(cachedProject);
          setWorkspaceProjects(prev => 
            prev.map(p => p.id === projectId ? cachedProject : p)
          );
        }
        toast.error('Erro ao atualizar nome do projeto');
        return false;
      }
    } finally {
      setLoading(false);
    }
  }, [user, getCachedProject, setCachedProject]);

  const deleteProject = useCallback(async (projectId: string) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    // Cancelar qualquer save pendente
    cancelSave();

    setLoading(true);
    try {
      const success = await projectService.delete(projectId, user.id);
      
      if (success) {
        // Remover do cache
        cacheRef.current.delete(projectId);
        
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
  }, [user, cancelSave]);

  const loadProjects = useCallback(async (forceRefresh: boolean = false) => {
    if (!user) {
      setWorkspaceProjects([]);
      return;
    }

    const now = Date.now();
    const shouldFetch = forceRefresh || (now - lastFetchRef.current > CACHE_DURATION);

    if (!shouldFetch && workspaceProjects.length > 0) {
      console.log('📦 Using cached projects');
      return;
    }

    setLoading(true);
    try {
      console.log('🔄 Fetching projects from database');
      const data = await projectService.getByUserId(user.id);
      
      // Atualizar cache
      data.forEach(project => setCachedProject(project));
      
      setWorkspaceProjects(data);
      lastFetchRef.current = now;
    } finally {
      setLoading(false);
    }
  }, [user, workspaceProjects.length, setCachedProject]);

  const getWorkspaceProjects = useCallback((workspaceId: string) => {
    return workspaceProjects.filter(p => p.workspace_id === workspaceId);
  }, [workspaceProjects]);

  const loadProject = useCallback((projectId: string) => {
    // Tentar cache primeiro
    const cached = getCachedProject(projectId);
    if (cached) {
      return cached.project_data;
    }

    // Fallback para array de projetos
    const project = workspaceProjects.find(p => p.id === projectId);
    return project ? project.project_data : null;
  }, [workspaceProjects, getCachedProject]);

  // Estatísticas do cache para debugging
  const cacheStats = useMemo(() => ({
    cacheSize: cacheRef.current.size,
    lastFetch: new Date(lastFetchRef.current).toLocaleTimeString(),
    cacheAge: Math.round((Date.now() - lastFetchRef.current) / 1000 / 60), // minutos
  }), [workspaceProjects]);

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
    cancelSave, // Para cancelar saves pendentes quando necessário
  };
}; 