
import { useMemo } from 'react';
import { ComponentTemplate } from '../types/funnel';
import { componentTemplates } from '../data/componentTemplates';

interface TemplateCache {
  all: ComponentTemplate[];
  byType: Map<string, ComponentTemplate>;
  byCategory: Map<string, ComponentTemplate[]>;
  search: (query: string) => ComponentTemplate[];
}

export const useTemplateCache = (): TemplateCache => {
  return useMemo(() => {
    const byType = new Map<string, ComponentTemplate>();
    const byCategory = new Map<string, ComponentTemplate[]>();

    // Pre-index templates by type and category
    componentTemplates.forEach(template => {
      byType.set(template.type, template);
      
      const categoryTemplates = byCategory.get(template.category) || [];
      categoryTemplates.push(template);
      byCategory.set(template.category, categoryTemplates);
    });

    const search = (query: string): ComponentTemplate[] => {
      if (!query.trim()) return componentTemplates;
      
      const lowerQuery = query.toLowerCase();
      return componentTemplates.filter(template => 
        template.label.toLowerCase().includes(lowerQuery) ||
        template.type.toLowerCase().includes(lowerQuery) ||
        template.category.toLowerCase().includes(lowerQuery) ||
        template.defaultProps.description?.toLowerCase().includes(lowerQuery)
      );
    };

    return {
      all: componentTemplates,
      byType,
      byCategory,
      search,
    };
  }, []);
};
