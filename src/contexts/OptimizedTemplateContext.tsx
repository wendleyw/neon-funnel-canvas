import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import { ContentItem, FrontendTemplate, SystemStats } from '../types/admin';
import { ComponentTemplate } from '../types/funnel';
import { CreateContentData, UpdateContentData, DeleteOperationResult } from '../types/admin';
import { contentService } from '../lib/supabase-admin';
import { toast } from 'sonner';
import { logger } from '../lib/logger';

// ===================================
// Type Definitions
// ===================================

interface TemplateData {
  contentItems: ContentItem[];
  frontendTemplates: FrontendTemplate[];
  componentTemplates: ComponentTemplate[];
  loading: boolean;
  error: string | null;
}

interface TemplateStats {
  systemStats: SystemStats | null;
}

interface TemplateActions {
  createTemplate: (data: CreateContentData) => Promise<ContentItem | null>;
  updateTemplate: (id: string, data: UpdateContentData) => Promise<ContentItem | null>;
  deleteTemplate: (id: string, forceDelete?: boolean) => Promise<boolean>;
  duplicateTemplate: (id: string) => Promise<ContentItem | null>;
  refreshData: () => Promise<void>;
  
  // Bulk operations
  bulkDeleteByType: (type: 'source' | 'page' | 'action', includeSystem?: boolean) => Promise<boolean>;
  bulkDeleteAll: (includeSystem?: boolean) => Promise<boolean>;
  getTemplateCount: (type?: 'source' | 'page' | 'action', includeSystem?: boolean) => Promise<number>;
}

interface TemplateFilters {
  getTemplatesByType: (type: 'source' | 'page' | 'action') => FrontendTemplate[];
  getTemplatesByCategory: (category: string) => FrontendTemplate[];
  searchTemplates: (query: string) => FrontendTemplate[];
}

// ===================================
// Context Definitions
// ===================================

const TemplateDataContext = createContext<TemplateData | null>(null);
const TemplateStatsContext = createContext<TemplateStats | null>(null);
const TemplateActionsContext = createContext<TemplateActions | null>(null);
const TemplateFiltersContext = createContext<TemplateFilters | null>(null);

// ===================================
// Mapping Functions
// ===================================

const isValidContentType = (type: string): type is 'source' | 'page' | 'action' => {
  return ['source', 'page', 'action'].includes(type);
};

const mapContentItemToFrontendTemplate = (item: any): FrontendTemplate | null => {
  // Validar se o tipo é válido
  if (!isValidContentType(item.type)) {
    logger.warn('⚠️ [OptimizedTemplateContext] Invalid type found:', item.type, 'for item:', item.name);
    return null;
  }

  return {
    id: item.id,
    name: item.name,
    type: item.type,
    category: item.category,
    config: item.config || {},
    description: item.description || '',
    status: item.status,
    usage: item.usage,
    rating: item.rating,
    tags: item.tags,
    icon: item.icon || 'Circle',
    color: item.color || '#3B82F6',
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    isPremium: item.is_premium,
    isSystemTemplate: item.created_by === null
  };
};

const mapFrontendToComponentTemplate = (template: FrontendTemplate): ComponentTemplate => {
  const componentTemplate: ComponentTemplate = {
    id: template.id,
    type: template.type === 'source' ? 'traffic-source' : 
          template.type === 'page' ? 'landing-page' : 'action-sequence',
    label: template.name,
    description: template.description,
    category: template.category,
    icon: template.icon || 'Circle',
    color: template.color || '#3B82F6',
    originalType: template.type,
    defaultProps: {
      title: template.name,
      description: template.description,
      image: template.config?.mockupUrl || '',
      status: 'active',
      properties: {
        customMockup: template.config?.mockupUrl || '',
        originalType: template.type
      }
    }
  };

  if (template.config?.mockupUrl) {
    logger.log('🔄 [OptimizedTemplateContext] Converted ComponentTemplate with mockup:', {
      label: componentTemplate.label,
      originalType: componentTemplate.originalType,
      defaultPropsImage: componentTemplate.defaultProps.image,
      customMockupProperty: componentTemplate.defaultProps.properties?.customMockup
    });
  }

  return componentTemplate;
};

// ===================================
// Template Data Provider
// ===================================

export const TemplateDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<TemplateData>({
    contentItems: [],
    frontendTemplates: [],
    componentTemplates: [],
    loading: true,
    error: null
  });

  const refreshData = useCallback(async () => {
    try {
      logger.time('TemplateData.refresh');
      setData(prev => ({ ...prev, loading: true, error: null }));

      const { data: rawContentItems, error: contentError } = await contentService.getContent();

      if (contentError) throw contentError;

      const items = rawContentItems || [];
      // Filtrar apenas templates com tipos válidos
      const mappedFrontendTemplates = items
        .map(mapContentItemToFrontendTemplate)
        .filter((template): template is FrontendTemplate => template !== null);
      const mappedComponentTemplates = mappedFrontendTemplates.map(mapFrontendToComponentTemplate);

      // Debug: Verificar como os templates estão sendo processados
      logger.log('🔍 [Debug] Raw items from DB:', items.map(i => ({ name: i.name, type: i.type, category: i.category })));
      logger.log('🔍 [Debug] Frontend templates:', mappedFrontendTemplates.map(t => ({ name: t.name, type: t.type, category: t.category })));
      logger.log('🔍 [Debug] Component templates:', mappedComponentTemplates.map(t => ({ label: t.label, originalType: t.originalType, type: t.type, category: t.category })));

      setData({
        contentItems: mappedFrontendTemplates.map(t => ({
          id: t.id,
          name: t.name,
          type: t.type,
          category: t.category,
          config: t.config,
          description: t.description,
          status: t.status,
          usage: t.usage,
          rating: t.rating,
          tags: t.tags,
          icon: t.icon,
          color: t.color,
          created_at: t.createdAt,
          updated_at: t.updatedAt,
          is_premium: t.isPremium,
          created_by: t.isSystemTemplate ? null : 'user'
        })),
        frontendTemplates: mappedFrontendTemplates,
        componentTemplates: mappedComponentTemplates,
        loading: false,
        error: null
      });

      logger.log('✅ [TemplateDataProvider] Data refreshed:', {
        contentItems: mappedFrontendTemplates.length,
        frontendTemplates: mappedFrontendTemplates.length,
        componentTemplates: mappedComponentTemplates.length
      });

      logger.timeEnd('TemplateData.refresh');
    } catch (err: any) {
      logger.error('❌ [TemplateDataProvider] Error refreshing data:', err);
      setData(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'An unexpected error occurred'
      }));
      toast.error('Failed to load template data.');
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <TemplateDataContext.Provider value={data}>
      {children}
    </TemplateDataContext.Provider>
  );
};

// ===================================
// Template Stats Provider
// ===================================

export const TemplateStatsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const templateData = useTemplateData();
  
  const systemStats = useMemo((): SystemStats | null => {
    if (!templateData || templateData.loading) return null;

    const { contentItems } = templateData;
    
    const stats = {
      total: contentItems.length,
      sources: contentItems.filter(i => i.type === 'source').length,
      pages: contentItems.filter(i => i.type === 'page').length,
      actions: contentItems.filter(i => i.type === 'action').length,
      system: contentItems.filter(i => i.created_by === null).length,
      user: contentItems.filter(i => i.created_by !== null).length,
    };

    return {
      database: {
        total: stats.total,
        byType: {
          source: stats.sources,
          page: stats.pages,
          action: stats.actions,
        },
        system: {
          total: stats.system,
          byType: {
            source: contentItems.filter(i => i.type === 'source' && i.created_by === null).length,
            page: contentItems.filter(i => i.type === 'page' && i.created_by === null).length,
            action: contentItems.filter(i => i.type === 'action' && i.created_by === null).length,
          }
        },
        user: {
          total: stats.user,
          byType: {
            source: contentItems.filter(i => i.type === 'source' && i.created_by !== null).length,
            page: contentItems.filter(i => i.type === 'page' && i.created_by !== null).length,
            action: contentItems.filter(i => i.type === 'action' && i.created_by !== null).length,
          }
        }
      },
      storage: { total_size: '0 B', total_files: 0 } // Placeholder
    };
  }, [templateData?.contentItems, templateData?.loading]);

  const statsValue = useMemo(() => ({ systemStats }), [systemStats]);

  return (
    <TemplateStatsContext.Provider value={statsValue}>
      {children}
    </TemplateStatsContext.Provider>
  );
};

// ===================================
// Template Actions Provider
// ===================================

export const TemplateActionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const templateData = useTemplateData();

  const refreshData = useCallback(async () => {
    // This will be handled by the TemplateDataProvider
    // We need to trigger a refresh through a shared mechanism
    window.dispatchEvent(new CustomEvent('template-refresh'));
  }, []);

  // Listen for refresh events
  useEffect(() => {
    const handleRefresh = () => {
      // The actual refresh is handled by TemplateDataProvider
    };

    window.addEventListener('template-refresh', handleRefresh);
    return () => window.removeEventListener('template-refresh', handleRefresh);
  }, []);

  const actions = useMemo((): TemplateActions => ({
    createTemplate: async (data: CreateContentData) => {
      try {
        logger.log('➕ [TemplateActions] Creating template:', data.name);
        toast.loading('Creating template...');
        
        const { data: newItem, error } = await contentService.createContent(data);
        toast.dismiss();
        
        if (error) throw error;
        if (!newItem) throw new Error("Creation returned no data.");

        toast.success(`Template "${newItem.name}" created successfully!`);
        await refreshData();
        return newItem;
      } catch (err: any) {
        logger.error('❌ [TemplateActions] Error creating template:', err);
        toast.error(err.message || 'Failed to create template.');
        return null;
      }
    },

    updateTemplate: async (id: string, data: UpdateContentData) => {
      try {
        logger.log('🔄 [TemplateActions] Updating template:', id);
        toast.loading('Updating template...');
        
        const { data: updatedItem, error } = await contentService.updateContent(id, data);
        toast.dismiss();
        
        if (error) throw error;
        if (!updatedItem) throw new Error("Update returned no data.");

        toast.success(`Template "${updatedItem.name}" updated successfully!`);
        await refreshData();
        return updatedItem;
      } catch (err: any) {
        logger.error('❌ [TemplateActions] Error updating template:', err);
        toast.error(err.message || 'Failed to update template.');
        return null;
      }
    },

    deleteTemplate: async (id: string, forceDelete = false) => {
      try {
        logger.log(`🗑️ [TemplateActions] Deleting template: ${id} (Force: ${forceDelete})`);
        toast.loading('Deleting template...');
        
        const { data, error } = await contentService.deleteContent(id);
        toast.dismiss();
        
        if (error) throw error;

        const result = data as unknown as DeleteOperationResult;
        if (result.success) {
          toast.success('Template deleted successfully!');
          await refreshData();
          return true;
        } else {
          throw new Error(result.message || 'Delete operation failed');
        }
      } catch (err: any) {
        logger.error('❌ [TemplateActions] Error deleting template:', err);
        toast.error(err.message || 'Failed to delete template.');
        return false;
      }
    },

    duplicateTemplate: async (id: string) => {
      try {
        const template = templateData?.contentItems.find(t => t.id === id);
        if (!template) throw new Error('Template not found');

        const duplicateData: CreateContentData = {
          name: `${template.name} (Copy)`,
          type: template.type,
          category: template.category,
          description: template.description || '',
          config: template.config || {},
          status: 'active',
          tags: [],
          icon: template.icon || 'Circle',
          color: template.color || '#3B82F6',
          created_by: template.created_by || 'system',
          is_premium: false
        };

        return await actions.createTemplate(duplicateData);
      } catch (err: any) {
        logger.error('❌ [TemplateActions] Error duplicating template:', err);
        toast.error('Failed to duplicate template.');
        return null;
      }
    },

    refreshData,

    bulkDeleteByType: async (type: 'source' | 'page' | 'action', includeSystem = false) => {
      try {
        const itemsToDelete = templateData?.contentItems.filter(item => 
          item.type === type && (includeSystem || item.created_by !== null)
        ) || [];

        if (itemsToDelete.length === 0) {
          toast.info(`No ${type} templates to delete.`);
          return true;
        }

        const deletePromises = itemsToDelete.map(item => contentService.deleteContent(item.id));
        await Promise.all(deletePromises);

        toast.success(`${itemsToDelete.length} ${type} templates deleted successfully!`);
        await refreshData();
        return true;
      } catch (err: any) {
        logger.error('❌ [TemplateActions] Error in bulk delete:', err);
        toast.error('Failed to delete templates.');
        return false;
      }
    },

    bulkDeleteAll: async (includeSystem = false) => {
      try {
        const itemsToDelete = templateData?.contentItems.filter(item => 
          includeSystem || item.created_by !== null
        ) || [];

        if (itemsToDelete.length === 0) {
          toast.info('No templates to delete.');
          return true;
        }

        const deletePromises = itemsToDelete.map(item => contentService.deleteContent(item.id));
        await Promise.all(deletePromises);

        toast.success(`${itemsToDelete.length} templates deleted successfully!`);
        await refreshData();
        return true;
      } catch (err: any) {
        logger.error('❌ [TemplateActions] Error in bulk delete all:', err);
        toast.error('Failed to delete templates.');
        return false;
      }
    },

    getTemplateCount: async (type?: 'source' | 'page' | 'action', includeSystem = true) => {
      const items = templateData?.contentItems || [];
      return items.filter(item => 
        (!type || item.type === type) && (includeSystem || item.created_by !== null)
      ).length;
    }
  }), [templateData, refreshData]);

  return (
    <TemplateActionsContext.Provider value={actions}>
      {children}
    </TemplateActionsContext.Provider>
  );
};

// ===================================
// Template Filters Provider
// ===================================

export const TemplateFiltersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const templateData = useTemplateData();

  const filters = useMemo((): TemplateFilters => ({
    getTemplatesByType: (type: 'source' | 'page' | 'action') => {
      return templateData?.frontendTemplates.filter(t => t.type === type) || [];
    },

    getTemplatesByCategory: (category: string) => {
      return templateData?.frontendTemplates.filter(t => t.category === category) || [];
    },

    searchTemplates: (query: string) => {
      if (!query.trim()) return templateData?.frontendTemplates || [];
      
      const searchTerm = query.toLowerCase();
      return templateData?.frontendTemplates.filter(template =>
        template.name.toLowerCase().includes(searchTerm) ||
        template.description.toLowerCase().includes(searchTerm) ||
        template.category.toLowerCase().includes(searchTerm)
      ) || [];
    }
  }), [templateData?.frontendTemplates]);

  return (
    <TemplateFiltersContext.Provider value={filters}>
      {children}
    </TemplateFiltersContext.Provider>
  );
};

// ===================================
// Main Provider Composition
// ===================================

export const OptimizedTemplateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <TemplateDataProvider>
      <TemplateStatsProvider>
        <TemplateActionsProvider>
          <TemplateFiltersProvider>
            {children}
          </TemplateFiltersProvider>
        </TemplateActionsProvider>
      </TemplateStatsProvider>
    </TemplateDataProvider>
  );
};

// ===================================
// Custom Hooks
// ===================================

export const useTemplateData = (): TemplateData | null => {
  const context = useContext(TemplateDataContext);
  if (context === undefined) {
    throw new Error('useTemplateData must be used within a TemplateDataProvider');
  }
  return context;
};

export const useTemplateStats = (): TemplateStats | null => {
  const context = useContext(TemplateStatsContext);
  if (context === undefined) {
    throw new Error('useTemplateStats must be used within a TemplateStatsProvider');
  }
  return context;
};

export const useTemplateActions = (): TemplateActions => {
  const context = useContext(TemplateActionsContext);
  if (!context) {
    throw new Error('useTemplateActions must be used within a TemplateActionsProvider');
  }
  return context;
};

export const useTemplateFilters = (): TemplateFilters => {
  const context = useContext(TemplateFiltersContext);
  if (!context) {
    throw new Error('useTemplateFilters must be used within a TemplateFiltersProvider');
  }
  return context;
};

// Composite hook for backward compatibility
export const useOptimizedTemplateContext = () => {
  const data = useTemplateData();
  const stats = useTemplateStats();
  const actions = useTemplateActions();
  const filters = useTemplateFilters();

  return {
    // Data
    contentItems: data?.contentItems || [],
    frontendTemplates: data?.frontendTemplates || [],
    componentTemplates: data?.componentTemplates || [],
    loading: data?.loading || false,
    error: data?.error || null,

    // Stats
    systemStats: stats?.systemStats || null,

    // Actions
    createTemplate: actions.createTemplate,
    updateTemplate: actions.updateTemplate,
    deleteTemplate: actions.deleteTemplate,
    duplicateTemplate: actions.duplicateTemplate,
    refreshData: actions.refreshData,
    bulkDeleteByType: actions.bulkDeleteByType,
    bulkDeleteAll: actions.bulkDeleteAll,
    getTemplateCount: actions.getTemplateCount,

    // Filters
    getTemplatesByType: filters.getTemplatesByType,
    getTemplatesByCategory: filters.getTemplatesByCategory,
    searchTemplates: filters.searchTemplates
  };
}; 