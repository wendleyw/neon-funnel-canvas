import { supabase } from '../integrations/supabase/client';
import { Database } from '../integrations/supabase/types';

type Workspace = Database['public']['Tables']['workspaces']['Row'];
type WorkspaceInsert = Database['public']['Tables']['workspaces']['Insert'];

export const workspaceService = {
  async create(workspace: WorkspaceInsert): Promise<Workspace | null> {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .insert(workspace)
        .select()
        .single();

      if (error) {
        console.error('Error creating workspace:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating workspace:', error);
      return null;
    }
  },

  async delete(workspaceId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', workspaceId);

      if (error) {
        console.error('Error deleting workspace:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting workspace:', error);
      return false;
    }
  },

  async getByUserId(userId: string): Promise<Workspace[]> {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading workspaces:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error loading workspaces:', error);
      return [];
    }
  }
};
