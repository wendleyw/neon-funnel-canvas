import { useMemo } from 'react';
import { ComponentTemplate } from '../../../types/funnel';
import { TEMPLATE_CATEGORIES } from '../../../data/componentTemplates';
import { useOptimizedTemplateContext } from '../../../contexts/OptimizedTemplateContext';

const ALL_TEMPLATE_CATEGORIES = {
  ...TEMPLATE_CATEGORIES,
  'custom': {
    label: '👤 Custom',
    description: 'User-created templates',
    color: '#10B981'
  }
};

// Hook refatorado para usar o OptimizedTemplateContext
export const useComponentTemplates = () => {
  // Usar o OptimizedTemplateContext como fonte única da verdade
  const { 
    componentTemplates: allTemplates,
    frontendTemplates,
    systemStats,
    loading,
    error 
  } = useOptimizedTemplateContext();

  const templatesByCategory = useMemo(() => {
    return allTemplates.reduce((acc, template) => {
      const category = template.category || 'custom';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(template);
      return acc;
    }, {} as Record<string, ComponentTemplate[]>);
  }, [allTemplates]);
  
  const getCategoryInfo = (categoryKey: string) => ALL_TEMPLATE_CATEGORIES[categoryKey] || null;
  
  const getPriorityCategories = () => ['traffic-sources', 'lead-capture', 'nurturing', 'sales-conversion'];
  const getSpecializedDiagramCategories = () => ['funnel-diagrams', 'journey-maps', 'process-flows'];
  
  // Função de refresh que delega para o OptimizedTemplateContext
  const refresh = () => {
    console.log('🔄 [useComponentTemplates] Refresh requested - delegating to OptimizedTemplateContext');
    // O Context já gerencia isso automaticamente
  };
  
  return {
    // Para sidebar (ComponentTemplate format) - vem do Context
    templates: allTemplates,
    templatesByCategory,
    
    // Para admin panel (ContentItem format) - vem do Context
    contentItems: frontendTemplates,
    systemStats,
    
    // Shared
    loading,
    error,
    refresh,
    getCategoryInfo,
    getPriorityCategories,
    getSpecializedDiagramCategories,
  };
};
