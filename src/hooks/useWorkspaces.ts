
import { useState, useCallback } from 'react';
import { workspaceService } from '../services/workspaceService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Database } from '../integrations/supabase/types';

type Workspace = Database['public']['Tables']['workspaces']['Row'];

export const useWorkspaces = () => {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);

  const createWorkspace = useCallback(async (name: string, description?: string) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return null;
    }

    setLoading(true);
    try {
      const newWorkspace = await workspaceService.create({
        name,
        description,
        user_id: user.id
      });

      if (newWorkspace) {
        setWorkspaces(prev => [...prev, newWorkspace]);
        toast.success('Workspace criado com sucesso!');
        return newWorkspace;
      } else {
        toast.error('Erro ao criar workspace');
        return null;
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteWorkspace = useCallback(async (workspaceId: string) => {
    if (!user) return false;

    setLoading(true);
    try {
      const success = await workspaceService.delete(workspaceId);
      
      if (success) {
        setWorkspaces(prev => prev.filter(w => w.id !== workspaceId));
        toast.success('Workspace deletado com sucesso!');
        return true;
      } else {
        toast.error('Erro ao deletar workspace');
        return false;
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadWorkspaces = useCallback(async () => {
    if (!user) {
      setWorkspaces([]);
      return;
    }

    setLoading(true);
    try {
      const data = await workspaceService.getByUserId(user.id);
      setWorkspaces(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    workspaces,
    createWorkspace,
    deleteWorkspace,
    loadWorkspaces,
    loading
  };
};
