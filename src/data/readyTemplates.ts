
import { ReadyTemplate, TemplateCategory } from '../types/readyTemplates';

export const templateCategories: TemplateCategory[] = [
  {
    id: 'digital-launch',
    name: 'Lançamento Digital',
    description: 'Templates completos para lançamentos digitais',
    icon: '🚀',
    color: '#8B5CF6'
  },
  {
    id: 'lead-generation',
    name: 'Captura de Leads',
    description: 'Funis focados em geração de leads',
    icon: '🎯',
    color: '#3B82F6'
  },
  {
    id: 'e-commerce',
    name: 'E-commerce',
    description: 'Funis para vendas online',
    icon: '🛒',
    color: '#10B981'
  },
  {
    id: 'webinar',
    name: 'Webinar',
    description: 'Templates para webinars e VSLs',
    icon: '🎬',
    color: '#F59E0B'
  },
  {
    id: 'course',
    name: 'Curso Online',
    description: 'Funis para venda de cursos',
    icon: '📚',
    color: '#EF4444'
  },
  {
    id: 'coaching',
    name: 'Coaching',
    description: 'Templates para coaches e consultores',
    icon: '💼',
    color: '#06B6D4'
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
            painPoints: ['Falta de conhecimento em marketing digital', 'Dificuldade em gerar leads'],
            desires: ['Autonomia financeira', 'Negócio online rentável'],
            channels: ['Instagram', 'YouTube', 'Facebook'],
            demographics: { age: '25-45', income: 'R$ 3.000-10.000' }
          }
        },
        connections: []
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
        },
        connections: []
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
        },
        connections: []
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
        },
        connections: []
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
        },
        connections: []
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
        },
        connections: []
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
        },
        connections: []
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
        },
        connections: []
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
        },
        connections: []
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
        },
        connections: []
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
        },
        connections: []
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
        },
        connections: []
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
        },
        connections: []
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
