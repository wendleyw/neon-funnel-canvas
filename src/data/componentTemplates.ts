
import { ComponentTemplate } from '../types/funnel';

export const componentTemplates: ComponentTemplate[] = [
  {
    type: 'landing-page',
    icon: '🎯',
    label: 'Landing Page',
    color: '#3B82F6',
    defaultData: {
      title: 'Nova Landing Page',
      description: 'Página de captura de leads com alta conversão',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'quiz',
    icon: '❓',
    label: 'Quiz',
    color: '#8B5CF6',
    defaultData: {
      title: 'Novo Quiz',
      description: 'Quiz interativo para segmentação de leads',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'form',
    icon: '📝',
    label: 'Formulário',
    color: '#10B981',
    defaultData: {
      title: 'Novo Formulário',
      description: 'Formulário de captura de dados',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'email-sequence',
    icon: '📧',
    label: 'Sequência Email',
    color: '#F59E0B',
    defaultData: {
      title: 'Nova Sequência',
      description: 'Automação de email marketing',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'checkout',
    icon: '💳',
    label: 'Checkout',
    color: '#EF4444',
    defaultData: {
      title: 'Nova Página de Checkout',
      description: 'Página de finalização de compra',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'automation',
    icon: '⚡',
    label: 'Automação',
    color: '#6366F1',
    defaultData: {
      title: 'Nova Automação',
      description: 'Fluxo automatizado de ações',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'analytics',
    icon: '📊',
    label: 'Analytics',
    color: '#06B6D4',
    defaultData: {
      title: 'Novo Dashboard',
      description: 'Métricas e análise de performance',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'segmentation',
    icon: '🎯',
    label: 'Segmentação',
    color: '#84CC16',
    defaultData: {
      title: 'Nova Segmentação',
      description: 'Divisão inteligente de audiência',
      status: 'draft',
      properties: {}
    }
  },
  {
    type: 'conversion',
    icon: '🚀',
    label: 'Conversão',
    color: '#F97316',
    defaultData: {
      title: 'Nova Página de Conversão',
      description: 'Otimização para máxima conversão',
      status: 'draft',
      properties: {}
    }
  }
];
