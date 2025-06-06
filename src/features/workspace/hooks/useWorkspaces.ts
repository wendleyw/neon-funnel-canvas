import { useState, useCallback, useRef } from 'react';
import { workspaceService } from '../../../services/workspaceService';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'sonner';
import { Database } from '../../../integrations/supabase/types';

type Workspace = Database['public']['Tables']['workspaces']['Row'];

export const useWorkspaces = () => {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false); // Flag to prevent multiple simultaneous calls
  const lastLoadedUserId = useRef<string | null>(null); // Control by user
  const isInitializedRef = useRef(false); // Initialization control

  const createWorkspace = useCallback(async (name: string, description?: string) => {
    if (!user) {
      toast.error('User not authenticated');
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
        toast.success('Workspace created successfully!');
        return newWorkspace;
      } else {
        toast.error('Error creating workspace');
        return null;
      }
    } catch (error) {
      console.error('Error creating workspace:', error);
      toast.error('Error creating workspace');
      return null;
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
        toast.success('Workspace deleted successfully!');
        return true;
      } else {
        toast.error('Error deleting workspace');
        return false;
      }
    } catch (error) {
      console.error('Error deleting workspace:', error);
      toast.error('Error deleting workspace');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadWorkspaces = useCallback(async () => {
    if (!user) {
      setWorkspaces([]);
      lastLoadedUserId.current = null;
      isInitializedRef.current = false;
      return;
    }

    // Robust checks to prevent multiple calls
    if (loadingRef.current) {
      console.log('⏳ LoadWorkspaces is already running, skipping...');
      return;
    }

    // If already loaded for this user, don't load again
    if (lastLoadedUserId.current === user.id && isInitializedRef.current) {
      console.log('✅ Workspaces already loaded for this user');
      return;
    }

    // Check if user has changed
    if (lastLoadedUserId.current !== user.id) {
      console.log('🔄 User changed, resetting workspaces state');
      setWorkspaces([]);
      isInitializedRef.current = false;
    }

    loadingRef.current = true;
    setLoading(true);
    
    try {
      const data = await workspaceService.getByUserId(user.id);
      setWorkspaces(data);
      lastLoadedUserId.current = user.id;
      isInitializedRef.current = true;
      console.log(`✅ Workspaces loaded: ${data.length} found`);
    } catch (error) {
      console.error('❌ Error loading workspaces:', error);
      toast.error('Error loading workspaces');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [user]);

  // Function to force reload (for special cases)
  const forceReloadWorkspaces = useCallback(async () => {
    isInitializedRef.current = false;
    lastLoadedUserId.current = null;
    await loadWorkspaces();
  }, [loadWorkspaces]);

  return {
    workspaces,
    createWorkspace,
    deleteWorkspace,
    loadWorkspaces,
    forceReloadWorkspaces,
    loading
  };
};
