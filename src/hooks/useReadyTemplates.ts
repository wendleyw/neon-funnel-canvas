
import { useState, useCallback } from 'react';
import { ReadyTemplate } from '../types/readyTemplates';
import { readyTemplates as defaultTemplates } from '../data/readyTemplates';
import { FunnelComponent, Connection } from '../types/funnel';

export const useReadyTemplates = () => {
  const [templates] = useState<ReadyTemplate[]>(defaultTemplates);

  const duplicateTemplate = useCallback((template: ReadyTemplate): { components: FunnelComponent[], connections: Connection[] } => {
    // Gerar novos IDs para componentes
    const componentIdMap = new Map<string, string>();
    
    const newComponents: FunnelComponent[] = template.components.map((component) => {
      const newId = `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      componentIdMap.set(component.id, newId);
      
      return {
        ...component,
        id: newId,
        data: {
          ...component.data,
          title: `${component.data.title} (Template)`
        }
      };
    });

    // Atualizar conexões com novos IDs
    const newConnections: Connection[] = template.connections.map((connection) => ({
      ...connection,
      id: `connection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      from: componentIdMap.get(connection.from) || connection.from,
      to: componentIdMap.get(connection.to) || connection.to
    }));

    return { components: newComponents, connections: newConnections };
  }, []);

  const getTemplatesByCategory = useCallback((category?: string) => {
    if (!category) return templates.filter(t => t.isActive);
    return templates.filter(t => t.category === category && t.isActive);
  }, [templates]);

  const getTemplatesByDifficulty = useCallback((difficulty?: string) => {
    if (!difficulty) return templates.filter(t => t.isActive);
    return templates.filter(t => t.difficulty === difficulty && t.isActive);
  }, [templates]);

  const searchTemplates = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return templates.filter(t => 
      t.isActive && (
        t.name.toLowerCase().includes(lowercaseQuery) ||
        t.description.toLowerCase().includes(lowercaseQuery) ||
        t.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
    );
  }, [templates]);

  return {
    templates: templates.filter(t => t.isActive),
    duplicateTemplate,
    getTemplatesByCategory,
    getTemplatesByDifficulty,
    searchTemplates
  };
};
