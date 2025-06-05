import { ComponentTemplate } from '../types/funnel';
import { MARKETING_COMPONENT_TEMPLATES } from './componentTemplates';

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
    MARKETING_COMPONENT_TEMPLATES.find(template => template.type === type)
  ).filter(Boolean) as ComponentTemplate[];
};

export const modernSidebarCategories: SidebarCategory[] = [
  {
    id: 'traffic-organic',
    name: 'Organic Traffic',
    icon: '🌱',
    color: '#22C55E',
    description: 'Organic traffic strategies',
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
    name: 'Paid Traffic',
    icon: '📢',
    color: '#EF4444',
    description: 'Paid traffic campaigns',
    templates: getTemplatesByTypes([
      'facebook-ad',
      'instagram-ad',
      'google-ad',
      'youtube-ad'
    ])
  },
  {
    id: 'lead-capture',
    name: 'Lead Capture',
    icon: 'Target',
    color: '#3B82F6',
    description: 'Tools to capture leads',
    templates: getTemplatesByTypes([
      'opt-in-page',
      'landing-page',
      'lead-magnet'
    ])
  },
  {
    id: 'nurturing',
    name: 'Nurturing',
    icon: 'Mail',
    color: '#8B5CF6',
    description: 'Nurturing sequences',
    templates: getTemplatesByTypes([
      'email-sequence',
      'drip-campaign',
      'newsletter'
    ])
  },
  {
    id: 'conversion',
    name: 'Conversion',
    icon: 'ShoppingCart',
    color: '#10B981',
    description: 'Conversion pages',
    templates: getTemplatesByTypes([
      'sales-page',
      'checkout',
      'upsell'
    ])
  },
  {
    id: 'post-sale',
    name: 'Post-Sale',
    icon: 'Award',
    color: '#F59E0B',
    description: 'Post-sale strategies',
    templates: getTemplatesByTypes([
      'thank-you-page',
      'delivery-page',
      'support'
    ])
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: '📊',
    color: '#6366F1',
    description: 'Analysis and metrics',
    templates: getTemplatesByTypes([
      'analytics',
      'conversion-tracking',
      'reports'
    ])
  },
  {
    id: 'visual-helpers',
    name: 'Visual Helpers',
    icon: '🎨',
    color: '#EC4899',
    description: 'Components for visual organization',
    templates: getTemplatesByTypes([
      'note',
      'arrow', 
      'frame'
    ])
  }
];

// Helper function for searching templates - EXPORTADA AQUI
export const searchModernTemplates = (query: string): ComponentTemplate[] => {
  const lowerQuery = query.toLowerCase();
  return MARKETING_COMPONENT_TEMPLATES.filter(template => 
    template.label.toLowerCase().includes(lowerQuery) ||
    template.type.toLowerCase().includes(lowerQuery) ||
    template.defaultProps.description?.toLowerCase().includes(lowerQuery)
  );
};
