import { ReadyTemplate, TemplateCategory } from '../types/readyTemplates';

export const templateCategories: TemplateCategory[] = [
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Funnels for online product sales',
    icon: '🛒',
    color: '#10B981'
  },
  {
    id: 'lead-generation',
    name: 'Lead Generation',
    description: 'Funnels focused on lead generation',
    icon: '🎯',
    color: '#3B82F6'
  },
  {
    id: 'course-sales',
    name: 'Course Sales',
    description: 'Funnels for selling digital courses',
    icon: '📚',
    color: '#EF4444'
  },
  {
    id: 'service-business',
    name: 'Service Business',
    description: 'Funnels for service businesses',
    icon: '💼',
    color: '#06B6D4'
  },
  {
    id: 'event-promotion',
    name: 'Event Promotion',
    description: 'Funnels for event and webinar promotion',
    icon: '🎪',
    color: '#F59E0B'
  }
];

export const readyTemplates: ReadyTemplate[] = [
  {
    id: 'digital-launch-complete',
    name: 'Lançamento Digital Completo',
    description: 'Funil completo com todas as etapas de um lançamento digital profissional',
    category: 'digital-launch',
    difficulty: 'advanced',
    components: [
      {
        id: 'template-audience-1',
        type: 'target-audience',
        position: { x: 50, y: 100 },
        data: {
          title: 'Público-alvo Principal',
          description: 'Definição detalhada do avatar',
          status: 'draft',
          properties: {
            avatar: 'Empreendedores iniciantes',
            painPoints: ['Lack of knowledge in digital marketing', 'Difficulty generating leads'],
            desires: ['Autonomia financeira', 'Negócio online rentável'],
            channels: ['Instagram', 'YouTube', 'Facebook'],
            demographics: { age: '25-45', income: 'R$ 3.000-10.000' },
            goals: ['Increase brand visibility', 'Generate qualified leads', 'Improve ROI']
          }
        }
      },
      {
        id: 'template-offer-1',
        type: 'offer',
        position: { x: 350, y: 100 },
        data: {
          title: 'Oferta Principal',
          description: 'Curso completo de marketing digital',
          status: 'draft',
          properties: {
            mainProduct: 'Curso Marketing Digital Pro',
            bonuses: ['E-book de estratégias', 'Planilha de métricas', 'Grupo VIP'],
            valueProposition: 'Aprenda a criar um negócio online do zero',
            guarantee: 'Garantia de 30 dias',
            price: 497,
            urgencyFactor: 'Últimas 48 horas'
          }
        }
      },
      {
        id: 'template-traffic-organic-1',
        type: 'traffic-organic',
        position: { x: 50, y: 300 },
        data: {
          title: 'Tráfego Orgânico',
          description: 'Estratégia de conteúdo gratuito',
          status: 'draft',
          properties: {
            platforms: ['Instagram', 'YouTube', 'TikTok'],
            contentTypes: ['Posts educativos', 'Stories', 'Reels', 'Lives'],
            frequency: 'Diário',
            topics: ['Dicas de marketing', 'Cases de sucesso', 'Tutoriais']
          }
        }
      },
      {
        id: 'template-lead-capture-1',
        type: 'lead-capture',
        position: { x: 350, y: 300 },
        data: {
          title: 'Página de Captura',
          description: 'Landing page com lead magnet',
          status: 'draft',
          properties: {
            leadMagnet: 'E-book: 7 Estratégias de Marketing Digital',
            headline: 'Descubra os Segredos do Marketing Digital',
            formFields: ['nome', 'email', 'whatsapp'],
            crmIntegration: 'RD Station'
          }
        }
      },
      {
        id: 'template-nurturing-1',
        type: 'nurturing',
        position: { x: 650, y: 300 },
        data: {
          title: 'Sequência de Nutrição',
          description: 'E-mails de relacionamento',
          status: 'draft',
          properties: {
            emailSequence: [
              'Bem-vindo + entrega do lead magnet',
              'História pessoal e credibilidade',
              'Conteúdo de valor + case de sucesso',
              'Convite para webinar'
            ],
            contentTopics: ['Estratégias de marketing', 'Cases reais', 'Dicas práticas'],
            socialProof: ['Depoimentos', 'Resultados de alunos'],
            duration: '7 dias'
          }
        }
      },
      {
        id: 'template-webinar-1',
        type: 'webinar-vsl',
        position: { x: 350, y: 500 },
        data: {
          title: 'Webinar de Conversão',
          description: 'Apresentação com pitch da oferta',
          status: 'draft',
          properties: {
            type: 'webinar',
            duration: '90 minutos',
            outline: [
              'Apresentação pessoal',
              'Problema e agitação',
              'Solução e método',
              'Prova social',
              'Oferta e bônus'
            ],
            objectionHandling: ['Preço', 'Tempo', 'Funciona para mim?'],
            cta: 'Garanta sua vaga com desconto especial'
          }
        }
      }
    ],
    connections: [
      {
        id: 'conn-1',
        from: 'template-audience-1',
        to: 'template-traffic-organic-1',
        type: 'success',
        animated: true
      },
      {
        id: 'conn-2',
        from: 'template-traffic-organic-1',
        to: 'template-lead-capture-1',
        type: 'success',
        animated: true
      },
      {
        id: 'conn-3',
        from: 'template-lead-capture-1',
        to: 'template-nurturing-1',
        type: 'success',
        animated: true
      },
      {
        id: 'conn-4',
        from: 'template-nurturing-1',
        to: 'template-webinar-1',
        type: 'success',
        animated: true
      }
    ],
    tags: ['lançamento', 'digital', 'completo', 'avançado'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'lead-generation-simple',
    name: 'Captura de Leads Simples',
    description: 'Funil básico para captura e nutrição de leads',
    category: 'lead-generation',
    difficulty: 'beginner',
    components: [
      {
        id: 'template-traffic-2',
        type: 'traffic-organic',
        position: { x: 50, y: 100 },
        data: {
          title: 'Tráfego Orgânico',
          description: 'Posts nas redes sociais',
          status: 'draft',
          properties: {
            platforms: ['Instagram', 'Facebook'],
            contentTypes: ['Posts educativos', 'Stories'],
            frequency: '3x por semana',
            topics: ['Dicas do nicho', 'Motivação']
          }
        }
      },
      {
        id: 'template-capture-2',
        type: 'lead-capture',
        position: { x: 350, y: 100 },
        data: {
          title: 'Página de Captura',
          description: 'Landing page simples',
          status: 'draft',
          properties: {
            leadMagnet: 'Checklist grátis',
            headline: 'Baixe seu checklist gratuito',
            formFields: ['nome', 'email'],
            crmIntegration: 'Mailchimp'
          }
        }
      },
      {
        id: 'template-nurture-2',
        type: 'nurturing',
        position: { x: 650, y: 100 },
        data: {
          title: 'Nutrição Básica',
          description: 'Sequência de 5 e-mails',
          status: 'draft',
          properties: {
            emailSequence: [
              'Bem-vindo + entrega',
              'Dica valiosa #1',
              'Dica valiosa #2',
              'Case de sucesso',
              'Convite para próximo passo'
            ],
            contentTopics: ['Dicas práticas', 'Motivação'],
            socialProof: ['Depoimentos simples'],
            duration: '5 dias'
          }
        }
      }
    ],
    connections: [
      {
        id: 'conn-lead-1',
        from: 'template-traffic-2',
        to: 'template-capture-2',
        type: 'success',
        animated: true
      },
      {
        id: 'conn-lead-2',
        from: 'template-capture-2',
        to: 'template-nurture-2',
        type: 'success',
        animated: true
      }
    ],
    tags: ['simples', 'iniciante', 'leads'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'webinar-funnel',
    name: 'Funil de Webinar',
    description: 'Template focado em conversão via webinar',
    category: 'webinar',
    difficulty: 'intermediate',
    components: [
      {
        id: 'template-webinar-traffic',
        type: 'traffic-paid',
        position: { x: 50, y: 100 },
        data: {
          title: 'Tráfego Pago',
          description: 'Anúncios para webinar',
          status: 'draft',
          properties: {
            platforms: ['Facebook Ads', 'Google Ads'],
            budget: 1000,
            targetingCriteria: ['Interesse em empreendedorismo', 'Idade 25-50'],
            adTypes: ['Vídeo', 'Carrossel']
          }
        }
      },
      {
        id: 'template-webinar-registration',
        type: 'lead-capture',
        position: { x: 350, y: 100 },
        data: {
          title: 'Inscrição no Webinar',
          description: 'Página de cadastro para o webinar',
          status: 'draft',
          properties: {
            leadMagnet: 'Webinar gratuito',
            headline: 'Participe do webinar exclusivo',
            formFields: ['nome', 'email', 'whatsapp'],
            crmIntegration: 'ActiveCampaign'
          }
        }
      },
      {
        id: 'template-webinar-show',
        type: 'webinar-vsl',
        position: { x: 650, y: 100 },
        data: {
          title: 'Webinar ao Vivo',
          description: 'Apresentação principal',
          status: 'draft',
          properties: {
            type: 'webinar',
            duration: '120 minutos',
            outline: [
              'Abertura e apresentação',
              'Conteúdo de valor',
              'Pitch da oferta',
              'Q&A'
            ],
            objectionHandling: ['Funciona para mim?', 'Tenho tempo?'],
            cta: 'Oferta especial só para participantes'
          }
        }
      },
      {
        id: 'template-webinar-sales',
        type: 'sales-page',
        position: { x: 950, y: 100 },
        data: {
          title: 'Página de Vendas',
          description: 'Oferta pós-webinar',
          status: 'draft',
          properties: {
            benefits: ['Acesso vitalício', 'Suporte direto', 'Bônus exclusivos'],
            testimonials: ['João aumentou 300% suas vendas', 'Maria faturou R$ 50k'],
            faq: ['Quanto tempo tenho acesso?', 'Tem garantia?'],
            pricing: { original: 997, current: 497 },
            guarantees: ['30 dias de garantia']
          }
        }
      }
    ],
    connections: [
      {
        id: 'conn-webinar-1',
        from: 'template-webinar-traffic',
        to: 'template-webinar-registration',
        type: 'success',
        animated: true
      },
      {
        id: 'conn-webinar-2',
        from: 'template-webinar-registration',
        to: 'template-webinar-show',
        type: 'success',
        animated: true
      },
      {
        id: 'conn-webinar-3',
        from: 'template-webinar-show',
        to: 'template-webinar-sales',
        type: 'success',
        animated: true
      }
    ],
    tags: ['webinar', 'conversão', 'intermediário'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];
