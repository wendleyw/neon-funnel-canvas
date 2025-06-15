import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ContentItem, FrontendTemplate, SystemStats, CreateContentData, UpdateContentData, DeleteOperationResult } from '../types/admin';
import { ComponentTemplate } from '../types/funnel';
import { contentService, bulkDeleteService, templateSyncService } from '../lib/supabase-admin';
import { toast } from 'sonner';
import { logger } from '../lib/logger';

// Context to manage all template state
interface TemplateContextType {
  // Data state
  contentItems: ContentItem[];
  frontendTemplates: FrontendTemplate[];
  componentTemplates: ComponentTemplate[];
  systemStats: SystemStats | null;
  loading: boolean;
  error: string | null;
  
  // CRUD Operations
  createTemplate: (data: CreateContentData) => Promise<ContentItem | null>;
  updateTemplate: (id: string, data: UpdateContentData) => Promise<ContentItem | null>;
  deleteTemplate: (id: string, forceDelete?: boolean) => Promise<boolean>;
  duplicateTemplate: (id: string) => Promise<ContentItem | null>;
  
  // System operations
  syncSystemTemplates: (type?: 'source' | 'page' | 'action') => Promise<boolean>;
  refreshData: () => Promise<void>;
  
  // Bulk delete operations
  bulkDeleteByType: (type: 'source' | 'page' | 'action', includeSystem?: boolean) => Promise<boolean>;
  bulkDeleteAll: (includeSystem?: boolean) => Promise<boolean>;
  getTemplateCount: (type?: 'source' | 'page' | 'action', includeSystem?: boolean) => Promise<number>;
  
  // Filters and search
  getTemplatesByType: (type: 'source' | 'page' | 'action') => FrontendTemplate[];
  getTemplatesByCategory: (category: string) => FrontendTemplate[];
  searchTemplates: (query: string) => FrontendTemplate[];
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

// Helper to convert ContentItem to FrontendTemplate
const mapContentItemToFrontendTemplate = (item: ContentItem): FrontendTemplate => ({
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
});

// Helper to convert FrontendTemplate to ComponentTemplate (for sidebar)
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
    defaultProps: {
      title: template.name,
      description: template.description,
      image: (template.config as any)?.mockupUrl || '',
      status: 'active',
      properties: {
        customMockup: (template.config as any)?.mockupUrl || ''
      }
    }
  };

  if ((template.config as any)?.mockupUrl) {
    logger.log('🔄 [TemplateContext] Converted ComponentTemplate with mockup:', {
      label: componentTemplate.label,
      defaultPropsImage: componentTemplate.defaultProps.image,
      customMockupProperty: componentTemplate.defaultProps.properties?.customMockup
    });
  }

  return componentTemplate;
};

interface TemplateProviderProps {
  children: ReactNode;
}

export const TemplateProvider: React.FC<TemplateProviderProps> = ({ children }) => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [frontendTemplates, setFrontendTemplates] = useState<FrontendTemplate[]>([]);
  const [componentTemplates, setComponentTemplates] = useState<ComponentTemplate[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to load all data
  const refreshData = useCallback(async () => {
    try {
      logger.log('🔄 [TemplateContext] Loading all template data...');
      setLoading(true);
      setError(null);

      // Load content data
      const { data: rawContentItems, error: contentError } = await contentService.getContent();

      if (contentError) throw contentError;

      const items = (rawContentItems || []) as ContentItem[];
      const mappedFrontendTemplates = items.map(mapContentItemToFrontendTemplate);
      const mappedComponentTemplates = [
        ...mappedFrontendTemplates.map(mapFrontendToComponentTemplate)
      ];

      // Calculate stats directly from the fetched data
      const calculateStats = (items: ContentItem[]): SystemStats => {
        const stats = {
          total: items.length,
          sources: items.filter(i => i.type === 'source').length,
          pages: items.filter(i => i.type === 'page').length,
          actions: items.filter(i => i.type === 'action').length,
          system: items.filter(i => i.created_by === null).length,
          user: items.filter(i => i.created_by !== null).length,
        };
        // This structure is a bit simplified compared to the original analyzeSystem,
        // but it provides the core numbers needed by the StreamlinedContentCRUD component.
        // We can expand this if more detailed stats are needed elsewhere.
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
                source: items.filter(i => i.type === 'source' && i.created_by === null).length,
                page: items.filter(i => i.type === 'page' && i.created_by === null).length,
                action: items.filter(i => i.type === 'action' && i.created_by === null).length,
              }
            },
            user: {
              total: stats.user,
              byType: {
                source: items.filter(i => i.type === 'source' && i.created_by !== null).length,
                page: items.filter(i => i.type === 'page' && i.created_by !== null).length,
                action: items.filter(i => i.type === 'action' && i.created_by !== null).length,
              }
            }
          },
          storage: { total_size: '0 B', total_files: 0 } // Mocked as it's not used in the dashboard
        };
      };

      const newStats = calculateStats(items);

      // Debug specific for a problematic item if needed
      const testemonicaItem = items.find(item => item.name.includes('testemonica'));
      if (testemonicaItem) {
        logger.log('🔍 [TemplateContext] DEBUG - testemonica raw data:', {
          name: testemonicaItem.name,
          config: testemonicaItem.config,
          configKeys: Object.keys(testemonicaItem.config || {}),
          mockupUrl: (testemonicaItem.config as any)?.mockupUrl
        });

        const frontendTemplate = mappedFrontendTemplates.find(t => t.name.includes('testemonica'));
        if (frontendTemplate) {
          logger.log('🔍 [TemplateContext] DEBUG - testemonica frontend template:', {
            name: frontendTemplate.name,
            config: frontendTemplate.config,
            mockupUrl: (frontendTemplate.config as any)?.mockupUrl
          });

          const componentTemplate = mappedComponentTemplates.find(t => t.label.includes('testemonica'));
          if (componentTemplate) {
            logger.log('🔍 [TemplateContext] DEBUG - testemonica component template:', {
              label: componentTemplate.label,
              defaultPropsImage: componentTemplate.defaultProps.image,
              customMockup: componentTemplate.defaultProps.properties?.customMockup
            });
          }
        }
      }

      // Update all states
      setContentItems(items);
      setFrontendTemplates(mappedFrontendTemplates);
      setComponentTemplates(mappedComponentTemplates);
      setSystemStats(newStats);
      

      logger.log('✅ [TemplateContext] Data loaded successfully:', {
        contentItems: items.length,
        frontendTemplates: mappedFrontendTemplates.length,
        componentTemplates: mappedComponentTemplates.length,
        stats: newStats.database.byType
      });

    } catch (err: any) {
      logger.error('❌ [TemplateContext] Error loading data:', err);
      setError(err.message || 'An unexpected error occurred');
      toast.error('Failed to load template data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);
  
  // ====================================================================
  // CRUD Operations
  // ====================================================================

  const createTemplate = useCallback(async (data: CreateContentData) => {
    try {
      logger.log('➕ [TemplateContext] Creating template:', data.name);
      toast.loading('Creating template...');
      const { data: newItem, error } = await contentService.createContent(data);
      toast.dismiss();
      if (error) throw error;
      
      if (!newItem) {
        throw new Error("Creation returned no data.");
      }

      toast.success(`Template "${newItem.name}" created successfully!`);
      await refreshData();
      return newItem;
    } catch (err: any) {
      logger.error('❌ [TemplateContext] Error creating template:', err);
      toast.error(err.message || 'Failed to create template.');
      return null;
    }
  }, [refreshData]);

  const updateTemplate = useCallback(async (id: string, data: UpdateContentData) => {
    try {
      logger.log('🔄 [TemplateContext] Updating template:', id);
      toast.loading('Updating template...');
      const { data: updatedItem, error } = await contentService.updateContent(id, data);
      toast.dismiss();
      if (error) throw error;
      
      if (!updatedItem) {
        throw new Error("Update returned no data.");
      }

      toast.success(`Template "${updatedItem.name}" updated successfully!`);
      await refreshData();
      return updatedItem;
    } catch (err: any) {
      logger.error('❌ [TemplateContext] Error updating template:', err);
      toast.error(err.message || 'Failed to update template.');
      return null;
    }
  }, [refreshData]);
  
  const deleteTemplate = useCallback(async (id: string, forceDelete = false) => {
    try {
      logger.log(`🗑️ [TemplateContext] Deleting template: ${id} (Force: ${forceDelete})`);
      toast.loading('Deleting template...');
      
      const { data, error } = await contentService.deleteContent(id);
      toast.dismiss();
      if (error) throw error;

      // Assuming data is of type DeleteOperationResult after a successful delete
      const result = data as unknown as DeleteOperationResult;
      if (result.success) {
        toast.success(result.message);
        await refreshData();
        return true;
      } else {
        toast.warning(result.message || 'Delete operation failed without a message.');
        return false;
      }
    } catch (err: any) {
      logger.error('❌ [TemplateContext] Error deleting template:', err);
      toast.error(err.message || 'Failed to delete template.');
      return false;
    }
  }, [refreshData]);

  const duplicateTemplate = useCallback(async (id: string) => {
    try {
      logger.log(`🐑 [TemplateContext] Duplicating template: ${id}`);
      toast.loading('Duplicating template...');
      
      // First, get the original item's data
      const originalItem = contentItems.find(item => item.id === id);
      if (!originalItem) {
        throw new Error('Template not found for duplication.');
      }
      
      // Prepare the data for a new item
      const duplicateData: CreateContentData = {
        ...originalItem,
        name: `${originalItem.name} (Copy)`,
        // Reset system-specific or instance-specific fields
        created_by: originalItem.created_by, // Or set to the current user's ID
        status: 'draft',
      };
      
      // Create the new item
      const { data: newItem, error } = await contentService.createContent(duplicateData);
      toast.dismiss();
      if (error) throw error;
      
      toast.success(`Template "${originalItem.name}" duplicated successfully!`);
      await refreshData();
      return newItem;
    } catch (err: any) {
      logger.error('❌ [TemplateContext] Error duplicating template:', err);
      toast.error(err.message || 'Failed to duplicate template.');
      return null;
    }
  }, [contentItems, refreshData]);

  // ====================================================================
  // System & Bulk Operations
  // ====================================================================

  const syncSystemTemplates = useCallback(async (type?: 'source' | 'page' | 'action') => {
    try {
      const syncType = type || 'all';
      logger.log(`🔄 [TemplateContext] Syncing ${syncType} system templates...`);
      toast.loading(`Syncing ${syncType} templates...`);
      
      const result = await templateSyncService.syncTemplatesByType(type!);
      toast.dismiss();
      
      if (result.error) {
        throw result.error;
      }
      
      if (result.data && result.data.length > 0) {
        toast.success(`Successfully synced ${result.data.length} ${syncType} templates!`);
      } else {
        toast.success('Templates sync completed.');
      }

      await refreshData();
      return true;
    } catch (err: any) {
      logger.error('❌ [TemplateContext] Error syncing templates:', err);
      toast.error(err.message || 'Failed to sync templates.');
      return false;
    }
  }, [refreshData]);
  
  const bulkDeleteByType = useCallback(async (type: 'source' | 'page' | 'action', includeSystem = false) => {
    const confirmation = window.prompt(
      `This is a destructive action. You are about to delete all ${type} templates. ` +
      (includeSystem ? 'This INCLUDES system templates. ' : 'This excludes system templates. ') +
      `To proceed, type "delete ${type}s".`
    );

    if (confirmation !== `delete ${type}s`) {
      toast.info('Bulk delete cancelled.');
      return false;
    }
    
    try {
      logger.log(`🗑️ [TemplateContext] Bulk deleting ${type}s (System: ${includeSystem})`);
      toast.loading(`Deleting all ${type} templates...`);
      const { data, error } = await bulkDeleteService.deleteAllByType(type, includeSystem);
      toast.dismiss();
      if (error) throw error;
      
      if (!data) {
        throw new Error("Bulk delete returned no data.");
      }

      toast.success(`${data.deletedCount} ${type} templates deleted.`);
      await refreshData();
      return true;
    } catch (err: any) {
      logger.error(`❌ [TemplateContext] Error bulk deleting ${type}s:`, err);
      toast.error(err.message || `Failed to delete ${type} templates.`);
      return false;
    }
  }, [refreshData]);

  const bulkDeleteAll = useCallback(async (includeSystem = false) => {
    const confirmation = window.prompt(
      `DANGER! You are about to delete ALL templates. ` +
      (includeSystem ? 'This INCLUDES system templates. ' : 'This excludes system templates. ') +
      `To proceed, type "delete all".`
    );

    if (confirmation !== 'delete all') {
      toast.info('Bulk delete cancelled.');
      return false;
    }

    try {
      logger.log(`🗑️ [TemplateContext] Bulk deleting ALL templates (System: ${includeSystem})`);
      toast.loading('Deleting all templates...');
      const { data, error } = await bulkDeleteService.deleteAllTemplates(includeSystem);
      toast.dismiss();
      if (error) throw error;
      
      if (!data) {
        throw new Error("Bulk delete returned no data.");
      }
      
      toast.success(`${data.deletedCount} templates deleted.`);
      await refreshData();
      return true;
    } catch (err: any) {
      logger.error('❌ [TemplateContext] Error bulk deleting all:', err);
      toast.error(err.message || 'Failed to delete all templates.');
      return false;
    }
  }, [refreshData]);

  const getTemplateCount = useCallback(async (type?: 'source' | 'page' | 'action', includeSystem = true) => {
    // This can now be derived from state, but an async DB call might be needed for real-time counts
    let itemsToCount = contentItems;
    if (!includeSystem) {
      itemsToCount = itemsToCount.filter(item => item.created_by !== null);
    }
    if (type) {
      itemsToCount = itemsToCount.filter(item => item.type === type);
    }
    return itemsToCount.length;
  }, [contentItems]);


  // ====================================================================
  // Filtering and Searching (derived from state)
  // ====================================================================
  
  const getTemplatesByType = useCallback((type: 'source' | 'page' | 'action') => {
    return frontendTemplates.filter(t => t.type === type);
  }, [frontendTemplates]);

  const getTemplatesByCategory = useCallback((category: string) => {
    return frontendTemplates.filter(t => t.category.toLowerCase() === category.toLowerCase());
  }, [frontendTemplates]);

  const searchTemplates = useCallback((query: string) => {
    const lowercasedQuery = query.toLowerCase();
    if (!lowercasedQuery) return frontendTemplates;
    
    return frontendTemplates.filter(t => 
      t.name.toLowerCase().includes(lowercasedQuery) ||
      t.description.toLowerCase().includes(lowercasedQuery) ||
      t.category.toLowerCase().includes(lowercasedQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
    );
  }, [frontendTemplates]);


  const contextValue = {
    contentItems,
    frontendTemplates,
    componentTemplates,
    systemStats,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    syncSystemTemplates,
    refreshData,
    bulkDeleteByType,
    bulkDeleteAll,
    getTemplateCount,
    getTemplatesByType,
    getTemplatesByCategory,
    searchTemplates,
  };

  return (
    <TemplateContext.Provider value={contextValue}>
      {children}
    </TemplateContext.Provider>
  );
};

// Hook to use the context
export const useTemplateContext = (): TemplateContextType => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplateContext must be used within a TemplateProvider');
  }
  return context;
};
