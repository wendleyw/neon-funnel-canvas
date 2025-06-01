
import { useState, useCallback } from 'react';
import { ComponentTemplate } from '../types/funnel';
import { componentTemplates as defaultTemplates } from '../data/componentTemplates';

export const useComponentTemplates = () => {
  const [customTemplates, setCustomTemplates] = useState<ComponentTemplate[]>([]);

  const addCustomTemplate = useCallback((template: ComponentTemplate) => {
    // Gera um tipo único para o template customizado
    const customType = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newTemplate = {
      ...template,
      type: customType as any
    };
    
    setCustomTemplates(prev => [...prev, newTemplate]);
  }, []);

  const removeCustomTemplate = useCallback((type: string) => {
    setCustomTemplates(prev => prev.filter(template => template.type !== type));
  }, []);

  const allTemplates = [...defaultTemplates, ...customTemplates];

  return {
    allTemplates,
    customTemplates,
    addCustomTemplate,
    removeCustomTemplate
  };
};
