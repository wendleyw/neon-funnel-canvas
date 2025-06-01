
import { useState, useCallback, useMemo } from 'react';
import { ComponentTemplate } from '../types/funnel';
import { componentTemplatesByCategory } from '../data/componentTemplates';
import { digitalLaunchTemplates } from '../features/digital-launch/data/templates';

export const useComponentTemplates = () => {
  const [customTemplates, setCustomTemplates] = useState<ComponentTemplate[]>([]);

  // Combine all templates from different sources
  const allTemplates = useMemo(() => {
    const categoryTemplates = Object.values(componentTemplatesByCategory).flat();
    return [
      ...categoryTemplates,
      ...digitalLaunchTemplates,
      ...customTemplates
    ];
  }, [customTemplates]);

  const addCustomTemplate = useCallback((template: ComponentTemplate) => {
    setCustomTemplates(prev => {
      const exists = prev.some(t => t.type === template.type);
      if (exists) {
        return prev.map(t => t.type === template.type ? template : t);
      }
      return [...prev, template];
    });
  }, []);

  const removeCustomTemplate = useCallback((type: string) => {
    setCustomTemplates(prev => prev.filter(t => t.type !== type));
  }, []);

  const getTemplateByType = useCallback((type: string) => {
    return allTemplates.find(t => t.type === type);
  }, [allTemplates]);

  return {
    allTemplates,
    customTemplates,
    digitalLaunchTemplates,
    categoryTemplates: Object.values(componentTemplatesByCategory).flat(),
    addCustomTemplate,
    removeCustomTemplate,
    getTemplateByType
  };
};
