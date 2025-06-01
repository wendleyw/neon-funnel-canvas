
import { useCallback } from 'react';
import { FunnelComponent, Connection } from '../../../types/funnel';
import { digitalLaunchTemplates } from '../data/templates';

export const useDigitalLaunchTemplates = () => {
  
  const createCompleteDigitalLaunchFunnel = useCallback((): { components: FunnelComponent[], connections: Connection[] } => {
    const baseY = 100;
    const spacingX = 300;
    const spacingY = 200;
    
    // Criar componentes em sequência lógica
    const components: FunnelComponent[] = digitalLaunchTemplates.map((template, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      
      return {
        id: `launch-${template.type}-${Date.now()}-${index}`,
        type: template.type,
        position: {
          x: 50 + (col * spacingX),
          y: baseY + (row * spacingY)
        },
        data: {
          ...template.defaultData,
          title: template.label
        },
        connections: []
      };
    });

    // Criar conexões lógicas do funil
    const connections: Connection[] = [];
    
    // Fluxo principal do lançamento digital
    const flowOrder = [
      'target-audience', // 1. Definir público
      'offer', // 2. Criar oferta
      'traffic-organic', // 3. Tráfego orgânico
      'traffic-paid', // 4. Tráfego pago (paralelo)
      'lead-capture', // 5. Captura
      'nurturing', // 6. Nutrição
      'webinar-vsl', // 7. Apresentação
      'sales-page', // 8. Página de vendas
      'checkout-upsell', // 9. Checkout
      'post-sale', // 10. Pós-venda
      'analytics-optimization' // 11. Análise
    ];

    // Criar conexões sequenciais
    for (let i = 0; i < flowOrder.length - 1; i++) {
      const fromComponent = components.find(c => c.type === flowOrder[i]);
      const toComponent = components.find(c => c.type === flowOrder[i + 1]);
      
      if (fromComponent && toComponent) {
        connections.push({
          id: `connection-${Date.now()}-${i}`,
          from: fromComponent.id,
          to: toComponent.id,
          type: 'success',
          animated: true
        });
      }
    }

    // Conexões especiais
    // Público-alvo para ambos os tráfegos
    const targetAudience = components.find(c => c.type === 'target-audience');
    const trafficPaid = components.find(c => c.type === 'traffic-paid');
    if (targetAudience && trafficPaid) {
      connections.push({
        id: `connection-target-paid-${Date.now()}`,
        from: targetAudience.id,
        to: trafficPaid.id,
        type: 'conditional',
        color: '#F59E0B',
        animated: true
      });
    }

    // Ambos os tráfegos para captura
    const trafficOrganic = components.find(c => c.type === 'traffic-organic');
    const leadCapture = components.find(c => c.type === 'lead-capture');
    if (trafficPaid && leadCapture) {
      connections.push({
        id: `connection-paid-capture-${Date.now()}`,
        from: trafficPaid.id,
        to: leadCapture.id,
        type: 'success',
        color: '#10B981',
        animated: true
      });
    }

    // Analytics conectado a vários pontos para monitoramento
    const analytics = components.find(c => c.type === 'analytics-optimization');
    const checkoutUpsell = components.find(c => c.type === 'checkout-upsell');
    if (analytics && checkoutUpsell) {
      connections.push({
        id: `connection-checkout-analytics-${Date.now()}`,
        from: checkoutUpsell.id,
        to: analytics.id,
        type: 'success',
        color: '#0891B2',
        animated: false
      });
    }

    return { components, connections };
  }, []);

  const createQuickLaunchTemplate = useCallback((templateType: 'mvp' | 'complete' | 'advanced'): { components: FunnelComponent[], connections: Connection[] } => {
    const baseTemplates = {
      mvp: ['target-audience', 'lead-capture', 'sales-page', 'checkout-upsell'],
      complete: ['target-audience', 'traffic-organic', 'lead-capture', 'nurturing', 'sales-page', 'checkout-upsell', 'post-sale'],
      advanced: digitalLaunchTemplates.map(t => t.type)
    };

    const selectedTypes = baseTemplates[templateType];
    const spacingX = 280;
    const spacingY = 180;

    const components: FunnelComponent[] = selectedTypes.map((type, index) => {
      const template = digitalLaunchTemplates.find(t => t.type === type);
      if (!template) return null;

      const col = index % 4;
      const row = Math.floor(index / 4);

      return {
        id: `${templateType}-${type}-${Date.now()}-${index}`,
        type: template.type,
        position: {
          x: 50 + (col * spacingX),
          y: 100 + (row * spacingY)
        },
        data: {
          ...template.defaultData,
          title: `${template.label} (${templateType.toUpperCase()})`
        },
        connections: []
      };
    }).filter(Boolean) as FunnelComponent[];

    // Criar conexões simples em sequência
    const connections: Connection[] = [];
    for (let i = 0; i < components.length - 1; i++) {
      connections.push({
        id: `${templateType}-connection-${Date.now()}-${i}`,
        from: components[i].id,
        to: components[i + 1].id,
        type: 'success',
        animated: true
      });
    }

    return { components, connections };
  }, []);

  return {
    digitalLaunchTemplates,
    createCompleteDigitalLaunchFunnel,
    createQuickLaunchTemplate
  };
};
