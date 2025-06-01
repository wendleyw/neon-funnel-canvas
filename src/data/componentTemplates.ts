
import { ComponentTemplate } from '../types/funnel';

export const componentTemplatesByCategory = {
  'produto-oferta': [
    {
      type: 'produto-principal',
      icon: '🎯',
      label: 'Produto Principal',
      color: 'bg-blue-600',
      defaultData: {
        title: 'Produto Principal',
        description: 'Defina seu produto digital, físico ou serviço',
        status: 'draft',
        properties: {
          tipo: 'digital',
          preco: '',
          categoria: 'produto'
        }
      }
    },
    {
      type: 'bonus-complementos',
      icon: '🎁',
      label: 'Bônus e Complementos',
      color: 'bg-green-600',
      defaultData: {
        title: 'Bônus e Complementos',
        description: 'Adicione valor extra à sua oferta',
        status: 'draft',
        properties: {
          categoria: 'produto'
        }
      }
    },
    {
      type: 'garantias',
      icon: '🛡️',
      label: 'Garantias',
      color: 'bg-emerald-600',
      defaultData: {
        title: 'Garantias',
        description: 'Configure garantias e política de reembolso',
        status: 'draft',
        properties: {
          tipo: 'reembolso',
          periodo: '30 dias',
          categoria: 'produto'
        }
      }
    },
    {
      type: 'preco-condicoes',
      icon: '💰',
      label: 'Preço e Condições',
      color: 'bg-yellow-600',
      defaultData: {
        title: 'Preço e Condições',
        description: 'Defina preços, parcelamento e descontos',
        status: 'draft',
        properties: {
          preco: '',
          parcelamento: '',
          categoria: 'produto'
        }
      }
    }
  ],
  'publico-posicionamento': [
    {
      type: 'persona-avatar',
      icon: '👤',
      label: 'Persona/Avatar',
      color: 'bg-purple-600',
      defaultData: {
        title: 'Persona/Avatar',
        description: 'Defina seu público-alvo detalhadamente',
        status: 'draft',
        properties: {
          idade: '',
          dores: '',
          desejos: '',
          categoria: 'publico'
        }
      }
    },
    {
      type: 'posicionamento',
      icon: '📍',
      label: 'Posicionamento',
      color: 'bg-indigo-600',
      defaultData: {
        title: 'Posicionamento da Marca',
        description: 'Configure sua mensagem-chave e posicionamento',
        status: 'draft',
        properties: {
          mensagem: '',
          categoria: 'publico'
        }
      }
    },
    {
      type: 'segmentacao',
      icon: '🎯',
      label: 'Segmentação',
      color: 'bg-violet-600',
      defaultData: {
        title: 'Segmentação e Nicho',
        description: 'Defina seu nicho e segmentos',
        status: 'draft',
        properties: {
          nicho: '',
          categoria: 'publico'
        }
      }
    }
  ],
  'trafego-aquisicao': [
    {
      type: 'trafego-organico',
      icon: '🌱',
      label: 'Tráfego Orgânico',
      color: 'bg-green-700',
      defaultData: {
        title: 'Tráfego Orgânico',
        description: 'Conteúdo em redes sociais, blog, YouTube',
        status: 'draft',
        properties: {
          plataformas: [],
          categoria: 'trafego'
        }
      }
    },
    {
      type: 'trafego-pago',
      icon: '💸',
      label: 'Tráfego Pago',
      color: 'bg-red-600',
      defaultData: {
        title: 'Tráfego Pago',
        description: 'Facebook Ads, Google Ads, TikTok Ads',
        status: 'draft',
        properties: {
          plataformas: [],
          orcamento: '',
          categoria: 'trafego'
        }
      }
    },
    {
      type: 'parcerias-afiliados',
      icon: '🤝',
      label: 'Parcerias e Afiliados',
      color: 'bg-orange-600',
      defaultData: {
        title: 'Parcerias e Afiliados',
        description: 'Configure programa de afiliados e parcerias',
        status: 'draft',
        properties: {
          comissao: '',
          categoria: 'trafego'
        }
      }
    }
  ],
  'captura-leads': [
    {
      type: 'landing-page',
      icon: '📄',
      label: 'Landing Page',
      color: 'bg-blue-700',
      defaultData: {
        title: 'Landing Page',
        description: 'Página de captura de leads',
        status: 'draft',
        properties: {
          tipo: 'captura',
          categoria: 'captura'
        }
      }
    },
    {
      type: 'lead-magnet',
      icon: '🧲',
      label: 'Lead Magnet',
      color: 'bg-pink-600',
      defaultData: {
        title: 'Lead Magnet',
        description: 'eBooks, minicursos, checklists',
        status: 'draft',
        properties: {
          tipo: 'ebook',
          categoria: 'captura'
        }
      }
    },
    {
      type: 'formularios-crm',
      icon: '📝',
      label: 'Formulários CRM',
      color: 'bg-cyan-600',
      defaultData: {
        title: 'Formulários e CRM',
        description: 'Integração com ferramentas de CRM',
        status: 'draft',
        properties: {
          campos: [],
          categoria: 'captura'
        }
      }
    }
  ],
  'nutricao-relacionamento': [
    {
      type: 'email-sequence',
      icon: '📧',
      label: 'Sequência de E-mails',
      color: 'bg-blue-800',
      defaultData: {
        title: 'Sequência de E-mails',
        description: 'Automação de e-mail marketing',
        status: 'draft',
        properties: {
          sequencias: [],
          categoria: 'nutricao'
        }
      }
    },
    {
      type: 'conteudo-valor',
      icon: '💎',
      label: 'Conteúdo de Valor',
      color: 'bg-amber-600',
      defaultData: {
        title: 'Conteúdo de Valor',
        description: 'Vídeos, textos, lives educacionais',
        status: 'draft',
        properties: {
          tipos: [],
          categoria: 'nutricao'
        }
      }
    },
    {
      type: 'prova-social',
      icon: '⭐',
      label: 'Prova Social',
      color: 'bg-yellow-500',
      defaultData: {
        title: 'Prova Social',
        description: 'Depoimentos, reviews, cases de sucesso',
        status: 'draft',
        properties: {
          tipos: [],
          categoria: 'nutricao'
        }
      }
    }
  ],
  'engajamento-conversao': [
    {
      type: 'webinar',
      icon: '🎥',
      label: 'Webinar',
      color: 'bg-red-700',
      defaultData: {
        title: 'Webinar',
        description: 'Webinar ao vivo ou gravado (VSL)',
        status: 'draft',
        properties: {
          tipo: 'ao_vivo',
          categoria: 'engajamento'
        }
      }
    },
    {
      type: 'video-vendas',
      icon: '📹',
      label: 'Vídeo de Vendas',
      color: 'bg-purple-700',
      defaultData: {
        title: 'Vídeo de Vendas',
        description: 'VSL para conversão',
        status: 'draft',
        properties: {
          duracao: '',
          categoria: 'engajamento'
        }
      }
    },
    {
      type: 'calls-venda',
      icon: '📞',
      label: 'Calls de Venda',
      color: 'bg-green-800',
      defaultData: {
        title: 'Calls de Venda',
        description: 'Consultas e calls para lançamentos complexos',
        status: 'draft',
        properties: {
          duracao: '',
          categoria: 'engajamento'
        }
      }
    }
  ],
  'venda-checkout': [
    {
      type: 'pagina-vendas',
      icon: '💳',
      label: 'Página de Vendas',
      color: 'bg-emerald-700',
      defaultData: {
        title: 'Página de Vendas',
        description: 'Sales page detalhada',
        status: 'draft',
        properties: {
          elementos: [],
          categoria: 'venda'
        }
      }
    },
    {
      type: 'checkout',
      icon: '🛒',
      label: 'Checkout',
      color: 'bg-teal-600',
      defaultData: {
        title: 'Checkout',
        description: 'Plataforma de pagamento integrada',
        status: 'draft',
        properties: {
          plataforma: '',
          categoria: 'venda'
        }
      }
    },
    {
      type: 'upsell-downsell',
      icon: '⬆️',
      label: 'Upsell/Downsell',
      color: 'bg-orange-700',
      defaultData: {
        title: 'Upsell/Downsell',
        description: 'Ofertas complementares',
        status: 'draft',
        properties: {
          ofertas: [],
          categoria: 'venda'
        }
      }
    }
  ],
  'analise-otimizacao': [
    {
      type: 'metricas-kpis',
      icon: '📊',
      label: 'Métricas e KPIs',
      color: 'bg-slate-600',
      defaultData: {
        title: 'Métricas e KPIs',
        description: 'CPL, CTR, taxa de conversão, ROI',
        status: 'draft',
        properties: {
          metricas: [],
          categoria: 'analise'
        }
      }
    },
    {
      type: 'tracking',
      icon: '🔍',
      label: 'Tracking',
      color: 'bg-gray-600',
      defaultData: {
        title: 'Ferramentas de Tracking',
        description: 'Pixels, UTM, analytics',
        status: 'draft',
        properties: {
          ferramentas: [],
          categoria: 'analise'
        }
      }
    },
    {
      type: 'testes-ab',
      icon: '🧪',
      label: 'Testes A/B',
      color: 'bg-stone-600',
      defaultData: {
        title: 'Testes A/B',
        description: 'Otimização através de testes',
        status: 'draft',
        properties: {
          testes: [],
          categoria: 'analise'
        }
      }
    }
  ],
  'pos-venda-retencao': [
    {
      type: 'entrega-produto',
      icon: '📦',
      label: 'Entrega do Produto',
      color: 'bg-lime-600',
      defaultData: {
        title: 'Entrega do Produto',
        description: 'Sistema de entrega e acesso',
        status: 'draft',
        properties: {
          metodo: '',
          categoria: 'pos_venda'
        }
      }
    },
    {
      type: 'suporte-cliente',
      icon: '🎧',
      label: 'Suporte ao Cliente',
      color: 'bg-sky-600',
      defaultData: {
        title: 'Suporte ao Cliente',
        description: 'Atendimento e suporte pós-venda',
        status: 'draft',
        properties: {
          canais: [],
          categoria: 'pos_venda'
        }
      }
    },
    {
      type: 'programa-indicacao',
      icon: '🎯',
      label: 'Programa de Indicação',
      color: 'bg-rose-600',
      defaultData: {
        title: 'Programa de Indicação',
        description: 'Sistema de indicações e recompensas',
        status: 'draft',
        properties: {
          recompensas: [],
          categoria: 'pos_venda'
        }
      }
    }
  ]
} as const;

export const categoryLabels = {
  'produto-oferta': 'Produto / Oferta',
  'publico-posicionamento': 'Público-Alvo e Posicionamento',
  'trafego-aquisicao': 'Tráfego (Aquisição)',
  'captura-leads': 'Captura de Leads',
  'nutricao-relacionamento': 'Nutrição e Relacionamento',
  'engajamento-conversao': 'Engajamento e Conversão',
  'venda-checkout': 'Venda e Checkout',
  'analise-otimizacao': 'Análise e Otimização',
  'pos-venda-retencao': 'Pós-venda e Retenção'
} as const;

// Para compatibilidade com código existente
export const defaultTemplates: ComponentTemplate[] = Object.values(componentTemplatesByCategory).flat();
