import { modernComponentTemplates } from './modernComponentTemplates';

interface SidebarCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  templates: string[];
}

export const modernSidebarCategories: SidebarCategory[] = [
  {
    id: 'general',
    name: 'Geral',
    icon: '⚙️',
    color: '#64748B',
    description: 'Componentes gerais',
    templates: [
      'landing-page',
      'form',
      'quiz',
      'email-sequence',
      'checkout',
      'automation',
      'analytics',
      'segmentation',
      'conversion',
      'custom'
    ]
  },
  {
    id: 'target-audience',
    name: 'Público Alvo',
    icon: '👤',
    color: '#F472B6',
    description: 'Definição do público alvo',
    templates: [
      'target-audience',
      'offer'
    ]
  },
  {
    id: 'traffic',
    name: 'Tráfego',
    icon: '🚗',
    color: '#3B82F6',
    description: 'Estratégias de tráfego',
    templates: [
      'traffic-organic',
      'traffic-paid'
    ]
  },
  {
    id: 'lead-capture',
    name: 'Captura de Leads',
    icon: '📧',
    color: '#10B981',
    description: 'Estratégias de captura de leads',
    templates: [
      'lead-capture'
    ]
  },
  {
    id: 'nurturing',
    name: 'Nutrição',
    icon: '💬',
    color: '#8B5CF6',
    description: 'Estratégias de nutrição de leads',
    templates: [
      'nurturing'
    ]
  },
  {
    id: 'webinar-vsl',
    name: 'Webinar/VSL',
    icon: '📺',
    color: '#F59E0B',
    description: 'Webinar ou VSL',
    templates: [
      'webinar-vsl'
    ]
  },
  {
    id: 'sales-page',
    name: 'Página de Vendas',
    icon: '💰',
    color: '#EF4444',
    description: 'Página de vendas',
    templates: [
      'sales-page'
    ]
  },
  {
    id: 'checkout-upsell',
    name: 'Checkout/Upsell',
    icon: '🛒',
    color: '#6366F1',
    description: 'Checkout e Upsell',
    templates: [
      'checkout-upsell'
    ]
  },
  {
    id: 'post-sales',
    name: 'Pós-Venda',
    icon: '🎁',
    color: '#14B8A6',
    description: 'Estratégias de pós-venda',
    templates: [
      'post-sales'
    ]
  },
  {
    id: 'analysis',
    name: 'Análise',
    icon: '📈',
    color: '#A855F7',
    description: 'Análise de dados',
    templates: [
      'analysis'
    ]
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    color: '#E4405F',
    description: 'Conteúdo para Instagram',
    templates: [
      'instagram-post',
      'instagram-story',
      'instagram-reels',
      'instagram-carousel'
    ]
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    color: '#000000',
    description: 'Conteúdo para TikTok',
    templates: [
      'tiktok-video'
    ]
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '▶️',
    color: '#FF0000',
    description: 'Conteúdo para YouTube',
    templates: [
      'youtube-short',
      'youtube-video',
      'youtube-thumbnail'
    ]
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'f',
    color: '#1877F2',
    description: 'Conteúdo para Facebook',
    templates: [
      'facebook-post',
      'facebook-ad'
    ]
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'in',
    color: '#0A66C2',
    description: 'Conteúdo para LinkedIn',
    templates: [
      'linkedin-post'
    ]
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: '🐦',
    color: '#1DA1F2',
    description: 'Conteúdo para Twitter',
    templates: [
      'twitter-post'
    ]
  },
  {
    id: 'traffic-organic',
    name: 'Tráfego Orgânico',
    icon: '🌱',
    color: '#22C55E',
    description: 'Estratégias de tráfego orgânico',
    templates: [
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
    ]
  },
  {
    id: 'traffic-paid',
    name: 'Tráfego Pago',
    icon: '💰',
    color: '#EF4444',
    description: 'Campanhas de tráfego pago',
    templates: [
      'facebook-ad',
      'instagram-ad',
      'google-ad',
      'youtube-ad'
    ]
  },
  {
    id: 'lead-capture',
    name: 'Captura de Leads',
    icon: '🎯',
    color: '#3B82F6',
    description: 'Ferramentas para capturar leads',
    templates: [
      'landing-page',
      'form',
      'quiz',
      'lead-magnet'
    ]
  },
  {
    id: 'nurturing',
    name: 'Nutrição',
    icon: '🌿',
    color: '#8B5CF6',
    description: 'Sequências de nutrição',
    templates: [
      'email-sequence',
      'automation',
      'segmentation'
    ]
  },
  {
    id: 'conversion',
    name: 'Conversão',
    icon: '💎',
    color: '#F59E0B',
    description: 'Páginas de conversão',
    templates: [
      'sales-page',
      'webinar-vsl',
      'checkout',
      'upsell'
    ]
  },
  {
    id: 'post-sales',
    name: 'Pós-Venda',
    icon: '🎉',
    color: '#10B981',
    description: 'Estratégias pós-venda',
    templates: [
      'onboarding',
      'support',
      'feedback'
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: '📊',
    color: '#6366F1',
    description: 'Análise e métricas',
    templates: [
      'analytics',
      'conversion-tracking',
      'reports'
    ]
  },
  {
    id: 'visual-helpers',
    name: 'Helpers Visuais',
    icon: '🎨',
    color: '#EC4899',
    description: 'Componentes para organização visual',
    templates: [
      'note',
      'arrow',
      'frame'
    ]
  }
];
