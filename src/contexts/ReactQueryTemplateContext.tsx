import React, { createContext, useContext, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ComponentTemplate } from '../types/funnel';
import { FrontendTemplate, CreateContentData, UpdateContentData } from '../types/admin';
import { logger } from '../lib/logger';
import {
  useAllTemplates,
  useTemplatesByType,
  useTemplateStats,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
  useBackgroundSync,
  templateQueryKeys
} from '@/features/templates/hooks/useTemplateQueries';

interface ReactQueryTemplateContextType {
  // Data
  componentTemplates: ComponentTemplate[];
  frontendTemplates: FrontendTemplate[];
  contentItems: any[];
  systemStats: any;
  
  // Loading states
  loading: boolean;
  isRefreshing: boolean;
  
  // Error handling
  error: string | null;
  
  // Query functions with intelligent caching
  getTemplatesByType: (type: 'source' | 'page' | 'action') => ComponentTemplate[];
  getTemplatesByCategory: (category: string) => ComponentTemplate[];
  getTemplateCount: (type?: 'source' | 'page' | 'action') => number;
  searchTemplates: (query: string) => ComponentTemplate[];
  
  // CRUD operations with optimistic updates
  createTemplate: (data: CreateContentData) => Promise<void>;
  updateTemplate: (id: string, data: UpdateContentData) => Promise<void>;
  deleteTemplate: (id: string, isSystem?: boolean) => Promise<void>;
  duplicateTemplate: (id: string) => Promise<void>;
  
  // Advanced operations
  refreshData: () => Promise<void>;
  syncInBackground: () => Promise<void>;
  bulkDeleteByType: (type: 'source' | 'page' | 'action') => Promise<void>;
  bulkDeleteAll: () => Promise<void>;
  
  // Performance metrics
  cacheStats: {
    hitRate: number;
    totalQueries: number;
    backgroundSyncs: number;
  };
}

const ReactQueryTemplateContext = createContext<ReactQueryTemplateContextType | undefined>(undefined);

export const useReactQueryTemplateContext = () => {
  const context = useContext(ReactQueryTemplateContext);
  if (context === undefined) {
    throw new Error('useReactQueryTemplateContext must be used within a ReactQueryTemplateProvider');
  }
  return context;
};

interface ReactQueryTemplateProviderProps {
  children: React.ReactNode;
}

export const ReactQueryTemplateProvider: React.FC<ReactQueryTemplateProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  
  // Core queries
  const {
    data: allTemplateData,
    isLoading: isLoadingTemplates,
    error: templatesError,
    refetch: refetchTemplates,
    isFetching: isRefreshingTemplates
  } = useAllTemplates();

  const {
    data: statsData,
    isLoading: isLoadingStats,
    error: statsError
  } = useTemplateStats();

  // Mutations
  const createMutation = useCreateTemplate();
  const updateMutation = useUpdateTemplate();
  const deleteMutation = useDeleteTemplate();
  const { syncTemplates } = useBackgroundSync();

  // Extract data with fallbacks
  const componentTemplates = allTemplateData?.componentTemplates || [];
  const frontendTemplates = allTemplateData?.frontendTemplates || [];
  const contentItems = allTemplateData?.contentItems || [];
  const systemStats = statsData || {};

  // Loading and error states
  const loading = isLoadingTemplates || isLoadingStats;
  const isRefreshing = isRefreshingTemplates;
  const error = templatesError?.message || statsError?.message || null;

  // Background sync on mount and interval
  useEffect(() => {
    const interval = setInterval(() => {
      syncTemplates();
    }, 5 * 60 * 1000); // Sync every 5 minutes

    return () => clearInterval(interval);
  }, [syncTemplates]);

  // Cache performance tracking
  const [cacheStats, setCacheStats] = React.useState({
    hitRate: 0,
    totalQueries: 0,
    backgroundSyncs: 0,
  });

  // Update cache stats
  useEffect(() => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    const templateQueries = queries.filter(q => 
      q.queryKey[0] === 'templates'
    );
    
    setCacheStats(prev => ({
      ...prev,
      totalQueries: templateQueries.length,
      hitRate: templateQueries.length > 0 ? 
        (templateQueries.filter(q => q.state.dataUpdatedAt > 0).length / templateQueries.length) * 100 : 0,
    }));
  }, [queryClient, componentTemplates.length]);

  // Query functions with intelligent filtering
  const getTemplatesByType = (type: 'source' | 'page' | 'action'): ComponentTemplate[] => {
    return componentTemplates.filter(template => template.type === type);
  };

  const getTemplatesByCategory = (category: string): ComponentTemplate[] => {
    return componentTemplates.filter(template => 
      template.category?.toLowerCase().includes(category.toLowerCase())
    );
  };

  const getTemplateCount = (type?: 'source' | 'page' | 'action'): number => {
    if (!type) return componentTemplates.length;
    return getTemplatesByType(type).length;
  };

  const searchTemplates = (query: string): ComponentTemplate[] => {
    if (!query.trim()) return componentTemplates;
    
    const searchLower = query.toLowerCase();
    return componentTemplates.filter(template =>
      template.label.toLowerCase().includes(searchLower) ||
      template.description?.toLowerCase().includes(searchLower) ||
      template.category?.toLowerCase().includes(searchLower)
    );
  };

  // CRUD operations with optimistic updates and error handling
  const createTemplate = async (data: CreateContentData): Promise<void> => {
    logger.time('ReactQuery.createTemplate');
    
    try {
      await createMutation.mutateAsync(data);
      toast.success(`${data.type.charAt(0).toUpperCase() + data.type.slice(1)} created successfully`);
      logger.log('✅ Template created via React Query');
    } catch (error: any) {
      logger.error('❌ Create template failed:', error);
      toast.error(`Failed to create ${data.type}: ${error.message}`);
      throw error;
    } finally {
      logger.timeEnd('ReactQuery.createTemplate');
    }
  };

  const updateTemplate = async (id: string, data: UpdateContentData): Promise<void> => {
    logger.time('ReactQuery.updateTemplate');
    
    try {
      await updateMutation.mutateAsync({ id, data });
      toast.success('Template updated successfully');
      logger.log('✅ Template updated via React Query');
    } catch (error: any) {
      logger.error('❌ Update template failed:', error);
      toast.error(`Failed to update template: ${error.message}`);
      throw error;
    } finally {
      logger.timeEnd('ReactQuery.updateTemplate');
    }
  };

  const deleteTemplate = async (id: string, isSystem = false): Promise<void> => {
    logger.time('ReactQuery.deleteTemplate');
    
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`Template deleted successfully`);
      logger.log('✅ Template deleted via React Query');
    } catch (error: any) {
      logger.error('❌ Delete template failed:', error);
      toast.error(`Failed to delete template: ${error.message}`);
      throw error;
    } finally {
      logger.timeEnd('ReactQuery.deleteTemplate');
    }
  };

  const duplicateTemplate = async (id: string): Promise<void> => {
    logger.time('ReactQuery.duplicateTemplate');
    
    try {
      const originalTemplate = frontendTemplates.find(t => t.id === id);
      if (!originalTemplate) {
        throw new Error('Template not found');
      }

      const duplicateData: CreateContentData = {
        type: originalTemplate.type,
        name: `${originalTemplate.name} (Copy)`,
        description: originalTemplate.description,
        category: originalTemplate.category,
        status: 'draft',
        tags: originalTemplate.tags,
        icon: originalTemplate.icon,
        color: originalTemplate.color,
        config: originalTemplate.config,
        created_by: originalTemplate.id, // Will be replaced by current user in mutation
        is_premium: originalTemplate.isPremium,
      };

      await createTemplate(duplicateData);
      logger.log('✅ Template duplicated via React Query');
    } catch (error: any) {
      logger.error('❌ Duplicate template failed:', error);
      toast.error(`Failed to duplicate template: ${error.message}`);
      throw error;
    } finally {
      logger.timeEnd('ReactQuery.duplicateTemplate');
    }
  };

  // Advanced operations
  const refreshData = async (): Promise<void> => {
    logger.time('ReactQuery.refreshData');
    
    try {
      await Promise.all([
        refetchTemplates(),
        queryClient.invalidateQueries({ queryKey: templateQueryKeys.stats() })
      ]);
      
      logger.log('✅ Data refreshed via React Query');
      toast.success('Data refreshed successfully');
    } catch (error: any) {
      logger.error('❌ Refresh failed:', error);
      toast.error('Failed to refresh data');
    } finally {
      logger.timeEnd('ReactQuery.refreshData');
    }
  };

  const syncInBackground = async (): Promise<void> => {
    try {
      await syncTemplates();
      setCacheStats(prev => ({ ...prev, backgroundSyncs: prev.backgroundSyncs + 1 }));
      logger.info('🔄 Background sync completed');
    } catch (error) {
      logger.error('❌ Background sync failed:', error);
    }
  };

  const bulkDeleteByType = async (type: 'source' | 'page' | 'action'): Promise<void> => {
    logger.time(`ReactQuery.bulkDelete-${type}`);
    
    try {
      const templatesOfType = getTemplatesByType(type);
      const deletePromises = templatesOfType.map(template => 
        deleteMutation.mutateAsync(template.id)
      );
      
      await Promise.all(deletePromises);
      toast.success(`All ${type} templates deleted`);
      logger.log(`✅ Bulk delete ${type} completed`);
    } catch (error: any) {
      logger.error(`❌ Bulk delete ${type} failed:`, error);
      toast.error(`Failed to delete ${type} templates`);
      throw error;
    } finally {
      logger.timeEnd(`ReactQuery.bulkDelete-${type}`);
    }
  };

  const bulkDeleteAll = async (): Promise<void> => {
    logger.time('ReactQuery.bulkDeleteAll');
    
    try {
      const deletePromises = frontendTemplates.map(template => 
        deleteMutation.mutateAsync(template.id)
      );
      
      await Promise.all(deletePromises);
      toast.success('All templates deleted');
      logger.log('✅ Bulk delete all completed');
    } catch (error: any) {
      logger.error('❌ Bulk delete all failed:', error);
      toast.error('Failed to delete all templates');
      throw error;
    } finally {
      logger.timeEnd('ReactQuery.bulkDeleteAll');
    }
  };

  const contextValue: ReactQueryTemplateContextType = {
    // Data
    componentTemplates,
    frontendTemplates,
    contentItems,
    systemStats,
    
    // Loading states
    loading,
    isRefreshing,
    
    // Error handling
    error,
    
    // Query functions
    getTemplatesByType,
    getTemplatesByCategory,
    getTemplateCount,
    searchTemplates,
    
    // CRUD operations
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    
    // Advanced operations
    refreshData,
    syncInBackground,
    bulkDeleteByType,
    bulkDeleteAll,
    
    // Performance metrics
    cacheStats,
  };

  // Log performance metrics in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      logger.log('🚀 React Query Template Context Stats:', {
        templates: componentTemplates.length,
        cacheHitRate: `${cacheStats.hitRate.toFixed(1)}%`,
        backgroundSyncs: cacheStats.backgroundSyncs,
        isLoading: loading,
        isRefreshing,
      });
    }
  }, [componentTemplates.length, cacheStats, loading, isRefreshing]);

  return (
    <ReactQueryTemplateContext.Provider value={contextValue}>
      {children}
    </ReactQueryTemplateContext.Provider>
  );
}; 