
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Database } from '../../../integrations/supabase/types';

type Workspace = Database['public']['Tables']['workspaces']['Row'];

export const useWorkspacePersistence = () => {
  const { user } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);

  const setCurrentWorkspaceWithPersistence = useCallback((workspace: Workspace | null) => {
    console.log('Setting current workspace:', workspace?.name || 'null');
    setCurrentWorkspace(workspace);
    
    if (user && workspace) {
      localStorage.setItem(`current-workspace-${user.id}`, JSON.stringify(workspace));
    } else if (user) {
      localStorage.removeItem(`current-workspace-${user.id}`);
    }
  }, [user]);

  const clearOldLocalStorageWorkspaces = useCallback(() => {
    if (!user) return;
    
    try {
      const savedCurrentWorkspace = localStorage.getItem(`current-workspace-${user.id}`);
      if (savedCurrentWorkspace) {
        const workspace = JSON.parse(savedCurrentWorkspace);
        if (workspace.id && !workspace.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
          console.log('Removing old workspace format from localStorage');
          localStorage.removeItem(`current-workspace-${user.id}`);
        }
      }
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
      localStorage.removeItem(`current-workspace-${user.id}`);
    }
  }, [user]);

  const loadSavedWorkspace = useCallback((workspaces: Workspace[]) => {
    if (!user || workspaces.length === 0) return;

    try {
      const savedCurrentWorkspace = localStorage.getItem(`current-workspace-${user.id}`);
      if (savedCurrentWorkspace) {
        const workspace = JSON.parse(savedCurrentWorkspace);
        const existingWorkspace = workspaces.find(w => w.id === workspace.id);
        if (existingWorkspace) {
          console.log('Loading saved current workspace:', existingWorkspace.name);
          setCurrentWorkspace(existingWorkspace);
        } else {
          console.log('Saved workspace not found in Supabase, clearing');
          localStorage.removeItem(`current-workspace-${user.id}`);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar workspace atual:', error);
      localStorage.removeItem(`current-workspace-${user.id}`);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      clearOldLocalStorageWorkspaces();
    } else {
      setCurrentWorkspace(null);
    }
  }, [user, clearOldLocalStorageWorkspaces]);

  return {
    currentWorkspace,
    setCurrentWorkspace: setCurrentWorkspaceWithPersistence,
    clearOldLocalStorageWorkspaces,
    loadSavedWorkspace
  };
};
