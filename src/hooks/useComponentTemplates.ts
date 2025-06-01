
import { useState, useCallback, useMemo } from 'react';
import { ComponentTemplate } from '../types/funnel';
import { defaultTemplates } from '../data/componentTemplates';

export const useComponentTemplates = () => {
  const [customTemplates, setCustomTemplates] = useState<ComponentTemplate[]>([]);

  const addCustomTemplate = useCallback((template: ComponentTemplate) => {
    // Gera um tipo único para o template customizado
    const customType = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newTemplate: ComponentTemplate = {
      ...template,
      type: customType as any
    };
    
    console.log('Adding custom template:', newTemplate);
    setCustomTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  }, []);

  const removeCustomTemplate = useCallback((type: string) => {
    console.log('Removing custom template:', type);
    setCustomTemplates(prev => prev.filter(template => template.type !== type));
  }, []);

  // Memoiza os templates para evitar re-renders desnecessários
  const allTemplates = useMemo(() => {
    return [...defaultTemplates, ...customTemplates];
  }, [customTemplates]);

  return {
    defaultTemplates,
    customTemplates,
    allTemplates,
    addCustomTemplate,
    removeCustomTemplate
  };
};
