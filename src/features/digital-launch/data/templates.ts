
import { ComponentTemplate } from '../../../types/funnel';

export const digitalLaunchTemplates: ComponentTemplate[] = [
  {
    type: 'offer',
    icon: '🎁',
    label: 'Oferta',
    color: '#DC2626',
    defaultData: {
      title: 'Nova Oferta',
      description: 'Produto/serviço principal + bônus e garantia',
      status: 'draft',
      properties: {
        mainProduct: '',
        bonuses: [],
        valueProposition: '',
        guarantee: '',
        price: 0,
        urgencyFactor: ''
      }
    }
  },
  {
    type: 'target-audience',
    icon: '🎯',
    label: 'Público-alvo',
    color: '#7C3AED',
    defaultData: {
      title: 'Avatar/Persona',
      description: 'Definição detalhada do público-alvo',
      status: 'draft',
      properties: {
        avatar: '',
        painPoints: [],
        desires: [],
        channels: [],
        demographics: {}
      }
    }
  },
  {
    type: 'traffic-organic',
    icon: '🌱',
    label: 'Tráfego Orgânico',
    color: '#059669',
    defaultData: {
      title: 'Tráfego Orgânico',
      description: 'Conteúdo gratuito, posts, vídeos, lives',
      status: 'draft',
      properties: {
        platforms: [],
        contentTypes: [],
        frequency: '',
        topics: []
      }
    }
  },
  {
    type: 'traffic-paid',
    icon: '💰',
    label: 'Tráfego Pago',
    color: '#EA580C',
    defaultData: {
      title: 'Tráfego Pago',
      description: 'Facebook Ads, Google Ads, Instagram Ads',
      status: 'draft',
      properties: {
        platforms: [],
        budget: 0,
        targetingCriteria: [],
        adTypes: []
      }
    }
  },
  {
    type: 'lead-capture',
    icon: '📥',
    label: 'Captura de Leads',
    color: '#2563EB',
    defaultData: {
      title: 'Página de Captura',
      description: 'Landing page com oferta gratuita (lead magnet)',
      status: 'draft',
      properties: {
        leadMagnet: '',
        headline: '',
        formFields: ['email'],
        crmIntegration: ''
      }
    }
  },
  {
    type: 'nurturing',
    icon: '💌',
    label: 'Nutrição',
    color: '#DB2777',
    defaultData: {
      title: 'Sequência de Nutrição',
      description: 'E-mails/mensagens para construir relacionamento',
      status: 'draft',
      properties: {
        emailSequence: [],
        contentTopics: [],
        socialProof: [],
        duration: ''
      }
    }
  },
  {
    type: 'webinar-vsl',
    icon: '🎬',
    label: 'Webinar/VSL',
    color: '#7C2D12',
    defaultData: {
      title: 'Apresentação Principal',
      description: 'Webinar ou VSL com pitch da oferta',
      status: 'draft',
      properties: {
        type: 'webinar',
        duration: '',
        outline: [],
        objectionHandling: [],
        cta: ''
      }
    }
  },
  {
    type: 'sales-page',
    icon: '📄',
    label: 'Página de Vendas',
    color: '#B91C1C',
    defaultData: {
      title: 'Página de Vendas',
      description: 'Descrição detalhada com benefícios e depoimentos',
      status: 'draft',
      properties: {
        benefits: [],
        testimonials: [],
        faq: [],
        pricing: {},
        guarantees: []
      }
    }
  },
  {
    type: 'checkout-upsell',
    icon: '💳',
    label: 'Checkout + Upsell',
    color: '#991B1B',
    defaultData: {
      title: 'Finalização + Ofertas',
      description: 'Checkout integrado com upsells e downsells',
      status: 'draft',
      properties: {
        paymentMethods: [],
        upsells: [],
        downsells: [],
        platform: ''
      }
    }
  },
  {
    type: 'post-sale',
    icon: '🎉',
    label: 'Pós-venda',
    color: '#166534',
    defaultData: {
      title: 'Pós-venda',
      description: 'Entrega, suporte e acompanhamento',
      status: 'draft',
      properties: {
        deliveryProcess: '',
        supportChannels: [],
        followUpSequence: [],
        futureOffers: []
      }
    }
  },
  {
    type: 'analytics-optimization',
    icon: '📊',
    label: 'Análise & Otimização',
    color: '#0891B2',
    defaultData: {
      title: 'Métricas e Otimização',
      description: 'CPL, CTR, conversão, ROI e ajustes',
      status: 'draft',
      properties: {
        keyMetrics: ['CPL', 'CTR', 'Conversion Rate', 'ROI'],
        tools: ['Google Analytics', 'Facebook Pixel'],
        optimizationNotes: []
      }
    }
  }
];
