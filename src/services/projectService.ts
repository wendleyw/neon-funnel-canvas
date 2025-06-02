
import { supabase } from '../integrations/supabase/client';
import { Database } from '../integrations/supabase/types';

type WorkspaceProject = Database['public']['Tables']['workspace_projects']['Row'];
type WorkspaceProjectInsert = Database['public']['Tables']['workspace_projects']['Insert'];

export const projectService = {
  async create(project: WorkspaceProjectInsert): Promise<WorkspaceProject | null> {
    try {
      const { data, error } = await supabase
        .from('workspace_projects')
        .insert(project)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar projeto:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      return null;
    }
  },

  async update(projectId: string, updates: Partial<WorkspaceProjectInsert>, userId: string): Promise<WorkspaceProject | null> {
    try {
      const { data, error } = await supabase
        .from('workspace_projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar projeto:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      return null;
    }
  },

  async delete(projectId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('workspace_projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', userId);

      if (error) {
        console.error('Erro ao deletar projeto:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
      return false;
    }
  },

  async getByUserId(userId: string): Promise<WorkspaceProject[]> {
    try {
      const { data, error } = await supabase
        .from('workspace_projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar projetos:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      return [];
    }
  },

  async getByWorkspaceId(workspaceId: string): Promise<WorkspaceProject[]> {
    try {
      const { data, error } = await supabase
        .from('workspace_projects')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar projetos do workspace:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao carregar projetos do workspace:', error);
      return [];
    }
  }
};
