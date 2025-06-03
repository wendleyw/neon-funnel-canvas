import { useMemo } from 'react';
import { ComponentTemplate } from '../types/funnel';
import { MARKETING_COMPONENT_TEMPLATES, TEMPLATE_CATEGORIES } from '../data/componentTemplates';

// Templates para elementos visuais básicos (mantidos separados)
const VISUAL_HELPERS_TEMPLATES: ComponentTemplate[] = [
  {
    type: 'note',
    icon: '📝',
    label: 'Nota Adesiva',
    color: '#FBBF24',
    category: 'visual-helpers',
    title: 'Nota',
    description: 'Clique para adicionar uma nota...',
    defaultProps: {
      title: 'Nota',
      description: 'Clique para adicionar uma nota...',
      status: 'draft',
      properties: {
        color: 'yellow'
      }
    }
  },
  {
    type: 'arrow',
    icon: '➡️',
    label: 'Seta',
    color: '#3B82F6',
    category: 'visual-helpers',
    title: 'Seta Direcional',
    description: 'Seta para indicar fluxo',
    defaultProps: {
      title: 'Seta Direcional',
      description: 'Seta para indicar fluxo',
      status: 'draft',
      properties: {
        direction: 'right',
        color: 'blue',
        size: 'medium'
      }
    }
  },
  {
    type: 'frame',
    icon: '⬜',
    label: 'Frame',
    color: '#6B7280',
    category: 'visual-helpers',
    title: 'Frame',
    description: 'Organize seus componentes aqui',
    defaultProps: {
      title: 'Frame',
      description: 'Organize seus componentes aqui',
      status: 'draft',
      properties: {
        color: 'blue',
        size: 'medium',
        borderStyle: 'solid'
      }
    }
  }
];

// Combinar todos os templates
const ALL_COMPONENT_TEMPLATES = [
  ...MARKETING_COMPONENT_TEMPLATES,
  ...VISUAL_HELPERS_TEMPLATES
];

// Adicionar categoria para visual helpers
const ALL_TEMPLATE_CATEGORIES = {
  ...TEMPLATE_CATEGORIES,
  'visual-helpers': {
    label: '🔧 Helpers Visuais',
    description: 'Elementos visuais para organização',
    color: '#6B7280'
  }
};

export const useComponentTemplates = () => {
  // Organizar templates por categoria
  const templatesByCategory = useMemo(() => {
    const grouped: Record<string, ComponentTemplate[]> = {};
    
    MARKETING_COMPONENT_TEMPLATES.forEach(template => {
      if (!grouped[template.category]) {
        grouped[template.category] = [];
      }
      grouped[template.category].push(template);
    });
    
    return grouped;
  }, []);

  // Informações das categorias
  const getCategoryInfo = (categoryKey: string) => {
    return TEMPLATE_CATEGORIES[categoryKey] || null;
  };

  // Categorias prioritárias (Fase 1 - Marketing)
  const getPriorityCategories = () => {
    return ['traffic-sources', 'lead-capture', 'nurturing', 'sales-conversion'];
  };

  // Categorias especializadas (Fase 2 - Diagramas)
  const getSpecializedDiagramCategories = () => {
    return ['funnel-diagrams', 'journey-maps', 'process-flows'];
  };

  // Categorias utilitárias (helpers visuais)
  const getUtilityCategories = () => {
    return []; // Removido para simplificar
  };

  // Template por tipo
  const getTemplateByType = (type: string): ComponentTemplate | undefined => {
    return MARKETING_COMPONENT_TEMPLATES.find(template => template.type === type);
  };

  // Filtrar templates
  const filterTemplates = (query: string): ComponentTemplate[] => {
    if (!query.trim()) return MARKETING_COMPONENT_TEMPLATES;
    
    const searchTerm = query.toLowerCase();
    return MARKETING_COMPONENT_TEMPLATES.filter(template =>
      template.label.toLowerCase().includes(searchTerm) ||
      template.description.toLowerCase().includes(searchTerm) ||
      getCategoryInfo(template.category)?.label.toLowerCase().includes(searchTerm)
    );
  };

  // Stats simplificados
  const getTemplateStats = () => {
    const priorityCount = getPriorityCategories().reduce((acc, cat) => 
      acc + (templatesByCategory[cat]?.length || 0), 0);
    
    const specializedCount = getSpecializedDiagramCategories().reduce((acc, cat) => 
      acc + (templatesByCategory[cat]?.length || 0), 0);
    
    return {
      total: MARKETING_COMPONENT_TEMPLATES.length,
      marketing: priorityCount,
      specialized: specializedCount,
      categories: Object.keys(templatesByCategory).length
    };
  };

  return {
    templates: MARKETING_COMPONENT_TEMPLATES,
    templatesByCategory,
    getCategoryInfo,
    getPriorityCategories,
    getSpecializedDiagramCategories,
    getUtilityCategories,
    getTemplateByType,
    filterTemplates,
    getTemplateStats
  };
};
