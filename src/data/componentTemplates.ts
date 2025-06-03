import { ComponentTemplate } from '../types/funnel';

export const MARKETING_COMPONENT_TEMPLATES: ComponentTemplate[] = [
  // ========================
  // FONTES DE TRÁFEGO (ESSENCIAIS)
  // ========================
  {
    type: 'facebook-ads',
    icon: '📘',
    label: 'Facebook Ads',
    color: '#1877F2',
    category: 'traffic-sources',
    title: 'Facebook Advertising',
    description: 'Facebook ad campaigns',
    defaultProps: {
      title: 'Facebook Ads Campaign',
      description: 'Targeted advertising on Facebook',
      status: 'draft',
      properties: {
        budget_daily: 50,
        target_audience: 'lookalike'
      }
    }
  },
  
  {
    type: 'google-ads',
    icon: '🔍',
    label: 'Google Ads',
    color: '#4285F4',
    category: 'traffic-sources',
    title: 'Google Advertising',
    description: 'Google search & display ads',
    defaultProps: {
      title: 'Google Ads Campaign',
      description: 'Search and display advertising',
      status: 'draft',
      properties: {
        campaign_type: 'search',
        quality_score: 8
      }
    }
  },

  {
    type: 'seo-organic',
    icon: '🌱',
    label: 'SEO Organic',
    color: '#34D399',
    category: 'traffic-sources',
    title: 'Organic Traffic',
    description: 'SEO organic traffic',
    defaultProps: {
      title: 'Organic SEO Traffic',
      description: 'Natural search traffic',
      status: 'active',
      properties: {
        search_volume: 'medium'
      }
    }
  },

  // ========================
  // CAPTURA DE LEADS (ESSENCIAIS)
  // ========================
  {
    type: 'landing-page',
    icon: '🎯',
    label: 'Landing Page',
    color: '#3B82F6',
    category: 'lead-capture',
    title: 'Landing Page',
    description: 'High-converting landing page',
    defaultProps: {
      title: 'Landing Page',
      description: 'Focused page for conversions',
      status: 'draft',
      properties: {
        conversion_goal: 'lead_capture'
      }
    }
  },

  {
    type: 'lead-magnet',
    icon: '🧲',
    label: 'Lead Magnet',
    color: '#10B981',
    category: 'lead-capture',
    title: 'Lead Magnet',
    description: 'Free content for leads',
    defaultProps: {
      title: 'Lead Magnet',
      description: 'Valuable free content',
      status: 'draft',
      properties: {
        magnet_type: 'ebook'
      }
    }
  },

  {
    type: 'webinar',
    icon: '🎥',
    label: 'Webinar',
    color: '#8B5CF6',
    category: 'lead-capture',
    title: 'Webinar',
    description: 'Educational webinar',
    defaultProps: {
      title: 'Webinar',
      description: 'Live educational session',
      status: 'draft',
      properties: {
        duration_minutes: 60
      }
    }
  },

  // ========================
  // NUTRIÇÃO (ESSENCIAIS)
  // ========================
  {
    type: 'email-sequence',
    icon: '📧',
    label: 'Email Sequence',
    color: '#EF4444',
    category: 'nurturing',
    title: 'Email Sequence',
    description: 'Automated email series',
    defaultProps: {
      title: 'Email Sequence',
      description: 'Automated nurturing emails',
      status: 'draft',
      properties: {
        email_count: 7
      }
    }
  },

  // ========================
  // VENDAS (ESSENCIAIS)
  // ========================
  {
    type: 'sales-page',
    icon: '💰',
    label: 'Sales Page',
    color: '#DC2626',
    category: 'sales-conversion',
    title: 'Sales Page',
    description: 'High-converting sales page',
    defaultProps: {
      title: 'Sales Page',
      description: 'Detailed sales page',
      status: 'draft',
      properties: {
        price_point: 'mid_ticket'
      }
    }
  },

  {
    type: 'checkout',
    icon: '🛒',
    label: 'Checkout',
    color: '#059669',
    category: 'sales-conversion',
    title: 'Checkout',
    description: 'Checkout process',
    defaultProps: {
      title: 'Checkout',
      description: 'Payment process',
      status: 'draft',
      properties: {
        checkout_type: 'one_page'
      }
    }
  },

  // ========================
  // FASE 2: DIAGRAMAS (MÍNIMOS)
  // ========================
  {
    type: 'funnel-stage',
    icon: '🎯',
    label: 'Funnel Stage',
    color: '#3B82F6',
    category: 'funnel-diagrams',
    diagramType: 'marketing-funnel',
    title: 'Funnel Stage',
    description: 'Stage with metrics',
    defaultProps: {
      title: 'Awareness Stage',
      description: 'Top of funnel stage',
      status: 'active',
      metrics: {
        visitors: 10000,
        conversions: 1000,
        conversionRate: 10
      },
      properties: {
        stage_type: 'awareness'
      }
    }
  },

  {
    type: 'journey-stage',
    icon: '🗺️',
    label: 'Journey Stage',
    color: '#8B5CF6',
    category: 'journey-maps',
    diagramType: 'customer-journey',
    title: 'Journey Stage',
    description: 'Customer journey stage',
    defaultProps: {
      title: 'Awareness',
      description: 'Customer becomes aware',
      status: 'active',
      journey: {
        stage: 'awareness',
        emotion: 'neutral',
        intensity: 3
      },
      properties: {
        duration: '1-2 weeks'
      }
    }
  },

  {
    type: 'flow-process',
    icon: '⚙️',
    label: 'Process Step',
    color: '#3B82F6',
    category: 'process-flows',
    diagramType: 'process-flow',
    title: 'Process Step',
    description: 'Process action step',
    defaultProps: {
      title: 'Process Data',
      description: 'Process and validate data',
      status: 'active',
      process: {
        flowType: 'process',
        responsible: 'system'
      },
      properties: {
        automation_level: 'automated'
      }
    }
  },

  // ========================
  // SOCIAL MEDIA (NOVO)
  // ========================
  {
    type: 'instagram-grid',
    icon: '📱',
    label: 'Instagram Grid',
    color: '#E4405F',
    category: 'social-media',
    title: 'Instagram Grid',
    description: 'Preview and manage your Instagram posts before publishing',
    defaultProps: {
      title: 'Instagram Grid',
      description: 'Visual content planner for Instagram',
      status: 'active',
      properties: {
        posts_count: 9,
        engagement_rate: 4.2,
        upcoming_posts: 3,
        grid_layout: '3x3'
      }
    }
  }
];

// Organizar templates por categoria SIMPLIFICADO
export const TEMPLATE_CATEGORIES = {
  'traffic-sources': {
    label: '🚀 Traffic Sources',
    description: 'Generate traffic',
    color: '#3B82F6'
  },
  'lead-capture': {
    label: '🎯 Lead Capture',
    description: 'Capture leads',
    color: '#10B981'
  },
  'nurturing': {
    label: '🤝 Nurturing', 
    description: 'Nurture relationships',
    color: '#F59E0B'
  },
  'sales-conversion': {
    label: '💰 Sales',
    description: 'Convert to sales',
    color: '#EF4444'
  },
  'social-media': {
    label: '📱 Social Media',
    description: 'Social media management',
    color: '#E4405F'
  },
  
  // Fase 2 - Apenas essenciais
  'funnel-diagrams': {
    label: '🎯 Funnel Diagrams',
    description: 'Funnel with metrics',
    color: '#3B82F6'
  },
  'journey-maps': {
    label: '🗺️ Journey Maps',
    description: 'Customer journey',
    color: '#8B5CF6'
  },
  'process-flows': {
    label: '⚡ Process Flows',
    description: 'Process diagrams',
    color: '#F59E0B'
  }
};

export default MARKETING_COMPONENT_TEMPLATES;
