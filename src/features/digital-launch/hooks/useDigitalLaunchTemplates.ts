
import { digitalLaunchTemplates } from '../data/templates';
import { FunnelComponent, Connection } from '../../../types/funnel';

export const useDigitalLaunchTemplates = () => {
  const createComponentFromTemplate = (template: any, position: { x: number; y: number }) => {
    return {
      id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: template.type,
      position,
      connections: [],
      data: {
        ...template.defaultProps,
        title: template.defaultProps.title,
        description: template.defaultProps.description,
        status: template.defaultProps.status,
        properties: { ...template.defaultProps.properties }
      }
    };
  };

  const createCompleteDigitalLaunchFunnel = (): { components: FunnelComponent[], connections: Connection[] } => {
    const components: FunnelComponent[] = [];
    const connections: Connection[] = [];
    
    // Posições dos componentes em fluxo
    const positions = [
      { x: 100, y: 100 },   // Público-alvo
      { x: 300, y: 100 },   // Oferta
      { x: 500, y: 100 },   // Tráfego Orgânico
      { x: 700, y: 100 },   // Captura de Leads
      { x: 900, y: 100 },   // Nutrição
      { x: 1100, y: 100 },  // Webinar/VSL
      { x: 1300, y: 100 },  // Página de Vendas
      { x: 1500, y: 100 },  // Checkout
      { x: 1700, y: 100 },  // Pós-venda
      { x: 1900, y: 100 },  // Análise
      { x: 500, y: 300 },   // Tráfego Pago
    ];

    // Criar componentes
    digitalLaunchTemplates.forEach((template, index) => {
      if (index < positions.length) {
        const component = createComponentFromTemplate(template, positions[index]);
        components.push(component);
      }
    });

    // Criar conexões em sequência
    for (let i = 0; i < components.length - 2; i++) {
      if (i !== 10) { // Pula o tráfego pago na sequência principal
        connections.push({
          id: `connection-${Date.now()}-${i}`,
          from: components[i].id,
          to: components[i + 1].id,
          type: 'success',
          color: '#3B82F6'
        });
      }
    }

    // Conectar tráfego pago à captura de leads
    if (components.length > 10) {
      connections.push({
        id: `connection-paid-traffic`,
        from: components[10].id, // Tráfego Pago
        to: components[3].id,    // Captura de Leads
        type: 'success',
        color: '#EA580C'
      });
    }

    return { components, connections };
  };

  const createQuickLaunchTemplate = (type: 'mvp' | 'complete' | 'advanced'): { components: FunnelComponent[], connections: Connection[] } => {
    const components: FunnelComponent[] = [];
    const connections: Connection[] = [];

    let selectedTemplates: any[] = [];
    
    switch (type) {
      case 'mvp':
        selectedTemplates = digitalLaunchTemplates.filter(t => 
          ['target-audience', 'offer', 'lead-capture', 'sales-page'].includes(t.type)
        );
        break;
      case 'complete':
        selectedTemplates = digitalLaunchTemplates.filter(t => 
          ['target-audience', 'offer', 'traffic-organic', 'lead-capture', 'nurturing', 'sales-page', 'checkout-upsell'].includes(t.type)
        );
        break;
      case 'advanced':
        selectedTemplates = digitalLaunchTemplates;
        break;
    }

    // Posições horizontais
    selectedTemplates.forEach((template, index) => {
      const component = createComponentFromTemplate(template, {
        x: 100 + (index * 250),
        y: 150
      });
      components.push(component);
    });

    // Conectar em sequência
    for (let i = 0; i < components.length - 1; i++) {
      connections.push({
        id: `connection-${Date.now()}-${i}`,
        from: components[i].id,
        to: components[i + 1].id,
        type: 'success',
        color: '#10B981'
      });
    }

    return { components, connections };
  };

  return {
    digitalLaunchTemplates,
    createCompleteDigitalLaunchFunnel,
    createQuickLaunchTemplate
  };
};
