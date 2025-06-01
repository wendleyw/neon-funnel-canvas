
import { ComponentTemplate } from '../types/funnel';
import { componentTemplates } from './componentTemplates';

export interface SidebarCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  templates: ComponentTemplate[];
}

// Helper function to get templates by type
const getTemplatesByTypes = (types: string[]): ComponentTemplate[] => {
  return types.map(type => 
    componentTemplates.find(template => template.type === type)
  ).filter(Boolean) as ComponentTemplate[];
};

export const modernSidebarCategories: SidebarCategory[] = [
  {
    id: 'traffic-organic',
    name: 'Tráfego Orgânico',
    icon: '🌱',
    color: '#22C55E',
    description: 'Estratégias de tráfego orgânico',
    templates: getTemplatesByTypes([
      'instagram-post',
      'instagram-story', 
      'instagram-reels',
      'instagram-carousel',
      'tiktok-video',
      'youtube-short',
      'youtube-video',
      'youtube-thumbnail',
      'facebook-post',
      'linkedin-post',
      'twitter-post'
    ])
  },
  {
    id: 'traffic-paid',
    name: 'Tráfego Pago',
    icon: '💰',
    color: '#EF4444',
    description: 'Campanhas de tráfego pago',
    templates: getTemplatesByTypes([
      'facebook-ad',
      'instagram-ad',
      'google-ad',
      'youtube-ad'
    ])
  },
  {
    id: 'lead-capture',
    name: 'Captura de Leads',
    icon: '🎯',
    color: '#3B82F6',
    description: 'Ferramentas para capturar leads',
    templates: getTemplatesByTypes([
      'landing-page',
      'form',
      'quiz',
      'lead-magnet'
    ])
  },
  {
    id: 'nurturing',
    name: 'Nutrição',
    icon: '🌿',
    color: '#8B5CF6',
    description: 'Sequências de nutrição',
    templates: getTemplatesByTypes([
      'email-sequence',
      'automation',
      'segmentation'
    ])
  },
  {
    id: 'conversion',
    name: 'Conversão',
    icon: '💎',
    color: '#F59E0B',
    description: 'Páginas de conversão',
    templates: getTemplatesByTypes([
      'sales-page',
      'webinar-vsl',
      'checkout',
      'upsell'
    ])
  },
  {
    id: 'post-sales',
    name: 'Pós-Venda',
    icon: '🎉',
    color: '#10B981',
    description: 'Estratégias pós-venda',
    templates: getTemplatesByTypes([
      'onboarding',
      'support',
      'feedback'
    ])
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: '📊',
    color: '#6366F1',
    description: 'Análise e métricas',
    templates: getTemplatesByTypes([
      'analytics',
      'conversion-tracking',
      'reports'
    ])
  },
  {
    id: 'visual-helpers',
    name: 'Helpers Visuais',
    icon: '🎨',
    color: '#EC4899',
    description: 'Componentes para organização visual',
    templates: getTemplatesByTypes([
      'note',
      'arrow', 
      'frame'
    ])
  }
];

// Helper function for searching templates
export const searchModernTemplates = (query: string): ComponentTemplate[] => {
  const lowerQuery = query.toLowerCase();
  return componentTemplates.filter(template => 
    template.label.toLowerCase().includes(lowerQuery) ||
    template.type.toLowerCase().includes(lowerQuery) ||
    template.defaultProps.description?.toLowerCase().includes(lowerQuery)
  );
};
