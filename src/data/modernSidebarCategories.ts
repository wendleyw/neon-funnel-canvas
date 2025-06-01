
import { ComponentTemplate } from '../types/funnel';

// Templates organizados por categoria
export const modernSidebarCategories = {
  planning: {
    id: 'planning',
    title: 'PLANEJAMENTO & ESTRATÉGIA',
    icon: '🎯',
    templates: [
      {
        type: 'target-audience',
        label: 'Público-alvo',
        icon: '👥',
        color: '#7c3aed',
        category: 'planning',
        defaultProps: {
          title: 'Definição de Público-alvo',
          description: 'Identifique e defina seu público-alvo ideal',
          status: 'draft' as const,
          properties: {}
        }
      },
      {
        type: 'offer',
        label: 'Oferta',
        icon: '🎁',
        color: '#dc2626',
        category: 'planning', 
        defaultProps: {
          title: 'Estrutura da Oferta',
          description: 'Defina sua proposta de valor e oferta principal',
          status: 'draft' as const,
          properties: {}
        }
      }
    ] as ComponentTemplate[]
  },
  traffic: {
    id: 'traffic',
    title: 'ATRAÇÃO DE TRÁFEGO',
    icon: '📈',
    templates: [
      {
        type: 'organic-traffic',
        label: 'Tráfego Orgânico',
        icon: '🌱',
        color: '#16a34a',
        category: 'traffic',
        defaultProps: {
          title: 'Estratégia de Tráfego Orgânico',
          description: 'SEO, conteúdo e estratégias orgânicas',
          status: 'draft' as const,
          properties: {}
        }
      },
      {
        type: 'paid-traffic',
        label: 'Tráfego Pago',
        icon: '💰',
        color: '#ea580c',
        category: 'traffic',
        defaultProps: {
          title: 'Campanhas de Tráfego Pago',
          description: 'Ads, remarketing e campanhas pagas',
          status: 'draft' as const,
          properties: {}
        }
      }
    ] as ComponentTemplate[]
  },
  social: {
    id: 'social',
    title: 'REDES SOCIAIS',
    icon: '🎬',
    templates: [
      {
        type: 'instagram-post',
        label: 'Instagram Post',
        icon: '📸',
        color: '#e11d48',
        category: 'social',
        defaultProps: {
          title: 'Post do Instagram',
          description: 'Conteúdo para feed do Instagram',
          status: 'draft' as const,
          properties: {}
        }
      },
      {
        type: 'instagram-story',
        label: 'Instagram Story',
        icon: '⭕',
        color: '#f97316',
        category: 'social',
        defaultProps: {
          title: 'Story do Instagram',
          description: 'Conteúdo temporário para stories',
          status: 'draft' as const,
          properties: {}
        }
      },
      {
        type: 'tiktok-video',
        label: 'TikTok Vídeo',
        icon: '🎵',
        color: '#000000',
        category: 'social',
        defaultProps: {
          title: 'Vídeo do TikTok',
          description: 'Conteúdo viral para TikTok',
          status: 'draft' as const,
          properties: {}
        }
      },
      {
        type: 'youtube-video',
        label: 'YouTube Vídeo',
        icon: '▶️',
        color: '#dc2626',
        category: 'social',
        defaultProps: {
          title: 'Vídeo do YouTube',
          description: 'Conteúdo longo para YouTube',
          status: 'draft' as const,
          properties: {}
        }
      }
    ] as ComponentTemplate[]
  },
  conversion: {
    id: 'conversion',
    title: 'CONVERSÃO & CAPTURA',
    icon: '📝',
    templates: [
      {
        type: 'lead-capture',
        label: 'Captura de Leads',
        icon: '📧',
        color: '#2563eb',
        category: 'conversion',
        defaultProps: {
          title: 'Formulário de Captura',
          description: 'Capture leads qualificados',
          status: 'draft' as const,
          properties: {}
        }
      },
      {
        type: 'webinar',
        label: 'Webinar/VSL',
        icon: '🎥',
        color: '#92400e',
        category: 'conversion',
        defaultProps: {
          title: 'Webinar ou VSL',
          description: 'Apresentação para conversão',
          status: 'draft' as const,
          properties: {}
        }
      },
      {
        type: 'sales-page',
        label: 'Página de Vendas',
        icon: '💳',
        color: '#dc2626',
        category: 'conversion',
        defaultProps: {
          title: 'Página de Vendas',
          description: 'Landing page para conversão',
          status: 'draft' as const,
          properties: {}
        }
      }
    ] as ComponentTemplate[]
  },
  relationship: {
    id: 'relationship',
    title: 'RELACIONAMENTO',
    icon: '💖',
    templates: [
      {
        type: 'nurturing',
        label: 'Nutrição',
        icon: '💌',
        color: '#ec4899',
        category: 'relationship',
        defaultProps: {
          title: 'Sequência de Nutrição',
          description: 'Eduque e relacione-se com leads',
          status: 'draft' as const,
          properties: {}
        }
      }
    ] as ComponentTemplate[]
  },
  sales: {
    id: 'sales',
    title: 'VENDAS & FINALIZAÇÃO',
    icon: '💰',
    templates: [
      {
        type: 'checkout',
        label: 'Checkout + Upsell',
        icon: '🛒',
        color: '#7f1d1d',
        category: 'sales',
        defaultProps: {
          title: 'Processo de Checkout',
          description: 'Finalização e upsells',
          status: 'draft' as const,
          properties: {}
        }
      },
      {
        type: 'post-sale',
        label: 'Pós-venda',
        icon: '✅',
        color: '#16a34a',
        category: 'sales',
        defaultProps: {
          title: 'Acompanhamento Pós-venda',
          description: 'Entrega e suporte ao cliente',
          status: 'draft' as const,
          properties: {}
        }
      }
    ] as ComponentTemplate[]
  },
  analytics: {
    id: 'analytics',
    title: 'ANÁLISE & OTIMIZAÇÃO',
    icon: '📊',
    templates: [
      {
        type: 'analytics',
        label: 'Análise & Otimização',
        icon: '📈',
        color: '#0ea5e9',
        category: 'analytics',
        defaultProps: {
          title: 'Métricas e Otimização',
          description: 'Análise de performance e melhorias',
          status: 'draft' as const,
          properties: {}
        }
      }
    ] as ComponentTemplate[]
  }
} as const;

export const getAllModernTemplates = (): ComponentTemplate[] => {
  return Object.values(modernSidebarCategories).flatMap(category => category.templates);
};

export const searchModernTemplates = (query: string): ComponentTemplate[] => {
  const allTemplates = getAllModernTemplates();
  if (!query.trim()) return allTemplates;
  
  const searchTerm = query.toLowerCase();
  return allTemplates.filter(template => 
    template.label.toLowerCase().includes(searchTerm) ||
    template.defaultProps.title.toLowerCase().includes(searchTerm) ||
    template.defaultProps.description.toLowerCase().includes(searchTerm)
  );
};
