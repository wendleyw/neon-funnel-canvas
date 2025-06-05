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
    
    // Positions of components in flow
    const positions = [
      { x: 100, y: 100 },   // Target Audience
      { x: 300, y: 100 },   // Offer
      { x: 500, y: 100 },   // Organic Traffic
      { x: 700, y: 100 },   // Lead Capture
      { x: 900, y: 100 },   // Nurturing
      { x: 1100, y: 100 },  // Webinar/VSL
      { x: 1300, y: 100 },  // Sales Page
      { x: 1500, y: 100 },  // Checkout
      { x: 1700, y: 100 },  // Post-sale
      { x: 1900, y: 100 },  // Analysis
      { x: 500, y: 300 },   // Paid Traffic
    ];

    // Create components
    digitalLaunchTemplates.forEach((template, index) => {
      if (index < positions.length) {
        const component = createComponentFromTemplate(template, positions[index]);
        components.push(component);
      }
    });

    // Create connections in sequence
    for (let i = 0; i < components.length - 2; i++) {
      if (i !== 10) { // Skip paid traffic in the main sequence
        connections.push({
          id: `connection-${Date.now()}-${i}`,
          from: components[i].id,
          to: components[i + 1].id,
          type: 'success',
          color: '#3B82F6'
        });
      }
    }

    // Connect paid traffic to lead capture
    if (components.length > 10) {
      connections.push({
        id: `connection-paid-traffic`,
        from: components[10].id, // Paid Traffic
        to: components[3].id,    // Lead Capture
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

    // Horizontal positions
    selectedTemplates.forEach((template, index) => {
      const component = createComponentFromTemplate(template, {
        x: 100 + (index * 250),
        y: 150
      });
      components.push(component);
    });

    // Connect in sequence
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

  const webinarFunnel = () => {
    // ... (similar structure for a webinar funnel)
    // Connect in sequence (example)
    const connections: Connection[] = [
      // ... connections for webinar funnel
    ];
    // return { components, connections };
    return { components: [], connections: [] }; // Placeholder
  };

  return {
    digitalLaunchTemplates,
    createCompleteDigitalLaunchFunnel,
    createQuickLaunchTemplate,
    webinarFunnel
  };
};
