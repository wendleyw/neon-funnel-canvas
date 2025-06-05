import { Node, Edge, NodeTypes, EdgeTypes } from 'reactflow';
import { FunnelComponent, Connection } from './funnel';

// Mapeamento de FunnelComponent para React Flow Node
export interface ReactFlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: FunnelComponent['data'] & {
    // Dados adicionais específicos do React Flow
    originalType: FunnelComponent['type'];
    funnelComponentId: string;
    isExpanded?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
  // Propriedades opcionais do React Flow
  selected?: boolean;
  dragging?: boolean;
  selectable?: boolean;
  deletable?: boolean;
  connectable?: boolean;
}

// Mapeamento de Connection para React Flow Edge
export interface ReactFlowEdge {
  id: string;
  source: string;
  target: string;
  type?: 'default' | 'straight' | 'step' | 'smoothstep' | 'simplebezier' | 'animatedNode';
  data?: Connection['connectionData'] & {
    originalConnection: Connection;
    color?: string;
    animated?: boolean;
    label?: string;
  };
  style?: {
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
  };
  animated?: boolean;
  selected?: boolean;
}

// Funções de conversão
export const convertFunnelComponentToNode = (component: FunnelComponent): ReactFlowNode => {
  return {
    id: component.id,
    type: mapFunnelTypeToNodeType(component.type),
    position: component.position,
    data: {
      ...component.data,
      originalType: component.type,
      funnelComponentId: component.id,
      isExpanded: component.isExpanded,
      createdAt: component.createdAt,
      updatedAt: component.updatedAt,
    },
    selectable: true,
    deletable: true,
    connectable: true,
  };
};

export const convertConnectionToEdge = (connection: Connection): ReactFlowEdge => {
  return {
    id: connection.id,
    source: connection.from,
    target: connection.to,
    type: mapConnectionTypeToEdgeType(connection.type),
    data: {
      ...connection.connectionData,
      originalConnection: connection,
      color: connection.customColor || connection.color,
      animated: connection.animated || false,
    },
    style: {
      stroke: connection.customColor || connection.color || '#94a3b8',
      strokeWidth: 2,
    },
    animated: connection.animated || false,
  };
};

// Conversão reversa
export const convertNodeToFunnelComponent = (node: ReactFlowNode): FunnelComponent => {
  return {
    id: node.data.funnelComponentId,
    type: node.data.originalType,
    position: node.position,
    data: {
      title: node.data.title,
      description: node.data.description,
      image: node.data.image,
      url: node.data.url,
      status: node.data.status,
      properties: node.data.properties,
      metrics: node.data.metrics,
      journey: node.data.journey,
      process: node.data.process,
      content: node.data.content,
      martech: node.data.martech,
    },
    connections: [], // Será preenchido pela lógica de conexões
    isExpanded: node.data.isExpanded,
    createdAt: node.data.createdAt,
    updatedAt: node.data.updatedAt,
  };
};

export const convertEdgeToConnection = (edge: ReactFlowEdge): Connection => {
  if (edge.data?.originalConnection) {
    return {
      ...edge.data.originalConnection,
      from: edge.source,
      to: edge.target,
    };
  }
  
  return {
    id: edge.id,
    from: edge.source,
    to: edge.target,
    type: 'success', // default
    color: edge.style?.stroke || '#94a3b8',
    animated: edge.animated || false,
  };
};

// Mapeamento de tipos
const mapFunnelTypeToNodeType = (funnelType: FunnelComponent['type']): string => {
  // Mapear tipos complexos para tipos de node mais simples do React Flow
  const typeMap: Record<string, string> = {
    // Fontes de Tráfego
    'social-ads': 'traffic-source',
    'facebook-ads': 'traffic-source',
    'instagram-ads': 'traffic-source',
    'google-ads': 'traffic-source',
    'seo-organic': 'traffic-source',
    
    // Captura de Leads
    'landing-page': 'conversion-page',
    'opt-in-page': 'conversion-page',
    'download-page': 'conversion-page',
    'quiz': 'interaction',
    'form': 'input',
    'lead-magnet': 'conversion-page',
    
    // Vendas
    'sales-page': 'conversion-page',
    'order-page': 'conversion-page',
    'checkout': 'conversion-page',
    'upsell': 'conversion-page',
    
    // Webinars
    'webinar-live': 'conversion-page',
    'webinar-replay': 'conversion-page',
    
    // Thank you and completion
    'thank-you-page': 'conversion-page',
    'calendar-page': 'conversion-page',
    
    // Nutrição
    'email-sequence': 'automation',
    'automation': 'automation',
    
    // Analytics
    'analytics': 'metric',
    'conversion': 'metric',
    
    // Diagramas
    'funnel-stage': 'funnel',
    'journey-stage': 'journey',
    'flow-process': 'process',
    
    // Elementos visuais
    'note': 'note',
    'arrow': 'connector',
    'frame': 'group',
  };
  
  const mappedType = typeMap[funnelType];
  
  // Debug logging for unmapped types - disabled for cleaner console
  if (!mappedType && process.env.NODE_ENV === 'development' && false) {
    console.warn('🔍 Unmapped funnel type:', funnelType, 'defaulting to "default"');
  }
  
  return mappedType || 'default';
};

const mapConnectionTypeToEdgeType = (connectionType: Connection['type']): 'default' | 'straight' | 'step' | 'smoothstep' | 'simplebezier' | 'animatedNode' => {
  const typeMap: Record<string, 'default' | 'straight' | 'step' | 'smoothstep' | 'simplebezier' | 'animatedNode'> = {
    'success': 'animatedNode',
    'failure': 'step',
    'conditional': 'simplebezier',
    'data-flow': 'straight',
    'process-flow': 'animatedNode',
    'emotional-flow': 'animatedNode',
  };
  
  return typeMap[connectionType] || 'animatedNode';
};

// Para os tipos de nós customizados, criaremos depois os componentes reais
export const getCustomNodeTypes = (): NodeTypes => {
  // Retornaremos os componentes React reais quando os criarmos
  return {};
};

// Para os tipos de edges customizados
export const getCustomEdgeTypes = (): EdgeTypes => {
  // Retornaremos os componentes React reais quando os criarmos
  return {};
}; 