
import { ComponentTemplate } from '../types/funnel';

export const componentTemplates: ComponentTemplate[] = [
  {
    id: 'landing-page-template',
    type: 'landing-page',
    icon: '🎯',
    label: 'Landing Page',
    color: '#3B82F6',
    category: 'conversion',
    title: 'Landing Page',
    description: 'Página de aterrissagem para capturar leads',
    defaultProps: {
      title: 'Landing Page',
      description: 'Página de aterrissagem para capturar leads',
      image: '',
      url: '',
      status: 'draft',
      properties: {}
    }
  },
  {
    id: 'quiz-template',
    type: 'quiz',
    icon: '❓',
    label: 'Quiz',
    color: '#8B5CF6',
    category: 'engagement',
    title: 'Quiz Interativo',
    description: 'Quiz para engajar e qualificar leads',
    defaultProps: {
      title: 'Quiz Interativo',
      description: 'Quiz para engajar e qualificar leads',
      image: '',
      url: '',
      status: 'draft',
      properties: {}
    }
  },
  {
    id: 'form-template',
    type: 'form',
    icon: '📝',
    label: 'Formulário',
    color: '#10B981',
    category: 'lead-capture',
    title: 'Formulário',
    description: 'Formulário de captura de dados',
    defaultProps: {
      title: 'Formulário',
      description: 'Formulário de captura de dados',
      image: '',
      url: '',
      status: 'draft',
      properties: {}
    }
  },
  {
    id: 'email-sequence-template',
    type: 'email-sequence',
    icon: '📧',
    label: 'E-mail Sequence',
    color: '#F59E0B',
    category: 'nurturing',
    title: 'Sequência de E-mails',
    description: 'Automação de e-mails para nutrição',
    defaultProps: {
      title: 'Sequência de E-mails',
      description: 'Automação de e-mails para nutrição',
      image: '',
      url: '',
      status: 'draft',
      properties: {}
    }
  },
  {
    id: 'checkout-template',
    type: 'checkout',
    icon: '💳',
    label: 'Checkout',
    color: '#EF4444',
    category: 'conversion',
    title: 'Página de Checkout',
    description: 'Finalização da compra',
    defaultProps: {
      title: 'Página de Checkout',
      description: 'Finalização da compra',
      image: '',
      url: '',
      status: 'draft',
      properties: {}
    }
  },
  {
    id: 'webinar-vsl-template',
    type: 'webinar-vsl',
    icon: '🎥',
    label: 'Webinar/VSL',
    color: '#6366F1',
    category: 'content',
    title: 'Webinar/VSL',
    description: 'Webinar ou Video Sales Letter',
    defaultProps: {
      title: 'Webinar/VSL',
      description: 'Webinar ou Video Sales Letter',
      image: '',
      url: '',
      status: 'draft',
      properties: {}
    }
  },
  {
    id: 'sales-page-template',
    type: 'sales-page',
    icon: '💰',
    label: 'Sales Page',
    color: '#DC2626',
    category: 'conversion',
    title: 'Página de Vendas',
    description: 'Página de vendas persuasiva',
    defaultProps: {
      title: 'Página de Vendas',
      description: 'Página de vendas persuasiva',
      image: '',
      url: '',
      status: 'draft',
      properties: {}
    }
  },
  
  // Visual Helper Components
  {
    id: 'note-template',
    type: 'note',
    icon: '📝',
    label: 'Nota Adesiva',
    color: '#FBBF24',
    category: 'visual-helpers',
    title: 'Nota',
    description: 'Clique para adicionar uma nota...',
    defaultProps: {
      title: 'Nota',
      description: 'Clique para adicionar uma nota...',
      image: '',
      url: '',
      status: 'draft',
      properties: {
        color: 'yellow'
      }
    }
  },
  {
    id: 'arrow-template',
    type: 'arrow',
    icon: '➡️',
    label: 'Seta',
    color: '#3B82F6',
    category: 'visual-helpers',
    title: 'Seta Direcional',
    description: 'Seta para indicar fluxo',
    defaultProps: {
      title: 'Seta Direcional',
      description: 'Seta para indicar fluxo',
      image: '',
      url: '',
      status: 'draft',
      properties: {
        direction: 'right',
        color: 'blue',
        size: 'medium'
      }
    }
  },
  {
    id: 'frame-template',
    type: 'frame',
    icon: '⬜',
    label: 'Frame',
    color: '#6B7280',
    category: 'visual-helpers',
    title: 'Frame',
    description: 'Organize seus componentes aqui',
    defaultProps: {
      title: 'Frame',
      description: 'Organize seus componentes aqui',
      image: '',
      url: '',
      status: 'draft',
      properties: {
        color: 'blue',
        size: 'medium',
        borderStyle: 'solid'
      }
    }
  }
];

// Group templates by category
export const templatesByCategory = componentTemplates.reduce((acc, template) => {
  if (!acc[template.category]) {
    acc[template.category] = [];
  }
  acc[template.category].push(template);
  return acc;
}, {} as Record<string, ComponentTemplate[]>);

// Export with backward compatibility
export const componentTemplatesByCategory = templatesByCategory;

// Export category labels
export const categoryLabels: Record<string, string> = {
  'conversion': 'Conversão',
  'engagement': 'Engajamento',
  'lead-capture': 'Captura de Leads',
  'nurturing': 'Nutrição',
  'content': 'Conteúdo',
  'visual-helpers': 'Helpers Visuais'
};

// Export individual categories for easier access
export const conversionTemplates = templatesByCategory['conversion'] || [];
export const engagementTemplates = templatesByCategory['engagement'] || [];
export const leadCaptureTemplates = templatesByCategory['lead-capture'] || [];
export const nurturingTemplates = templatesByCategory['nurturing'] || [];
export const contentTemplates = templatesByCategory['content'] || [];
export const visualHelpersTemplates = templatesByCategory['visual-helpers'] || [];
