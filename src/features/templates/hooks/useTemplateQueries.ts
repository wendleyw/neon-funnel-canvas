import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FrontendTemplate, CreateContentData, UpdateContentData } from '../types/admin';
import { ComponentTemplate } from '../types/funnel';
import { logger } from '../lib/logger';
import supabaseAdmin, { contentService } from '../lib/supabase-admin';

// Query keys for consistent cache management
export const templateQueryKeys = {
  all: ['templates'] as const,
  lists: () => [...templateQueryKeys.all, 'list'] as const,
  list: (type?: string) => [...templateQueryKeys.lists(), type] as const,
  details: () => [...templateQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...templateQueryKeys.details(), id] as const,
  stats: () => [...templateQueryKeys.all, 'stats'] as const,
  search: (query: string) => [...templateQueryKeys.all, 'search', query] as const,
};

// Template data fetching functions
const fetchAllTemplates = async (): Promise<{
  frontendTemplates: FrontendTemplate[];
  componentTemplates: ComponentTemplate[];
  contentItems: any[];
}> => {
  logger.time('TemplateQuery.fetchAll');
  
  try {
    // Fetch from Supabase using contentService
    const { data: templates, error } = await contentService.getContent();

    if (error) {
      logger.error('❌ Error fetching templates:', error);
      throw error;
    }

    // Transform data for frontend consumption
    const frontendTemplates: FrontendTemplate[] = (templates || []).map(template => ({
      id: template.id,
      type: template.type,
      name: template.name,
      description: template.description || '',
      category: template.category || 'other',
      status: template.status,
      usage: template.usage || 0,
      rating: template.rating || 0,
      tags: template.tags || [],
      icon: template.icon || '📄',
      color: template.color || '#3B82F6',
      config: template.config || {},
      createdAt: template.created_at,
      updatedAt: template.updated_at,
      isPremium: template.is_premium || false,
      isSystemTemplate: false, // All content service items are user-created
    }));

    const componentTemplates: ComponentTemplate[] = frontendTemplates.map(template => ({
      id: template.id,
      type: template.type,
      icon: template.icon || '📄',
      label: template.name,
      color: template.color || '#3B82F6',
      category: template.category || 'other',
      title: template.name,
      description: template.description,
      defaultProps: {
        title: template.name,
        description: template.description,
        status: template.status,
        properties: template.config || {},
      },
      isPremium: template.isPremium || false,
    }));

    logger.log('✅ Templates fetched successfully:', {
      frontendTemplates: frontendTemplates.length,
      componentTemplates: componentTemplates.length
    });

    return {
      frontendTemplates,
      componentTemplates,
      contentItems: frontendTemplates, // Legacy compatibility
    };
  } catch (error) {
    logger.error('❌ Template fetch failed:', error);
    throw error;
  } finally {
    logger.timeEnd('TemplateQuery.fetchAll');
  }
};

const fetchTemplatesByType = async (type: string): Promise<ComponentTemplate[]> => {
  logger.time(`TemplateQuery.fetchByType-${type}`);
  
  try {
    const { data: templates, error } = await contentService.getContent({ type });

    if (error) throw error;

    const componentTemplates: ComponentTemplate[] = (templates || []).map(template => ({
      id: template.id,
      type: template.type,
      icon: template.icon || '📄',
      label: template.name,
      color: template.color || '#3B82F6',
      category: template.category || 'other',
      title: template.name,
      description: template.description,
      defaultProps: {
        title: template.name,
        description: template.description,
        status: template.status,
        properties: template.config || {},
      },
      isPremium: template.is_premium || false,
    }));

    logger.log(`✅ Templates by type "${type}" fetched:`, componentTemplates.length);
    return componentTemplates;
  } catch (error) {
    logger.error(`❌ Fetch by type "${type}" failed:`, error);
    throw error;
  } finally {
    logger.timeEnd(`TemplateQuery.fetchByType-${type}`);
  }
};

const fetchTemplateStats = async () => {
  logger.time('TemplateQuery.fetchStats');
  
  try {
    const analytics = await contentService.getContentAnalytics();

    logger.log('✅ Template stats fetched:', analytics);
    return analytics || {
      total: 0,
      sources: 0,
      pages: 0,
      actions: 0,
      system: 0,
      user: 0
    };
  } catch (error) {
    logger.error('❌ Stats fetch failed:', error);
    // Return fallback stats
    return {
      total: 0,
      sources: 0,
      pages: 0,
      actions: 0,
      system: 0,
      user: 0
    };
  } finally {
    logger.timeEnd('TemplateQuery.fetchStats');
  }
};

// React Query hooks
export const useAllTemplates = () => {
  return useQuery({
    queryKey: templateQueryKeys.lists(),
    queryFn: fetchAllTemplates,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useTemplatesByType = (type: string) => {
  return useQuery({
    queryKey: templateQueryKeys.list(type),
    queryFn: () => fetchTemplatesByType(type),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 8 * 60 * 1000, // 8 minutes
    enabled: !!type,
    refetchOnWindowFocus: false,
  });
};

export const useTemplateStats = () => {
  return useQuery({
    queryKey: templateQueryKeys.stats(),
    queryFn: fetchTemplateStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  });
};

// Mutation hooks for CRUD operations
export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateContentData): Promise<FrontendTemplate> => {
      logger.time('TemplateMutation.create');
      
      try {
        const { data: template, error } = await contentService.createContent({
          type: data.type,
          name: data.name,
          description: data.description,
          category: data.category,
          status: data.status,
          tags: data.tags,
          icon: data.icon,
          color: data.color,
          config: data.config,
          created_by: data.created_by,
          is_premium: data.is_premium,
        });

        if (error) throw error;

        logger.log('✅ Template created:', template);
        return template as FrontendTemplate;
      } catch (error) {
        logger.error('❌ Template creation failed:', error);
        throw error;
      } finally {
        logger.timeEnd('TemplateMutation.create');
      }
    },
    onSuccess: (newTemplate) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: templateQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: templateQueryKeys.list(newTemplate.type) });
      queryClient.invalidateQueries({ queryKey: templateQueryKeys.stats() });
      
      logger.info('🔄 Cache invalidated after template creation');
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateContentData }): Promise<FrontendTemplate> => {
      logger.time('TemplateMutation.update');
      
      try {
        const { data: template, error } = await contentService.updateContent(id, {
          name: data.name,
          description: data.description,
          category: data.category,
          status: data.status,
          tags: data.tags,
          icon: data.icon,
          color: data.color,
          config: data.config,
          is_premium: data.is_premium,
        });

        if (error) throw error;

        logger.log('✅ Template updated:', template);
        return template as FrontendTemplate;
      } catch (error) {
        logger.error('❌ Template update failed:', error);
        throw error;
      } finally {
        logger.timeEnd('TemplateMutation.update');
      }
    },
    onSuccess: (updatedTemplate) => {
      // Update specific cache entries
      queryClient.invalidateQueries({ queryKey: templateQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: templateQueryKeys.list(updatedTemplate.type) });
      queryClient.invalidateQueries({ queryKey: templateQueryKeys.detail(updatedTemplate.id) });
      
      logger.info('🔄 Cache updated after template modification');
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      logger.time('TemplateMutation.delete');
      
      try {
        const { error } = await contentService.deleteContent(id);

        if (error) throw error;

        logger.log('✅ Template deleted:', id);
      } catch (error) {
        logger.error('❌ Template deletion failed:', error);
        throw error;
      } finally {
        logger.timeEnd('TemplateMutation.delete');
      }
    },
    onSuccess: () => {
      // Invalidate all template-related queries
      queryClient.invalidateQueries({ queryKey: templateQueryKeys.all });
      
      logger.info('🔄 Cache cleared after template deletion');
    },
  });
};

// Background sync hook for keeping data fresh
export const useBackgroundSync = () => {
  const queryClient = useQueryClient();

  const syncTemplates = async () => {
    try {
      logger.info('🔄 Background sync started');
      
      // Silently refetch all templates in background
      await queryClient.prefetchQuery({
        queryKey: templateQueryKeys.lists(),
        queryFn: fetchAllTemplates,
        staleTime: 0, // Force fresh fetch
      });
      
      logger.info('✅ Background sync completed');
    } catch (error) {
      logger.error('❌ Background sync failed:', error);
    }
  };

  return { syncTemplates };
}; 