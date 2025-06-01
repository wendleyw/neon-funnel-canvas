
import { useState, useCallback, useEffect } from 'react';
import { Workspace, WorkspaceProject } from '../types/workspace';
import { FunnelProject } from '../types/funnel';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export const useWorkspace = () => {
  const { user } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspaceProjects, setWorkspaceProjects] = useState<WorkspaceProject[]>([]);

  const createWorkspace = useCallback(async (name: string, description?: string) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return null;
    }

    const newWorkspace: Workspace = {
      id: `workspace-${Date.now()}`,
      name,
      description,
      projects: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      // Salvar no Supabase (usando localStorage como fallback até termos tabelas no Supabase)
      const savedWorkspaces = JSON.parse(localStorage.getItem(`funnel-workspaces-${user.id}`) || '[]');
      savedWorkspaces.push(newWorkspace);
      localStorage.setItem(`funnel-workspaces-${user.id}`, JSON.stringify(savedWorkspaces));
      
      setWorkspaces(prev => [...prev, newWorkspace]);
      toast.success('Workspace criado com sucesso!');
      
      return newWorkspace;
    } catch (error) {
      console.error('Erro ao criar workspace:', error);
      toast.error('Erro ao criar workspace');
      return null;
    }
  }, [user]);

  const deleteWorkspace = useCallback(async (workspaceId: string) => {
    if (!user) return;

    try {
      setWorkspaces(prev => prev.filter(w => w.id !== workspaceId));
      
      // Remover do localStorage
      const savedWorkspaces = JSON.parse(localStorage.getItem(`funnel-workspaces-${user.id}`) || '[]');
      const updatedWorkspaces = savedWorkspaces.filter((w: Workspace) => w.id !== workspaceId);
      localStorage.setItem(`funnel-workspaces-${user.id}`, JSON.stringify(updatedWorkspaces));
      
      // Remover projetos associados
      const savedProjects = JSON.parse(localStorage.getItem(`funnel-projects-${user.id}`) || '[]');
      const updatedProjects = savedProjects.filter((p: WorkspaceProject) => p.workspaceId !== workspaceId);
      localStorage.setItem(`funnel-projects-${user.id}`, JSON.stringify(updatedProjects));
      setWorkspaceProjects(updatedProjects);
      
      // Se workspace atual foi deletado, limpar
      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(null);
      }
      
      toast.success('Workspace deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar workspace:', error);
      toast.error('Erro ao deletar workspace');
    }
  }, [user, currentWorkspace]);

  const addProjectToWorkspace = useCallback(async (project: FunnelProject, workspaceId: string) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      const workspaceProject: WorkspaceProject = {
        id: project.id,
        name: project.name,
        workspaceId,
        componentsCount: project.components.length,
        connectionsCount: project.connections.length,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      };

      // Salvar o projeto completo
      localStorage.setItem(`funnel-project-${project.id}-${user.id}`, JSON.stringify(project));
      
      // Atualizar lista de projetos do workspace
      const savedProjects = JSON.parse(localStorage.getItem(`funnel-projects-${user.id}`) || '[]');
      const updatedProjects = [...savedProjects.filter((p: WorkspaceProject) => p.id !== project.id), workspaceProject];
      localStorage.setItem(`funnel-projects-${user.id}`, JSON.stringify(updatedProjects));
      setWorkspaceProjects(updatedProjects);
      
      // Atualizar workspace para incluir este projeto
      const savedWorkspaces = JSON.parse(localStorage.getItem(`funnel-workspaces-${user.id}`) || '[]');
      const updatedWorkspaces = savedWorkspaces.map((w: Workspace) => 
        w.id === workspaceId 
          ? { ...w, projects: [...w.projects.filter(id => id !== project.id), project.id], updatedAt: new Date().toISOString() }
          : w
      );
      localStorage.setItem(`funnel-workspaces-${user.id}`, JSON.stringify(updatedWorkspaces));
      setWorkspaces(updatedWorkspaces);
      
      toast.success('Projeto salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      toast.error('Erro ao salvar projeto');
    }
  }, [user]);

  const loadWorkspaces = useCallback(async () => {
    if (!user) {
      setWorkspaces([]);
      setWorkspaceProjects([]);
      return;
    }

    try {
      const savedWorkspaces = JSON.parse(localStorage.getItem(`funnel-workspaces-${user.id}`) || '[]');
      const savedProjects = JSON.parse(localStorage.getItem(`funnel-projects-${user.id}`) || '[]');
      
      setWorkspaces(savedWorkspaces);
      setWorkspaceProjects(savedProjects);
    } catch (error) {
      console.error('Erro ao carregar workspaces:', error);
      toast.error('Erro ao carregar workspaces');
    }
  }, [user]);

  const getWorkspaceProjects = useCallback((workspaceId: string) => {
    return workspaceProjects.filter(p => p.workspaceId === workspaceId);
  }, [workspaceProjects]);

  const loadProject = useCallback((projectId: string) => {
    if (!user) return null;
    
    try {
      const projectData = localStorage.getItem(`funnel-project-${projectId}-${user.id}`);
      if (projectData) {
        return JSON.parse(projectData);
      }
      return null;
    } catch (error) {
      console.error('Erro ao carregar projeto:', error);
      toast.error('Erro ao carregar projeto');
      return null;
    }
  }, [user]);

  // Carregar dados quando usuário mudar
  useEffect(() => {
    if (user) {
      loadWorkspaces();
    } else {
      setWorkspaces([]);
      setWorkspaceProjects([]);
      setCurrentWorkspace(null);
    }
  }, [user, loadWorkspaces]);

  return {
    currentWorkspace,
    setCurrentWorkspace,
    workspaces,
    workspaceProjects,
    createWorkspace,
    deleteWorkspace,
    addProjectToWorkspace,
    loadWorkspaces,
    getWorkspaceProjects,
    loadProject
  };
};
