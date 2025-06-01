
import { useState, useCallback } from 'react';
import { Workspace, WorkspaceProject } from '../types/workspace';
import { FunnelProject } from '../types/funnel';

export const useWorkspace = () => {
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspaceProjects, setWorkspaceProjects] = useState<WorkspaceProject[]>([]);

  const createWorkspace = useCallback((name: string, description?: string) => {
    const newWorkspace: Workspace = {
      id: `workspace-${Date.now()}`,
      name,
      description,
      projects: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setWorkspaces(prev => [...prev, newWorkspace]);
    
    // Save to localStorage
    const savedWorkspaces = JSON.parse(localStorage.getItem('funnel-workspaces') || '[]');
    savedWorkspaces.push(newWorkspace);
    localStorage.setItem('funnel-workspaces', JSON.stringify(savedWorkspaces));
    
    return newWorkspace;
  }, []);

  const deleteWorkspace = useCallback((workspaceId: string) => {
    setWorkspaces(prev => prev.filter(w => w.id !== workspaceId));
    
    // Remove from localStorage
    const savedWorkspaces = JSON.parse(localStorage.getItem('funnel-workspaces') || '[]');
    const updatedWorkspaces = savedWorkspaces.filter((w: Workspace) => w.id !== workspaceId);
    localStorage.setItem('funnel-workspaces', JSON.stringify(updatedWorkspaces));
    
    // If current workspace is deleted, clear it
    if (currentWorkspace?.id === workspaceId) {
      setCurrentWorkspace(null);
    }
  }, [currentWorkspace]);

  const addProjectToWorkspace = useCallback((project: FunnelProject, workspaceId: string) => {
    const workspaceProject: WorkspaceProject = {
      id: project.id,
      name: project.name,
      workspaceId,
      componentsCount: project.components.length,
      connectionsCount: project.connections.length,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    };

    setWorkspaceProjects(prev => [...prev.filter(p => p.id !== project.id), workspaceProject]);
    
    // Update workspace to include this project
    setWorkspaces(prev => prev.map(w => 
      w.id === workspaceId 
        ? { ...w, projects: [...w.projects.filter(id => id !== project.id), project.id], updatedAt: new Date().toISOString() }
        : w
    ));
  }, []);

  const loadWorkspaces = useCallback(() => {
    const savedWorkspaces = JSON.parse(localStorage.getItem('funnel-workspaces') || '[]');
    setWorkspaces(savedWorkspaces);
  }, []);

  const getWorkspaceProjects = useCallback((workspaceId: string) => {
    return workspaceProjects.filter(p => p.workspaceId === workspaceId);
  }, [workspaceProjects]);

  return {
    currentWorkspace,
    setCurrentWorkspace,
    workspaces,
    workspaceProjects,
    createWorkspace,
    deleteWorkspace,
    addProjectToWorkspace,
    loadWorkspaces,
    getWorkspaceProjects
  };
};
