import { ComponentTemplate } from '../types/funnel';
import { MARKETING_COMPONENT_TEMPLATES } from '../data/componentTemplates';
import { socialMediaTemplates } from '../features/social-media/data/templates';
import { digitalLaunchTemplates } from '../features/digital-launch/data/templates';
import { pageTemplates } from '../data/pageTemplates';
import { logger } from './logger';
import { supabase } from '../integrations/supabase/client';

// Note: This file uses the same Supabase client to avoid Multiple GoTrueClient instances warning
// The warning occurs in development due to module reloading but should not affect production

// Database types based on your schema
export interface ContentItem {
  id: string;
  type: 'source' | 'page' | 'action';
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'draft' | 'published';
  usage: number;
  rating: number;
  tags: string[];
  icon: string;
  color: string;
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by: string;
  is_premium: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'premium';
  status: 'active' | 'inactive' | 'pending';
  join_date: string;
  last_active: string;
  funnels_created: number;
  onboarding_completed: boolean;
  onboarding_data?: Record<string, any>;
}

export interface FeedbackItem {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  category: 'bug' | 'feature' | 'improvement' | 'other';
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  resolved_at?: string;
  admin_response?: string;
}

export interface OnboardingResponse {
  id: string;
  user_id: string;
  question_id: string;
  question_category: string;
  answer: any;
  created_at: string;
}

// Content Management Functions - Enhanced with full CRUD operations
export const contentService = {
  // Get all content items with optional filtering
  async getContent(filters?: {
    type?: string;
    category?: string;
    status?: string;
    search?: string;
  }) {
    let query = supabase
      .from('content_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }
    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    return query;
  },

  // Create new content item - Compatível com ContentItem
  async createContent(item: {
    type: 'source' | 'page' | 'action';
    name: string;
    description?: string;
    category?: string;
    status?: 'active' | 'inactive' | 'draft' | 'published';
    usage?: number;
    rating?: number;
    tags?: string[];
    icon?: string;
    color?: string;
    config?: Record<string, any>;
    created_by: string;
    is_premium?: boolean;
  }) {
    try {
      const insertData = {
        type: item.type,
        name: item.name,
        description: item.description || null,
        category: item.category || null,
        status: item.status || 'draft',
        usage: item.usage || 0,
        rating: item.rating || 0,
        tags: item.tags || [],
        icon: item.icon || null,
        color: item.color || null,
        config: item.config || {},
        created_by: item.created_by,
        is_premium: item.is_premium || false
      };

      logger.log('📤 [ContentService] Creating content with data:', insertData);

      const { data: result, error } = await supabase
        .from('content_items')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create content: ${error.message}`);
      }

      return { data: result, error: null };
    } catch (error: any) {
      logger.error('❌ Error creating content:', error);
      return { data: null, error };
    }
  },

  // Update existing content item - Só campos permitidos
  async updateContent(id: string, updates: {
    name?: string;
    description?: string;
    category?: string;
    status?: 'active' | 'inactive' | 'draft' | 'published';
    tags?: string[];
    icon?: string;
    color?: string;
    config?: Record<string, any>;
    is_premium?: boolean;
  }) {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      logger.log('📝 [ContentService] Updating content with data:', { id, updateData });

      const { data: result, error } = await supabase
        .from('content_items')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update content: ${error.message}`);
      }

      return { data: result, error: null };
    } catch (error: any) {
      logger.error('❌ Error updating content:', error);
      return { data: null, error };
    }
  },

  // Delete content item
  async deleteContent(id: string) {
    try {
      logger.log('🗑️ [ContentService] Deleting content:', id);

      // First get the item to return its name
      const { data: item, error: fetchError } = await supabase
        .from('content_items')
        .select('name')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw new Error(`Failed to fetch content for deletion: ${fetchError.message}`);
      }

      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete content: ${error.message}`);
      }

      const result = {
        success: true,
        message: `Template "${item?.name}" deleted successfully`,
        deletedCount: 1
      };

      logger.log('✅ Template deleted successfully:', item?.name);

      return { data: result, error: null };
    } catch (error: any) {
      logger.error('❌ Error deleting template:', error.message);
      return { data: null, error };
    }
  },

  // Enhanced operations for better error handling and validation
  async safeCreateContent(item: {
    type: 'source' | 'page' | 'action';
    name: string;
    description?: string;
    category?: string;
    status?: 'active' | 'inactive' | 'draft' | 'published';
    tags?: string[];
    icon?: string;
    color?: string;
    config?: Record<string, any>;
    created_by: string;
    is_premium?: boolean;
  }) {
    try {
      // Validate required fields
      if (!item.name?.trim()) {
        throw new Error('Template name is required');
      }
      if (!item.type || !['source', 'page', 'action'].includes(item.type)) {
        throw new Error('Valid template type is required');
      }

      const result = await this.createContent(item);
      logger.log('✅ Template created successfully:', result.data?.name);
      return result;
    } catch (error: any) {
      logger.error('❌ Error creating template:', error.message);
      throw error;
    }
  },

  async safeUpdateContent(id: string, updates: {
    name?: string;
    description?: string;
    category?: string;
    status?: 'active' | 'inactive' | 'draft' | 'published';
    tags?: string[];
    icon?: string;
    color?: string;
    config?: Record<string, any>;
    is_premium?: boolean;
  }) {
    try {
      // Validate ID
      if (!id?.trim()) {
        throw new Error('Template ID is required for update');
      }

      const result = await this.updateContent(id, updates);
      logger.log('✅ Template updated successfully:', result.data?.name);
      return result;
    } catch (error: any) {
      logger.error('❌ Error updating template:', error.message);
      throw error;
    }
  },

  async safeDeleteContent(id: string) {
    try {
      // Validate ID
      if (!id?.trim()) {
        throw new Error('Template ID is required for deletion');
      }

      // Check if it's a system template (can't be deleted)
      const { data: item } = await supabase
        .from('content_items')
        .select('created_by, name')
        .eq('id', id)
        .single();

      if (item?.created_by === null) {
        throw new Error('System templates cannot be deleted');
      }

      const result = await this.deleteContent(id);
      logger.log('✅ Template deleted successfully:', item?.name);
      return result;
    } catch (error: any) {
      logger.error('❌ Error deleting template:', error.message);
      throw error;
    }
  },

  // Increment usage counter
  async incrementUsage(id: string) {
    return supabase.rpc('increment_usage', { content_id: id });
  },

  // Get content analytics
  async getContentAnalytics() {
    const { data: stats } = await supabase
      .from('content_items')
      .select('type, status, usage')
      .then(result => ({
        data: result.data?.reduce((acc, item) => {
          acc.totalItems = (acc.totalItems || 0) + 1;
          acc.totalUsage = (acc.totalUsage || 0) + item.usage;
          acc.byType = acc.byType || {};
          acc.byType[item.type] = (acc.byType[item.type] || 0) + 1;
          acc.byStatus = acc.byStatus || {};
          acc.byStatus[item.status] = (acc.byStatus[item.status] || 0) + 1;
          return acc;
        }, {} as any)
      }));

    return { data: stats };
  },

  // Get content by type
  getContentByType: async (type: string) => {
    return await supabase
      .from('content_items')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });
  },

  // Analyze system vs database templates
  async analyzeSystem() {
    try {
      console.log('🔍 Analisando sistema completo (código + banco de dados)...');
      
      // 1. Análise dos templates no código
      const codeAnalysis = analyzeSystemTemplates();
      
      // 2. Análise do banco de dados atual
      const { data: dbTemplates } = await contentService.getContent();
      const allTemplates = dbTemplates || [];
      
      // Separar templates do sistema vs usuário
      const systemTemplates = allTemplates.filter(t => t.created_by === null);
      const userTemplates = allTemplates.filter(t => t.created_by !== null);
      
      // Estatísticas do banco de dados
      const dbByType = systemTemplates.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const dbUserByType = userTemplates.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // 3. Análise de classificação dos templates do código
      const codeByClassification = ALL_SYSTEM_TEMPLATES.reduce((acc, template) => {
        const classification = classifyTemplateForCRUD(template);
        acc[classification] = (acc[classification] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // 4. Cálculo de sincronização
      const totalCodeTemplates = ALL_SYSTEM_TEMPLATES.length;
      const totalDbSystemTemplates = systemTemplates.length;
      const syncPercentage = totalCodeTemplates > 0 
        ? Math.round((totalDbSystemTemplates / totalCodeTemplates) * 100) 
        : 0;
      
      console.log('📊 ANÁLISE COMPLETA:');
      console.log(`• Templates no código: ${totalCodeTemplates}`);
      console.log(`• Templates no banco (sistema): ${totalDbSystemTemplates}`);
      console.log(`• Templates no banco (usuário): ${userTemplates.length}`);
      console.log(`• Sincronização: ${syncPercentage}%`);
      
      console.log('\n🏷️ CLASSIFICAÇÃO DOS TEMPLATES NO CÓDIGO:');
      console.log(`• Sources: ${codeByClassification.source || 0}`);
      console.log(`• Pages: ${codeByClassification.page || 0}`);
      console.log(`• Actions: ${codeByClassification.action || 0}`);
      
      console.log('\n💾 TEMPLATES NO BANCO DE DADOS (SISTEMA):');
      console.log(`• Sources: ${dbByType.source || 0}`);
      console.log(`• Pages: ${dbByType.page || 0}`);
      console.log(`• Actions: ${dbByType.action || 0}`);
      
      // Retornar dados no formato esperado pelo TemplateContext
      const result = {
        data: {
          // Templates do sistema baseados no CÓDIGO (para referência)
          system: {
            total: totalCodeTemplates,
            byType: {
              source: codeByClassification.source || 0,
              page: codeByClassification.page || 0,
              action: codeByClassification.action || 0
            },
            byCategory: {} // Can be expanded if needed
          },
          
          // Templates no banco de dados (realidade atual)
          database: {
            system: {
              total: totalDbSystemTemplates,
              byType: {
                source: dbByType.source || 0,
                page: dbByType.page || 0,
                action: dbByType.action || 0
              }
            },
            user: {
              total: userTemplates.length,
              byType: {
                source: dbUserByType.source || 0,
                page: dbUserByType.page || 0,
                action: dbUserByType.action || 0
              }
            }
          },
          
          // Status de sincronização
          syncStatus: syncPercentage,
          needsSync: syncPercentage < 100,
          missingCount: Math.max(0, totalCodeTemplates - totalDbSystemTemplates)
        },
        error: null
      };
      
      console.log('✅ Análise completa realizada');
      return result;
      
    } catch (error) {
      console.error('❌ Erro na análise do sistema:', error);
      return {
        data: null,
        error: error
      };
    }
  },

  // Import all system templates, deleting old ones first
  async importAllSystemTemplates() {
    // 1. Delete all existing system templates
    const { error: deleteError } = await supabase.from('content_items').delete().is('created_by', null);
    if (deleteError) throw deleteError;
    
    // 2. Prepare new system templates
    const allSystemTemplates = [
      ...MARKETING_COMPONENT_TEMPLATES,
      ...socialMediaTemplates,
      ...digitalLaunchTemplates,
      ...pageTemplates
    ].map(t => templateToContentItem(t as ComponentTemplate));
    
    // 3. Insert new templates
    const { data, error: insertError } = await supabase.from('content_items').insert(allSystemTemplates).select();
    if (insertError) throw insertError;
    
    return { data };
  },
  
  // Sync templates by a specific type
  async syncTemplatesByType(type: 'source' | 'page' | 'action') {
    // 1. Delete existing system templates of this type
    const { error: deleteError } = await supabase.from('content_items').delete().is('created_by', null).eq('type', type);
    if (deleteError) throw deleteError;
    
    // 2. Prepare new templates of this type
    const templatesToInsert = [
      ...MARKETING_COMPONENT_TEMPLATES,
      ...socialMediaTemplates,
      ...digitalLaunchTemplates,
      ...pageTemplates
    ]
    .filter(t => classifyTemplate(t as ComponentTemplate) === type)
    .map(t => templateToContentItem(t as ComponentTemplate));
    
    // 3. Insert new templates
    if (templatesToInsert.length > 0) {
      const { data, error: insertError } = await supabase.from('content_items').insert(templatesToInsert).select();
      if (insertError) throw insertError;
      return { data };
    }
    
    return { data: [] };
  }
};

// Helper to classify template type
const classifyTemplate = (template: any): 'source' | 'page' | 'action' => {
  if (template.category?.includes('source')) return 'source';
  if (template.category === 'page' || template.type === 'page') return 'page';
  return 'action';
};

// Helper to convert ComponentTemplate to ContentItem for DB insertion
const templateToContentItem = (template: ComponentTemplate): Omit<ContentItem, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'usage' | 'rating'> => ({
  name: template.label,
  description: template.description,
  type: classifyTemplate(template),
  category: template.category,
  status: 'active',
  tags: template.tags || [],
  icon: typeof template.icon === 'string' ? template.icon : '?',
  color: template.color,
  config: template.defaultProps || {},
  is_premium: template.isPremium || false,
});

// User Management Functions
export const userService = {
  // Get all users with filtering
  async getUsers(filters?: {
    role?: string;
    status?: string;
    search?: string;
  }) {
    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.role && filters.role !== 'all') {
      query = query.eq('role', filters.role);
    }
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    return query;
  },

  // Update user role/status
  async updateUser(id: string, updates: Partial<AdminUser>) {
    return supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
  },

  // Get user analytics
  async getUserAnalytics() {
    const { data: users } = await supabase
      .from('profiles')
      .select('role, status, created_at');

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      data: {
        total: users?.length || 0,
        active: users?.filter(u => u.status === 'active').length || 0,
        premium: users?.filter(u => u.role === 'premium').length || 0,
        newThisMonth: users?.filter(u => new Date(u.created_at) > thirtyDaysAgo).length || 0,
        byRole: users?.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {}
      }
    };
  },

  // Get user activity data
  async getUserActivity(days = 30) {
    const { data } = await supabase
      .from('user_activity')
      .select('user_id, action, created_at')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    return { data };
  }
};

// Feedback Management Functions
export const feedbackService = {
  // Get all feedback with filtering
  async getFeedback(filters?: {
    status?: string;
    priority?: string;
    category?: string;
  }) {
    let query = supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.priority && filters.priority !== 'all') {
      query = query.eq('priority', filters.priority);
    }
    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    return query;
  },

  // Create new feedback
  async createFeedback(feedback: Omit<FeedbackItem, 'id' | 'created_at'>) {
    return supabase
      .from('feedback')
      .insert([{
        ...feedback,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
  },

  // Update feedback status
  async updateFeedback(id: string, updates: Partial<FeedbackItem>) {
    const updateData: any = { ...updates };
    
    if (updates.status === 'resolved' && !updates.resolved_at) {
      updateData.resolved_at = new Date().toISOString();
    }

    return supabase
      .from('feedback')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
  },

  // Get feedback analytics
  async getFeedbackAnalytics() {
    const { data: feedback } = await supabase
      .from('feedback')
      .select('status, priority, category, created_at');

    return {
      data: {
        total: feedback?.length || 0,
        pending: feedback?.filter(f => f.status === 'new').length || 0,
        resolved: feedback?.filter(f => f.status === 'resolved').length || 0,
        byCategory: feedback?.reduce((acc, f) => {
          acc[f.category] = (acc[f.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {},
        byPriority: feedback?.reduce((acc, f) => {
          acc[f.priority] = (acc[f.priority] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {}
      }
    };
  }
};

// Onboarding Management Functions
export const onboardingService = {
  // Save onboarding responses
  async saveOnboardingResponses(userId: string, responses: Array<{
    questionId: string;
    category: string;
    answer: any;
  }>) {
    const data = responses.map(response => ({
      user_id: userId,
      question_id: response.questionId,
      question_category: response.category,
      answer: response.answer,
      created_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('onboarding_responses')
      .insert(data);

    if (!error) {
      // Mark user as onboarding completed
      await supabase
        .from('profiles')
        .update({ 
          onboarding_completed: true,
          onboarding_data: responses.reduce((acc, r) => {
            acc[r.questionId] = r.answer;
            return acc;
          }, {} as Record<string, any>)
        })
        .eq('id', userId);
    }

    return { error };
  },

  // Get onboarding analytics
  async getOnboardingAnalytics() {
    const { data: responses } = await supabase
      .from('onboarding_responses')
      .select('question_id, question_category, answer');

    const { data: users } = await supabase
      .from('profiles')
      .select('onboarding_completed');

    return {
      data: {
        completionRate: users ? 
          (users.filter(u => u.onboarding_completed).length / users.length) * 100 : 0,
        responsesByCategory: responses?.reduce((acc, r) => {
          acc[r.question_category] = (acc[r.question_category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {},
        totalResponses: responses?.length || 0
      }
    };
  },

  // Get user onboarding data
  async getUserOnboardingData(userId: string) {
    return supabase
      .from('onboarding_responses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at');
  }
};

// Analytics Functions
export const analyticsService = {
  // Get dashboard stats
  async getDashboardStats() {
    const [contentStats, userStats, feedbackStats] = await Promise.all([
      contentService.getContentAnalytics(),
      userService.getUserAnalytics(),
      feedbackService.getFeedbackAnalytics()
    ]);

    return {
      content: contentStats.data,
      users: userStats.data,
      feedback: feedbackStats.data
    };
  },

  // Get system health metrics
  async getSystemHealth() {
    // You can extend this to check various system metrics
    return {
      data: {
        database: 'operational',
        api: 'operational',
        storage: 'operational',
        uptime: '99.9%',
        lastUpdated: new Date().toISOString()
      }
    };
  }
};

// Real-time subscriptions for admin panel
export const subscribeToAdminUpdates = (callback: (payload: any) => void) => {
  const subscription = supabase
    .channel('admin-updates')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'feedback' }, 
      callback
    )
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'profiles' }, 
      callback
    )
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'content_items' }, 
      callback
    )
    .subscribe();

  return subscription;
};

// Database setup SQL (for reference)
export const adminDatabaseSchema = `
-- Content Items Table
CREATE TABLE content_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('source', 'page', 'action')),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('active', 'inactive', 'draft', 'published')),
  usage INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  tags TEXT[],
  icon VARCHAR(50),
  color VARCHAR(7),
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  is_premium BOOLEAN DEFAULT FALSE
);

-- User Profiles Extension
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS funnels_created INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_data JSONB;

-- Feedback Table
CREATE TABLE feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  category VARCHAR(20) CHECK (category IN ('bug', 'feature', 'improvement', 'other')),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  admin_response TEXT
);

-- Onboarding Responses Table
CREATE TABLE onboarding_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  question_id VARCHAR(100) NOT NULL,
  question_category VARCHAR(50),
  answer JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Activity Table
CREATE TABLE user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(100) NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Functions
CREATE OR REPLACE FUNCTION increment_content_usage(content_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE content_items 
  SET usage = usage + 1, updated_at = NOW()
  WHERE id = content_id;
END;
$$ LANGUAGE plpgsql;

-- Indexes for performance
CREATE INDEX idx_content_items_type ON content_items(type);
CREATE INDEX idx_content_items_status ON content_items(status);
CREATE INDEX idx_content_items_usage ON content_items(usage DESC);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_priority ON feedback(priority);
CREATE INDEX idx_onboarding_user ON onboarding_responses(user_id);
CREATE INDEX idx_user_activity_user ON user_activity(user_id);
CREATE INDEX idx_user_activity_created ON user_activity(created_at DESC);

-- Row Level Security
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Admin access policies
CREATE POLICY "Admins can manage content" ON content_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can read active content" ON content_items
  FOR SELECT USING (status = 'active' OR status = 'published');
`;

// Combinar TODOS os templates do sistema (incluindo pageTemplates)
const ALL_SYSTEM_TEMPLATES = [
  ...MARKETING_COMPONENT_TEMPLATES,
  ...socialMediaTemplates,
  ...digitalLaunchTemplates,
  ...pageTemplates.map((page: any) => ({
    id: page.id,
    type: page.type,
    icon: '📄',
    label: page.label,
    color: page.color,
    category: page.category,
    title: page.label,
    description: page.description,
    tags: page.tags,
    defaultProps: {
      title: page.label,
      description: page.description,
      status: 'draft',
      properties: {
        pageType: page.type,
        category: page.category
      }
    }
  }))
];

// Função melhorada para análise de templates
export const analyzeSystemTemplates = () => {
  console.log('=== ANÁLISE COMPLETA DOS TEMPLATES ===');
  
  // Contar templates por arquivo
  console.log('\n📁 TEMPLATES POR ARQUIVO:');
  console.log(`• componentTemplates.ts: ${MARKETING_COMPONENT_TEMPLATES.length} templates`);
  console.log(`• social-media/templates.ts: ${socialMediaTemplates.length} templates`);
  console.log(`• digital-launch/templates.ts: ${digitalLaunchTemplates.length} templates`);
  console.log(`• pageTemplates.ts: ${pageTemplates.length} templates`);
  console.log(`• TOTAL NO SISTEMA: ${ALL_SYSTEM_TEMPLATES.length} templates`);
  
  // Contar por categorias do sistema principal
  const sources = MARKETING_COMPONENT_TEMPLATES.filter(t => 
    t.category?.includes('traffic') || 
    t.category?.includes('source') ||
    t.category?.includes('crm') ||
    t.category?.includes('other-sites') ||
    t.category?.includes('messaging') ||
    t.category?.includes('social') ||
    t.category?.includes('search')
  );
  
  const marketingPages = MARKETING_COMPONENT_TEMPLATES.filter(t => 
    t.category?.includes('page') || 
    t.category?.includes('lead-capture') ||
    t.category?.includes('sales-conversion')
  );
  
  const actions = MARKETING_COMPONENT_TEMPLATES.filter(t => 
    t.category?.includes('action') || 
    t.category?.includes('nurturing') ||
    t.category?.includes('content')
  );
  
  // Incluir templates de outras features
  const totalPages = marketingPages.length + socialMediaTemplates.length + pageTemplates.length;
  const totalActions = actions.length + digitalLaunchTemplates.length;
  
  console.log('\n📊 CONTAGEM POR TIPO:');
  console.log(`🌐 SOURCES: ${sources.length} (marketing components)`);
  console.log(`📄 PAGES: ${totalPages} (${marketingPages.length} marketing + ${socialMediaTemplates.length} social + ${pageTemplates.length} page templates)`);
  console.log(`⚡ ACTIONS: ${totalActions} (${actions.length} marketing + ${digitalLaunchTemplates.length} digital launch)`);
  
  // Detalhar sources
  console.log('\n🌐 DETALHAMENTO DOS SOURCES:');
  const sourceCategories = [...new Set(sources.map(t => t.category))];
  sourceCategories.forEach(cat => {
    const count = sources.filter(t => t.category === cat).length;
    console.log(`  • ${cat}: ${count} templates`);
  });
  
  // Detalhar pages
  console.log('\n📄 DETALHAMENTO DAS PAGES:');
  const pageCategories = [...new Set(marketingPages.map(t => t.category))];
  pageCategories.forEach(cat => {
    const count = marketingPages.filter(t => t.category === cat).length;
    console.log(`  • ${cat}: ${count} templates`);
  });
  console.log(`  • social-media: ${socialMediaTemplates.length} templates`);
  
  // Análise das page templates por categoria
  const pageTemplatesByCategory = pageTemplates.reduce((acc, page) => {
    acc[page.category] = (acc[page.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('  • PAGE TEMPLATES POR CATEGORIA:');
  Object.entries(pageTemplatesByCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      console.log(`    - ${category}: ${count} templates`);
    });
  
  // Detalhar actions
  console.log('\n⚡ DETALHAMENTO DAS ACTIONS:');
  const actionCategories = [...new Set(actions.map(t => t.category))];
  actionCategories.forEach(cat => {
    const count = actions.filter(t => t.category === cat).length;
    console.log(`  • ${cat}: ${count} templates`);
  });
  console.log(`  • digital-launch: ${digitalLaunchTemplates.length} templates`);
  
  return {
    total: ALL_SYSTEM_TEMPLATES.length,
    sources: sources.length,
    pages: totalPages,
    actions: totalActions,
    breakdown: {
      marketing: MARKETING_COMPONENT_TEMPLATES.length,
      socialMedia: socialMediaTemplates.length,
      digitalLaunch: digitalLaunchTemplates.length,
      pageTemplates: pageTemplates.length
    }
  };
};

// Enhanced template classification function for CRUD operations
const classifyTemplateForCRUD = (template: any): 'source' | 'page' | 'action' => {
  const category = template.category || '';
  const type = template.type || '';
  const label = template.label || '';
  
  console.log(`🔍 [Classify] Template: "${label}" | Category: "${category}" | Type: "${type}"`);
  
  // SOURCES - ALL traffic generation, acquisition channels, platforms where users come from
  if (
    category.startsWith('traffic-sources') || // Catches ALL traffic-sources subcategories
    category.includes('source') ||
    label.toLowerCase().includes('ads') ||
    label.toLowerCase().includes('organic') ||
    label.toLowerCase().includes('traffic') ||
    label.toLowerCase().includes('facebook ads') ||
    label.toLowerCase().includes('google ads') ||
    label.toLowerCase().includes('instagram ads') ||
    label.toLowerCase().includes('linkedin ads') ||
    label.toLowerCase().includes('tiktok ads') ||
    label.toLowerCase().includes('youtube ads') ||
    type.includes('traffic') ||
    type.includes('ads') ||
    type.includes('organic') ||
    type.includes('crm') ||
    type.includes('search') ||
    // Specific traffic source types
    type.includes('facebook-organic') ||
    type.includes('instagram-organic') ||
    type.includes('linkedin-organic') ||
    type.includes('pinterest-organic') ||
    type.includes('google-organic') ||
    type.includes('bing-organic') ||
    type.includes('youtube-organic') ||
    type.includes('all-search') ||
    // CRM and messaging platforms as traffic sources
    type.includes('-crm') ||
    type.includes('-site') ||
    type.includes('whatsapp-business') ||
    type.includes('telegram-marketing') ||
    type.includes('facebook-messenger') ||
    type.includes('slack-marketing') ||
    type.includes('sms-marketing') ||
    // Offline traffic sources
    type.includes('print-advertising') ||
    type.includes('tv-advertising') ||
    type.includes('radio-advertising') ||
    type.includes('billboard-advertising') ||
    type.includes('direct-mail') ||
    type.includes('event-marketing') ||
    type.includes('banner-advertising') ||
    // Business/professional sources
    type.includes('job-interview') ||
    type.includes('business-card') ||
    type.includes('meeting-networking') ||
    type.includes('workshop-seminar') ||
    type.includes('conference') ||
    type.includes('online-meeting') ||
    // Directory and referral sources
    type.includes('biz-directory') ||
    type.includes('career-site') ||
    type.includes('job-site') ||
    type.includes('referral-traffic') ||
    type.includes('direct-traffic') ||
    type.includes('affiliate-marketing')
  ) {
    console.log(`✅ [Classify] "${label}" classified as SOURCE`);
    return 'source';
  }
  
  // ACTIONS - automation, sequences, workflows, follow-ups, nurturing campaigns
  if (
    category.includes('action') ||
    category.includes('nurturing') ||
    category.includes('automation') ||
    category.includes('sequence') ||
    category.includes('workflow') ||
    category === 'digital-launch' || // Digital launch templates are automations
    label.toLowerCase().includes('sequence') ||
    label.toLowerCase().includes('automation') ||
    label.toLowerCase().includes('nurturing') ||
    label.toLowerCase().includes('workflow') ||
    label.toLowerCase().includes('email campaign') ||
    label.toLowerCase().includes('follow-up') ||
    label.toLowerCase().includes('launch') ||
    label.toLowerCase().includes('oferta') ||
    label.toLowerCase().includes('público-alvo') ||
    label.toLowerCase().includes('nutrição') ||
    label.toLowerCase().includes('pós-venda') ||
    label.toLowerCase().includes('análise') ||
    label.toLowerCase().includes('otimização') ||
    type.includes('sequence') ||
    type.includes('automation') ||
    type.includes('workflow') ||
    type.includes('launch') ||
    type.includes('offer') ||
    type.includes('target-audience') ||
    type.includes('nurturing') ||
    type.includes('post-sale') ||
    type.includes('analytics-optimization') ||
    type.includes('webinar-vsl') ||
    type.includes('checkout-upsell')
  ) {
    console.log(`✅ [Classify] "${label}" classified as ACTION`);
    return 'action';
  }
  
  // PAGES - landing pages, forms, visual content, social media posts, lead magnets
  if (
    category.includes('page') ||
    category.includes('lead-capture') ||
    category.includes('sales-conversion') ||
    category.includes('lead-sales') ||
    category.includes('engagement') ||
    category.includes('content') ||
    category.includes('member') ||
    category.includes('book') ||
    category.includes('utility') ||
    category === 'social-media' || // Social media posts/content are pages
    category === 'engagement-content' || // Engagement content are pages
    label.toLowerCase().includes('page') ||
    label.toLowerCase().includes('landing') ||
    label.toLowerCase().includes('form') ||
    label.toLowerCase().includes('checkout') ||
    label.toLowerCase().includes('webinar') ||
    label.toLowerCase().includes('sales page') ||
    label.toLowerCase().includes('lead magnet') ||
    label.toLowerCase().includes('post') ||
    label.toLowerCase().includes('content') ||
    label.toLowerCase().includes('video') ||
    label.toLowerCase().includes('thumbnail') ||
    label.toLowerCase().includes('story') ||
    label.toLowerCase().includes('reels') ||
    type.includes('page') ||
    type.includes('post') ||
    type.includes('content') ||
    type.includes('video') ||
    type.includes('story') ||
    type.includes('reels') ||
    type.includes('carousel') ||
    type.includes('grid') ||
    type.includes('thumbnail')
  ) {
    console.log(`✅ [Classify] "${label}" classified as PAGE`);
    return 'page';
  }
  
  // DEFAULT: If nothing matches specifically, classify based on common patterns
  // Social media and content = PAGE
  if (label.toLowerCase().includes('social') || label.toLowerCase().includes('media')) {
    console.log(`✅ [Classify] "${label}" defaulted to PAGE (social/media content)`);
    return 'page';
  }
  
  // Email and campaigns = ACTION  
  if (label.toLowerCase().includes('email') || label.toLowerCase().includes('campaign')) {
    console.log(`✅ [Classify] "${label}" defaulted to ACTION (email/campaign)`);
    return 'action';
  }
  
  // Final fallback to PAGE (most generic)
  console.log(`⚠️ [Classify] "${label}" defaulted to PAGE (no specific match)`);
  return 'page';
};

// Template Synchronization Functions
export const templateSyncService = {
  // Analisar sistema completo
  async analyzeSystem() {
    console.log('Analisando sistema completo...');
    const analysis = analyzeSystemTemplates();
    return analysis;
  },

  // Converter template para ContentItem do database
  templateToContentItem: (template: any) => {
    const crudType = classifyTemplateForCRUD(template);
    
    return {
      // Let database generate UUID automatically with gen_random_uuid()
      type: crudType,
      name: template.label || template.title || 'Untitled',
      description: template.description || '',
      category: template.category || 'Uncategorized',
      status: 'active' as const,
      usage: 0,
      rating: 0,
      tags: template.tags || [crudType, template.category],
      icon: template.icon || 'file',
      color: template.color || '#3B82F6',
      config: template.defaultProps || {},
      created_by: null, // Use null for system imports
      is_premium: template.isPremium || false
    };
  },

  // Teste de classificação antes da importação
  async testClassification() {
    console.log('🧪 TESTE DE CLASSIFICAÇÃO DE TEMPLATES');
    console.log('='.repeat(60));
    
    // Pegar amostra mais representativa de cada categoria principal
    const categorySamples = [
      // Traffic sources (should be SOURCE)
      ...ALL_SYSTEM_TEMPLATES.filter(t => t.category?.includes('traffic-sources')).slice(0, 5),
      // Social media (should be PAGE)
      ...ALL_SYSTEM_TEMPLATES.filter(t => t.category === 'social-media').slice(0, 5),
      // Digital launch (should be ACTION)
      ...ALL_SYSTEM_TEMPLATES.filter(t => t.category === 'digital-launch').slice(0, 5),
      // Engagement content (should be PAGE)
      ...ALL_SYSTEM_TEMPLATES.filter(t => t.category === 'engagement-content').slice(0, 5),
      // Lead capture/sales (should be PAGE)
      ...ALL_SYSTEM_TEMPLATES.filter(t => t.category?.includes('lead-') || t.category?.includes('sales-')).slice(0, 5),
      // Nurturing (should be ACTION)
      ...ALL_SYSTEM_TEMPLATES.filter(t => t.category === 'nurturing').slice(0, 3),
      // Page templates (should be PAGE)
      ...ALL_SYSTEM_TEMPLATES.filter(t => t.label?.toLowerCase().includes('page')).slice(0, 3)
    ];
    
    const results = {
      source: [] as string[],
      page: [] as string[],
      action: [] as string[]
    };
    
    const categoryBreakdown: Record<string, { source: number, page: number, action: number }> = {};
    
    console.log('\n🔍 TESTANDO CLASSIFICAÇÃO POR CATEGORIA:');
    
    categorySamples.forEach(template => {
      const classification = classifyTemplateForCRUD(template);
      const category = template.category || 'uncategorized';
      
      results[classification].push(`${template.label} (${category})`);
      
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = { source: 0, page: 0, action: 0 };
      }
      categoryBreakdown[category][classification]++;
    });
    
    console.log('\n📊 RESULTADO DO TESTE EXPANDIDO:');
    console.log(`🌐 SOURCES (${results.source.length}):`, results.source);
    console.log(`📄 PAGES (${results.page.length}):`, results.page);
    console.log(`⚡ ACTIONS (${results.action.length}):`, results.action);
    
    console.log('\n📈 CLASSIFICAÇÃO POR CATEGORIA:');
    Object.entries(categoryBreakdown)
      .sort((a, b) => (b[1].source + b[1].page + b[1].action) - (a[1].source + a[1].page + a[1].action))
      .forEach(([category, counts]) => {
        const total = counts.source + counts.page + counts.action;
        console.log(`📁 ${category} (${total} testados):`);
        if (counts.source > 0) console.log(`  🌐 Sources: ${counts.source}`);
        if (counts.page > 0) console.log(`  📄 Pages: ${counts.page}`);
        if (counts.action > 0) console.log(`  ⚡ Actions: ${counts.action}`);
      });
    
    // Análise completa de TODOS os templates
    console.log('\n🔍 ANÁLISE COMPLETA DE CLASSIFICAÇÃO:');
    const fullAnalysis = ALL_SYSTEM_TEMPLATES.reduce((acc, template) => {
      const classification = classifyTemplateForCRUD(template);
      const category = template.category || 'uncategorized';
      
      if (!acc[category]) {
        acc[category] = { source: 0, page: 0, action: 0, templates: [] };
      }
      acc[category][classification]++;
      acc[category].templates.push(template.label);
      
      return acc;
    }, {} as Record<string, { source: number, page: number, action: number, templates: string[] }>);
    
    console.log('\n📋 CLASSIFICAÇÃO COMPLETA POR CATEGORIA:');
    Object.entries(fullAnalysis)
      .sort((a, b) => b[1].templates.length - a[1].templates.length)
      .forEach(([category, data]) => {
        const total = data.source + data.page + data.action;
        const dominant = data.source > data.page && data.source > data.action ? 'SOURCE' : 
                        data.page > data.action ? 'PAGE' : 'ACTION';
        
        console.log(`\n📁 ${category} (${total} templates) → Maioria: ${dominant}`);
        if (data.source > 0) console.log(`  🌐 ${data.source} Sources`);
        if (data.page > 0) console.log(`  📄 ${data.page} Pages`);
        if (data.action > 0) console.log(`  ⚡ ${data.action} Actions`);
        
        // Mostrar alguns exemplos
        console.log(`  📝 Exemplos: ${data.templates.slice(0, 3).join(', ')}${data.templates.length > 3 ? '...' : ''}`);
      });
    
    console.log('\n' + '='.repeat(60));
    
    return results;
  },

  // Import TODOS os templates do sistema
  async importAllSystemTemplates() {
    try {
      console.log('Importando TODOS os templates do sistema...');
      
      const contentItems = ALL_SYSTEM_TEMPLATES.map(this.templateToContentItem);
      
      console.log(`Preparando ${contentItems.length} templates para import...`);
      
      // Mostrar estatísticas antes do import
      const stats = contentItems.reduce((acc, item: any) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('Estatísticas do import:', stats);
      
      // Clear existing system imports first to avoid duplicates
      console.log('Limpando imports anteriores...');
      await supabase
        .from('content_items')
        .delete()
        .is('created_by', null);
      
      // Insert new templates
      const { data, error } = await supabase
        .from('content_items')
        .insert(contentItems)
        .select();

      if (error) {
        console.error('Erro no import:', error);
        return { data: null, error };
      }

      console.log(`✅ Import concluído: ${data?.length} templates importados`);
      
      return { data, error: null };
    } catch (error) {
      console.error('Erro no import completo:', error);
      return { data: null, error };
    }
  },

  // Import apenas templates principais (marketing)
  async importExistingTemplates() {
    try {
      const contentItems = MARKETING_COMPONENT_TEMPLATES.map(this.templateToContentItem);
      
      return supabase
        .from('content_items')
        .insert(contentItems)
        .select();
    } catch (error) {
      return { data: null, error };
    }
  },

  // Obter templates faltantes
  async getMissingTemplates() {
    try {
      const { data: existingContent } = await contentService.getContent();
      const existingNames = new Set(existingContent?.map(item => item.name) || []);
      
      const missing = ALL_SYSTEM_TEMPLATES.filter(template => {
        const name = template.label || template.title || 'Untitled';
        return !existingNames.has(name);
      });
      
      return { data: missing, error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Sync por tipo de uso no CRUD
  async syncTemplatesByType(type: 'source' | 'page' | 'action') {
    try {
      const templates = ALL_SYSTEM_TEMPLATES.filter(template => 
        classifyTemplateForCRUD(template) === type
      );

      const contentItems = templates.map(this.templateToContentItem);

      // Clear existing templates of this type with null created_by (system imports)
      await supabase
        .from('content_items')
        .delete()
        .eq('type', type)
        .is('created_by', null);

      return supabase
        .from('content_items')
        .insert(contentItems)
        .select();
    } catch (error) {
      return { data: null, error };
    }
  },

  // Exportar do database para formato template
  exportToTemplateFormat: (contentItem: any) => {
    return {
      id: contentItem.id,
      type: contentItem.config?.type || contentItem.type,
      icon: contentItem.icon,
      label: contentItem.name,
      color: contentItem.color,
      category: contentItem.category,
      title: contentItem.name,
      description: contentItem.description,
      defaultProps: contentItem.config,
      tags: contentItem.tags,
      isPremium: contentItem.is_premium
    };
  }
};

// Enhanced Security Functions for Template Management
export const securityService = {
  // Audit logging function
  async logActivity(userId: string, action: string, details: Record<string, any>, ipAddress?: string) {
    try {
      const auditEntry = {
        user_id: userId,
        action,
        details: {
          ...details,
          ip_address: ipAddress,
          user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
          timestamp: new Date().toISOString()
        }
      };

      await supabase
        .from('user_activity')
        .insert([auditEntry]);

      console.log(`🔒 [Security] Activity logged: ${action} by ${userId}`);
    } catch (error) {
      console.error('❌ [Security] Failed to log activity:', error);
    }
  },

  // Validate user permissions for template operations
  async validateTemplatePermissions(userId: string, operation: 'create' | 'update' | 'delete', templateId?: string) {
    try {
      // Get user profile with role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, status, email')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        throw new Error('User profile not found or invalid');
      }

      // Check if user is active
      if (profile.status !== 'active') {
        throw new Error('User account is not active');
      }

      // Verify email confirmation for new users
      const { data: authUser } = await supabase.auth.admin.getUserById(userId);
      if (!authUser.user?.email_confirmed_at) {
        throw new Error('Email address not confirmed');
      }

      // Rate limiting check for non-admin users
      if (profile.role !== 'admin' && operation === 'create') {
        const { count } = await supabase
          .from('content_items')
          .select('id', { count: 'exact' })
          .eq('created_by', userId)
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

        if (count && count >= 10) { // Limit: 10 templates per day for non-admin
          throw new Error('Daily template creation limit exceeded (10 per day)');
        }
      }

      // For update/delete operations, verify ownership or admin role
      if ((operation === 'update' || operation === 'delete') && templateId) {
        const { data: template } = await supabase
          .from('content_items')
          .select('created_by')
          .eq('id', templateId)
          .single();

        if (template && template.created_by !== userId && profile.role !== 'admin') {
          throw new Error('Insufficient permissions to modify this template');
        }

        // Prevent deletion of system templates
        if (operation === 'delete' && template && template.created_by === null) {
          throw new Error('System templates cannot be deleted');
        }
      }

      console.log(`✅ [Security] Permission validated: ${operation} for user ${profile.email}`);
      return {
        allowed: true,
        userRole: profile.role,
        userEmail: profile.email
      };

    } catch (error: any) {
      console.error(`❌ [Security] Permission denied: ${error.message}`);
      throw error;
    }
  },

  // Enhanced content creation with security checks
  async secureCreateContent(userId: string, templateData: any, ipAddress?: string) {
    // Validate permissions first
    const permissions = await this.validateTemplatePermissions(userId, 'create');
    
    // Input validation and sanitization
    const sanitizedData = {
      type: templateData.type?.trim(),
      name: templateData.name?.trim().substring(0, 255), // Limit name length
      description: templateData.description?.trim().substring(0, 1000), // Limit description
      category: templateData.category?.trim().substring(0, 100),
      status: ['active', 'inactive', 'draft', 'published'].includes(templateData.status) 
        ? templateData.status : 'draft',
      tags: Array.isArray(templateData.tags) 
        ? templateData.tags.slice(0, 10).map(tag => String(tag).trim().substring(0, 50))
        : [],
      icon: templateData.icon?.trim().substring(0, 50),
      color: /^#[0-9A-F]{6}$/i.test(templateData.color) ? templateData.color : '#3B82F6',
      config: typeof templateData.config === 'object' ? templateData.config : {},
      created_by: userId,
      is_premium: Boolean(templateData.is_premium)
    };

    // Additional validation
    if (!sanitizedData.type || !['source', 'page', 'action'].includes(sanitizedData.type)) {
      throw new Error('Invalid template type');
    }

    if (!sanitizedData.name || sanitizedData.name.length < 2) {
      throw new Error('Template name must be at least 2 characters long');
    }

    // Check for duplicate names for this user
    const { count } = await supabase
      .from('content_items')
      .select('id', { count: 'exact' })
      .eq('created_by', userId)
      .eq('name', sanitizedData.name);

    if (count && count > 0) {
      throw new Error('You already have a template with this name');
    }

    // Create the template
    const result = await contentService.createContent(sanitizedData);

    // Log the activity
    await this.logActivity(userId, 'template_created', {
      template_id: result.data?.id,
      template_name: sanitizedData.name,
      template_type: sanitizedData.type,
      category: sanitizedData.category
    }, ipAddress);

    return result;
  },

  // Security audit report
  async generateSecurityReport(days = 7) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    try {
      const [recentActivity, suspiciousTemplates, userStats] = await Promise.all([
        // Recent user activity
        supabase
          .from('user_activity')
          .select('*')
          .gte('created_at', since)
          .order('created_at', { ascending: false }),

        // Templates created by users (check their profile status)
        supabase
          .from('content_items')
          .select(`
            id, name, type, created_by, created_at,
            profiles(email, role, status, email_confirmed_at, last_sign_in_at)
          `)
          .not('created_by', 'is', null)
          .gte('created_at', since),

        // User creation stats
        supabase
          .from('profiles')
          .select('role, status, created_at')
          .gte('created_at', since)
      ]);

      // Process suspicious templates (unconfirmed emails, never logged in, etc.)
      const suspicious = suspiciousTemplates.data?.filter(template => {
        const profile = Array.isArray(template.profiles) ? template.profiles[0] : template.profiles;
        return profile && (
          !profile.email_confirmed_at || 
          !profile.last_sign_in_at ||
          profile.status !== 'active'
        );
      }) || [];

      return {
        period: `${days} days`,
        recentActivity: recentActivity.data || [],
        suspiciousTemplates: suspicious,
        userStats: userStats.data || [],
        error: null
      };
    } catch (error: any) {
      console.error('❌ [Security] Audit error:', error.message);
      return {
        period: `${days} days`,
        recentActivity: [],
        suspiciousTemplates: [],
        userStats: [],
        error: error.message
      };
    }
  }
};

// Enhanced contentService with security
const enhancedContentService = {
  ...contentService,

  // Override createContent with security
  async createContent(item: any, options?: { userId?: string; ipAddress?: string }) {
    if (options?.userId) {
      return await securityService.secureCreateContent(options.userId, item, options.ipAddress);
    }
    // Fallback to original method (for system operations)
    return await contentService.createContent(item);
  },

  // Enhanced updateContent with security
  async updateContent(id: string, updates: any, options?: { userId?: string; ipAddress?: string }) {
    if (options?.userId) {
      await securityService.validateTemplatePermissions(options.userId, 'update', id);
      
      // Log the activity
      await securityService.logActivity(options.userId, 'template_updated', {
        template_id: id,
        updates: Object.keys(updates)
      }, options.ipAddress);
    }

    return await contentService.updateContent(id, updates);
  },

  // Enhanced deleteContent with security
  async deleteContent(id: string, options?: { userId?: string; ipAddress?: string }) {
    if (options?.userId) {
      await securityService.validateTemplatePermissions(options.userId, 'delete', id);
      
      // Get template info before deletion
      const { data: template } = await supabase
        .from('content_items')
        .select('name, type')
        .eq('id', id)
        .single();

      // Log the activity
      await securityService.logActivity(options.userId, 'template_deleted', {
        template_id: id,
        template_name: template?.name,
        template_type: template?.type
      }, options.ipAddress);
    }

    return await contentService.deleteContent(id);
  }
};

// Custom Categories Management Functions
export const categoryService = {
  // Get all categories for a specific template type
  async getCategories(templateType?: 'source' | 'page' | 'action') {
    let query = supabase
      .from('template_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (templateType) {
      query = query.eq('template_type', templateType);
    }

    return query;
  },

  // Create new custom category
  async createCategory(category: {
    name: string;
    slug: string;
    description?: string;
    template_type: 'source' | 'page' | 'action';
    color?: string;
    icon?: string;
    created_by: string;
  }) {
    // Validate slug uniqueness
    const { count } = await supabase
      .from('template_categories')
      .select('id', { count: 'exact' })
      .eq('slug', category.slug);

    if (count && count > 0) {
      throw new Error('Category slug already exists');
    }

    return supabase
      .from('template_categories')
      .insert([{
        ...category,
        is_system: false,
        is_active: true
      }])
      .select()
      .single();
  },

  // Update category
  async updateCategory(id: string, updates: {
    name?: string;
    description?: string;
    color?: string;
    icon?: string;
    sort_order?: number;
  }) {
    return supabase
      .from('template_categories')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
  },

  // Delete/deactivate category
  async deleteCategory(id: string) {
    // Don't actually delete, just deactivate to preserve relationships
    return supabase
      .from('template_categories')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('is_system', false); // Only allow deletion of custom categories
  },

  // Assign template to category
  async assignTemplateToCategory(templateId: string, categoryId: string) {
    return supabase
      .from('content_items')
      .update({ 
        category_id: categoryId,
        updated_at: new Date().toISOString()
      })
      .eq('id', templateId)
      .select()
      .single();
  },

  // Get templates by category
  async getTemplatesByCategory(categoryId: string) {
    return supabase
      .from('content_items')
      .select(`
        *,
        template_categories(name, slug, color, icon)
      `)
      .eq('category_id', categoryId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
  },

  // Auto-categorize existing templates based on their category string
  async autoCategorizeTemplates() {
    try {
      // Get all templates without category_id
      const { data: templates } = await supabase
        .from('content_items')
        .select('id, type, category')
        .is('category_id', null);

      if (!templates || templates.length === 0) {
        return { categorized: 0, error: null };
      }

      // Get all categories for mapping
      const { data: categories } = await this.getCategories();
      const categoriesMap = (categories || []).reduce((acc, cat) => {
        acc[cat.template_type] = acc[cat.template_type] || [];
        acc[cat.template_type].push(cat);
        return acc;
      }, {} as Record<string, any[]>);

      let categorized = 0;

      for (const template of templates) {
        const availableCategories = categoriesMap[template.type] || [];
        let targetCategory = null;

        // Map old category strings to new category slugs
        const categoryMappings: Record<string, string> = {
          // Source mappings
          'traffic-sources-paid': 'paid-traffic',
          'traffic-sources-search': 'search-traffic', 
          'traffic-sources-social': 'social-media-traffic',
          'traffic-sources-crm': 'email-crm-traffic',
          'traffic-sources-messaging': 'direct-messaging-traffic',
          'traffic-sources-offline': 'offline-traffic',
          'traffic-sources-other': 'other-traffic',
          'traffic-sources-other-sites': 'other-traffic',
          'traffic-sources-content': 'other-traffic',
          
          // Page mappings
          'lead-capture': 'landing-pages',
          'sales-conversion': 'sales-pages',
          'social-media': 'social-content',
          'engagement-content': 'social-content',
          'lead-sales': 'landing-pages',
          'member-book': 'member-areas',
          'utility': 'thank-you-pages',
          
          // Action mappings
          'nurturing': 'lead-nurturing',
          'digital-launch': 'launch-campaigns',
          'email-sequence': 'email-sequences'
        };

        const mappedSlug = categoryMappings[template.category || ''];
        if (mappedSlug) {
          targetCategory = availableCategories.find(cat => cat.slug === mappedSlug);
        }

        // Fallback to "other" category for the type
        if (!targetCategory) {
          const otherSlugs = {
            'source': 'other-traffic',
            'page': 'other-pages',
            'action': 'other-actions'
          };
          targetCategory = availableCategories.find(cat => cat.slug === otherSlugs[template.type]);
        }

        if (targetCategory) {
          await this.assignTemplateToCategory(template.id, targetCategory.id);
          categorized++;
        }
      }

      return { categorized, error: null };
    } catch (error: any) {
      console.error('❌ Error auto-categorizing templates:', error);
      return { categorized: 0, error: error.message };
    }
  }
};

// Bulk delete functions for total control
export const bulkDeleteService = {
  // Delete all templates of a specific type
  async deleteAllByType(type: 'source' | 'page' | 'action', includeSystem = false) {
    try {
      let query = supabase
        .from('content_items')
        .delete()
        .eq('type', type);

      // If not including system templates, only delete user templates
      if (!includeSystem) {
        query = query.not('created_by', 'is', null);
      }

      const { data, error } = await query.select();
      
      if (error) throw error;

      return {
        data,
        count: data?.length || 0,
        error: null
      };
    } catch (error) {
      console.error('❌ Error in bulk delete by type:', error);
      return {
        data: null,
        count: 0,
        error: error as any
      };
    }
  },

  // Delete ALL templates (nuclear option)
  async deleteAllTemplates(includeSystem = false) {
    try {
      let query = supabase
        .from('content_items')
        .delete();

      // If not including system templates, only delete user templates
      if (!includeSystem) {
        query = query.not('created_by', 'is', null);
      } else {
        // Delete everything
        query = query.neq('id', '00000000-0000-0000-0000-000000000000'); // Dummy condition to select all
      }

      const { data, error } = await query.select();
      
      if (error) throw error;

      return {
        data,
        count: data?.length || 0,
        error: null
      };
    } catch (error) {
      console.error('❌ Error in bulk delete all:', error);
      return {
        data: null,
        count: 0,
        error: error as any
      };
    }
  },

  // Get count of templates for confirmation
  async getTemplateCount(type?: 'source' | 'page' | 'action', includeSystem = false) {
    try {
      let query = supabase
        .from('content_items')
        .select('id', { count: 'exact', head: true });

      if (type) {
        query = query.eq('type', type);
      }

      if (!includeSystem) {
        query = query.not('created_by', 'is', null);
      }

      const { count, error } = await query;
      
      if (error) throw error;

      return {
        count: count || 0,
        error: null
      };
    } catch (error) {
      console.error('❌ Error getting template count:', error);
      return {
        count: 0,
        error: error as any
      };
    }
  },

  // Delete templates by category
  async deleteByCategory(category: string) {
    try {
      const { data, error } = await supabase
        .from('content_items')
        .delete()
        .eq('category', category)
        .select();
      
      if (error) throw error;

      return {
        data,
        count: data?.length || 0,
        error: null
      };
    } catch (error) {
      console.error('❌ Error deleting by category:', error);
      return {
        data: null,
        count: 0,
        error: error as any
      };
    }
  }
};

export default {
  contentService,
  userService,
  feedbackService,
  onboardingService,
  analyticsService,
  subscribeToAdminUpdates,
  templateSyncService,
  securityService,
  enhancedContentService,
  categoryService,
  bulkDeleteService
}; 