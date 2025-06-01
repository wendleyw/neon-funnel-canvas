
import { ComponentTemplate } from '../types/funnel';

export const defaultTemplates: ComponentTemplate[] = [
  // Categoria 1: Produto / Oferta
  {
    type: 'product-showcase',
    label: 'Vitrine do Produto',
    icon: '🛍️',
    color: 'bg-blue-500',
    category: 'product-offer',
    defaultProps: {
      title: 'Produto Principal',
      description: 'Apresente seu produto digital, físico ou serviço',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'bonus-section',
    label: 'Seção de Bônus',
    icon: '🎁',
    color: 'bg-blue-500',
    category: 'product-offer',
    defaultProps: {
      title: 'Bônus Exclusivos',
      description: 'Complementos e vantagens adicionais',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'guarantee-badge',
    label: 'Garantia',
    icon: '🛡️',
    color: 'bg-blue-500',
    category: 'product-offer',
    defaultProps: {
      title: 'Garantia de 30 dias',
      description: 'Reembolso garantido',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'pricing-table',
    label: 'Tabela de Preços',
    icon: '💰',
    color: 'bg-blue-500',
    category: 'product-offer',
    defaultProps: {
      title: 'Preços e Condições',
      description: 'Parcelamento e descontos disponíveis',
      status: 'draft',
      properties: {}
    }
  },

  // Categoria 2: Público-Alvo e Posicionamento
  {
    type: 'persona-card',
    label: 'Persona/Avatar',
    icon: '👤',
    color: 'bg-purple-500',
    category: 'target-audience',
    defaultProps: {
      title: 'Seu Avatar',
      description: 'Perfil detalhado do cliente ideal',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'brand-positioning',
    label: 'Posicionamento',
    icon: '🎯',
    color: 'bg-purple-500',
    category: 'target-audience',
    defaultProps: {
      title: 'Nossa Posição',
      description: 'Mensagem-chave e diferencial',
      status: 'draft',
      properties: {}
    }
  },

  // Categoria 3: Tráfego (Aquisição)
  {
    type: 'social-media-feed',
    label: 'Feed Redes Sociais',
    icon: '📱',
    color: 'bg-green-500',
    category: 'traffic-acquisition',
    defaultProps: {
      title: 'Conteúdo Orgânico',
      description: 'Posts para Instagram, YouTube, Blog',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'ad-campaign',
    label: 'Campanha de Anúncios',
    icon: '🎪',
    color: 'bg-green-500',
    category: 'traffic-acquisition',
    defaultProps: {
      title: 'Tráfego Pago',
      description: 'Facebook Ads, Google Ads, TikTok',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'affiliate-program',
    label: 'Programa de Afiliados',
    icon: '🤝',
    color: 'bg-green-500',
    category: 'traffic-acquisition',
    defaultProps: {
      title: 'Parcerias',
      description: 'Rede de afiliados e influenciadores',
      status: 'draft',
      properties: {}
    }
  },

  // Categoria 4: Captura de Leads
  {
    type: 'landing-page',
    label: 'Landing Page',
    icon: '📄',
    color: 'bg-yellow-500',
    category: 'lead-capture',
    defaultProps: {
      title: 'Página de Captura',
      description: 'Formulário para capturar leads',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'lead-magnet',
    label: 'Lead Magnet',
    icon: '🧲',
    color: 'bg-yellow-500',
    category: 'lead-capture',
    defaultProps: {
      title: 'Isca Digital',
      description: 'eBook, minicurso, checklist gratuito',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'contact-form',
    label: 'Formulário de Contato',
    icon: '📝',
    color: 'bg-yellow-500',
    category: 'lead-capture',
    defaultProps: {
      title: 'Formulário',
      description: 'Captura dados e integração CRM',
      status: 'draft',
      properties: {}
    }
  },

  // Categoria 5: Nutrição e Relacionamento
  {
    type: 'email-sequence',
    label: 'Sequência de E-mails',
    icon: '📧',
    color: 'bg-indigo-500',
    category: 'nurturing-relationship',
    defaultProps: {
      title: 'Automação de E-mail',
      description: 'Sequência educativa automática',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'content-library',
    label: 'Biblioteca de Conteúdo',
    icon: '📚',
    color: 'bg-indigo-500',
    category: 'nurturing-relationship',
    defaultProps: {
      title: 'Conteúdo de Valor',
      description: 'Vídeos, artigos, lives educativas',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'testimonials',
    label: 'Depoimentos',
    icon: '⭐',
    color: 'bg-indigo-500',
    category: 'nurturing-relationship',
    defaultProps: {
      title: 'Prova Social',
      description: 'Reviews, cases de sucesso',
      status: 'draft',
      properties: {}
    }
  },

  // Categoria 6: Engajamento e Conversão
  {
    type: 'webinar',
    label: 'Webinar',
    icon: '🎥',
    color: 'bg-red-500',
    category: 'engagement-conversion',
    defaultProps: {
      title: 'Webinar ao Vivo',
      description: 'Apresentação educativa e vendas',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'sales-video',
    label: 'Vídeo de Vendas',
    icon: '🎬',
    color: 'bg-red-500',
    category: 'engagement-conversion',
    defaultProps: {
      title: 'VSL - Video Sales Letter',
      description: 'Vídeo persuasivo de vendas',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'sales-call',
    label: 'Call de Vendas',
    icon: '☎️',
    color: 'bg-red-500',
    category: 'engagement-conversion',
    defaultProps: {
      title: 'Consulta de Vendas',
      description: 'Agendamento para produtos complexos',
      status: 'draft',
      properties: {}
    }
  },

  // Categoria 7: Venda e Checkout
  {
    type: 'sales-page',
    label: 'Página de Vendas',
    icon: '💳',
    color: 'bg-orange-500',
    category: 'sales-checkout',
    defaultProps: {
      title: 'Página de Vendas',
      description: 'Copy persuasiva com CTA',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'checkout-form',
    label: 'Checkout',
    icon: '🛒',
    color: 'bg-orange-500',
    category: 'sales-checkout',
    defaultProps: {
      title: 'Finalização',
      description: 'Integração Stripe, PayPal, Hotmart',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'upsell-offer',
    label: 'Oferta Upsell',
    icon: '⬆️',
    color: 'bg-orange-500',
    category: 'sales-checkout',
    defaultProps: {
      title: 'Upsell/Downsell',
      description: 'Ofertas complementares',
      status: 'draft',
      properties: {}
    }
  },

  // Categoria 8: Análise e Otimização
  {
    type: 'analytics-dashboard',
    label: 'Dashboard Analytics',
    icon: '📊',
    color: 'bg-teal-500',
    category: 'analytics-optimization',
    defaultProps: {
      title: 'Métricas e KPIs',
      description: 'CPL, CTR, conversão, ROI',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'tracking-pixels',
    label: 'Pixels de Tracking',
    icon: '📍',
    color: 'bg-teal-500',
    category: 'analytics-optimization',
    defaultProps: {
      title: 'Tracking Avançado',
      description: 'Facebook Pixel, Google Analytics',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'ab-testing',
    label: 'Teste A/B',
    icon: '🧪',
    color: 'bg-teal-500',
    category: 'analytics-optimization',
    defaultProps: {
      title: 'Testes A/B',
      description: 'Otimização baseada em dados',
      status: 'draft',
      properties: {}
    }
  },

  // Categoria 9: Pós-venda e Retenção
  {
    type: 'product-delivery',
    label: 'Entrega do Produto',
    icon: '📦',
    color: 'bg-pink-500',
    category: 'post-sale-retention',
    defaultProps: {
      title: 'Área de Membros',
      description: 'Entrega e acesso ao produto',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'customer-support',
    label: 'Suporte ao Cliente',
    icon: '🎧',
    color: 'bg-pink-500',
    category: 'post-sale-retention',
    defaultProps: {
      title: 'Central de Ajuda',
      description: 'FAQ, chat, tickets',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'referral-program',
    label: 'Programa de Indicação',
    icon: '🔄',
    color: 'bg-pink-500',
    category: 'post-sale-retention',
    defaultProps: {
      title: 'Indique e Ganhe',
      description: 'Sistema de recompensas',
      status: 'draft',
      properties: {}
    }
  }
];

export const componentTemplatesByCategory = {
  'product-offer': defaultTemplates.filter(t => t.category === 'product-offer'),
  'target-audience': defaultTemplates.filter(t => t.category === 'target-audience'),
  'traffic-acquisition': defaultTemplates.filter(t => t.category === 'traffic-acquisition'),
  'lead-capture': defaultTemplates.filter(t => t.category === 'lead-capture'),
  'nurturing-relationship': defaultTemplates.filter(t => t.category === 'nurturing-relationship'),
  'engagement-conversion': defaultTemplates.filter(t => t.category === 'engagement-conversion'),
  'sales-checkout': defaultTemplates.filter(t => t.category === 'sales-checkout'),
  'analytics-optimization': defaultTemplates.filter(t => t.category === 'analytics-optimization'),
  'post-sale-retention': defaultTemplates.filter(t => t.category === 'post-sale-retention')
};

export const categoryLabels = {
  'product-offer': '🛍️ Produto / Oferta',
  'target-audience': '👤 Público-Alvo e Posicionamento',
  'traffic-acquisition': '📱 Tráfego (Aquisição)',
  'lead-capture': '🧲 Captura de Leads',
  'nurturing-relationship': '📧 Nutrição e Relacionamento',
  'engagement-conversion': '🎥 Engajamento e Conversão',
  'sales-checkout': '💳 Venda e Checkout',
  'analytics-optimization': '📊 Análise e Otimização',
  'post-sale-retention': '📦 Pós-venda e Retenção'
};
