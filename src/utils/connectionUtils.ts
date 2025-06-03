import { FunnelComponent } from '../types/funnel';

export interface ConnectionPoint {
  x: number;
  y: number;
  side: 'top' | 'right' | 'bottom' | 'left';
}

export interface ComponentDimensions {
  width: number;
  height: number;
}

// Tamanho padrão dos componentes (baseado no novo design melhorado)
export const DEFAULT_COMPONENT_SIZE: ComponentDimensions = {
  width: 288, // Largura baseada em w-72 = 18rem = 288px
  height: 200 // Altura do novo card melhorado
};

// Dimensões base para diferentes tipos de componentes
const COMPONENT_DIMENSIONS = {
  // Marketing components (padrão)
  default: { width: 288, height: 200 },
  
  // Componentes especializados
  funnel: { width: 280, height: 190 },
  journey: { width: 290, height: 210 },
  process: { width: 270, height: 180 },
  'social-media': { width: 288, height: 220 } // Novo para Instagram Grid
};

// Determinar categoria do componente de forma simplificada
function getComponentCategory(type: string): 'funnel' | 'journey' | 'process' | 'social-media' | 'default' {
  if (type.startsWith('funnel-') || type.includes('metric')) return 'funnel';
  if (type.startsWith('journey-') || type.includes('emotion') || type.includes('touchpoint')) return 'journey';
  if (type.startsWith('flow-') || type.includes('process')) return 'process';
  if (type === 'instagram-grid' || type.includes('social-media')) return 'social-media';
  return 'default';
}

// Obter dimensões do componente
export function getComponentDimensions(type: string): { width: number; height: number } {
  const category = getComponentCategory(type);
  return COMPONENT_DIMENSIONS[category];
}

// Função para obter as dimensões do componente baseado no tipo
export const getComponentDimensionsForComponent = (component: FunnelComponent): ComponentDimensions => {
  // Se for um componente visual com dimensões customizadas
  if (component.data.properties?.width && component.data.properties?.height) {
    return {
      width: component.data.properties.width as number,
      height: component.data.properties.height as number
    };
  }

  // Retornar dimensões baseadas no tipo usando a nova função
  return getComponentDimensions(component.type);
};

// Função para calcular a melhor conexão entre dois componentes
export function calculateBestConnectionPoints(
  fromComponent: FunnelComponent,
  toComponent: FunnelComponent
): { from: ConnectionPoint; to: ConnectionPoint } {
  const fromPos = fromComponent.position;
  const toPos = toComponent.position;
  const fromDims = getComponentDimensionsForComponent(fromComponent);
  const toDims = getComponentDimensionsForComponent(toComponent);

  // Calcular centros dos componentes
  const fromCenter = {
    x: fromPos.x + fromDims.width / 2,
    y: fromPos.y + fromDims.height / 2
  };

  const toCenter = {
    x: toPos.x + toDims.width / 2,
    y: toPos.y + toDims.height / 2
  };

  // Calcular diferenças
  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;

  // Determinar melhor lado para conexão baseado na direção
  let fromSide: 'top' | 'right' | 'bottom' | 'left';
  let toSide: 'top' | 'right' | 'bottom' | 'left';

  if (Math.abs(dx) > Math.abs(dy)) {
    // Conexão horizontal é melhor
    if (dx > 0) {
      fromSide = 'right';
      toSide = 'left';
    } else {
      fromSide = 'left';
      toSide = 'right';
    }
  } else {
    // Conexão vertical é melhor
    if (dy > 0) {
      fromSide = 'bottom';
      toSide = 'top';
    } else {
      fromSide = 'top';
      toSide = 'bottom';
    }
  }

  const fromPoint = getConnectionPoint(fromComponent, fromSide);
  const toPoint = getConnectionPoint(toComponent, toSide);

  return {
    from: { ...fromPoint, side: fromSide },
    to: { ...toPoint, side: toSide }
  };
}

// Função para obter o ponto de conexão em um lado específico do componente
export const getConnectionPoint = (
  component: FunnelComponent,
  side: 'top' | 'right' | 'bottom' | 'left'
): { x: number; y: number } => {
  const dims = getComponentDimensionsForComponent(component);
  const pos = component.position;

  switch (side) {
    case 'top':
      return { x: pos.x + dims.width / 2, y: pos.y };
    case 'right':
      return { x: pos.x + dims.width, y: pos.y + dims.height / 2 };
    case 'bottom':
      return { x: pos.x + dims.width / 2, y: pos.y + dims.height };
    case 'left':
      return { x: pos.x, y: pos.y + dims.height / 2 };
  }
};

// Função para verificar se dois componentes estão alinhados
export const areComponentsAligned = (
  comp1: FunnelComponent,
  comp2: FunnelComponent,
  threshold: number = 50
): { horizontal: boolean; vertical: boolean } => {
  const dims1 = getComponentDimensionsForComponent(comp1);
  const dims2 = getComponentDimensionsForComponent(comp2);

  const center1 = {
    x: comp1.position.x + dims1.width / 2,
    y: comp1.position.y + dims1.height / 2
  };

  const center2 = {
    x: comp2.position.x + dims2.width / 2,
    y: comp2.position.y + dims2.height / 2
  };

  return {
    horizontal: Math.abs(center1.y - center2.y) <= threshold,
    vertical: Math.abs(center1.x - center2.x) <= threshold
  };
};

// Calcular pontos de conexão para instâncias de componente
export function getConnectionPoints(component: FunnelComponent): {
  top: { x: number; y: number };
  right: { x: number; y: number };
  bottom: { x: number; y: number };
  left: { x: number; y: number };
} {
  const { width, height } = getComponentDimensions(component.type);
  const centerX = component.position.x + width / 2;
  const centerY = component.position.y + height / 2;

  return {
    top: { x: centerX, y: component.position.y },
    right: { x: component.position.x + width, y: centerY },
    bottom: { x: centerX, y: component.position.y + height },
    left: { x: component.position.x, y: centerY }
  };
}

// Encontrar melhor ponto de conexão
export function findBestConnectionPoint(
  from: FunnelComponent,
  to: FunnelComponent
): {
  start: { x: number; y: number };
  end: { x: number; y: number };
} {
  const fromPoints = getConnectionPoints(from);
  const toPoints = getConnectionPoints(to);

  // Calcular centro dos componentes
  const fromDims = getComponentDimensions(from.type);
  const toDims = getComponentDimensions(to.type);
  
  const fromCenter = {
    x: from.position.x + fromDims.width / 2,
    y: from.position.y + fromDims.height / 2
  };
  
  const toCenter = {
    x: to.position.x + toDims.width / 2,
    y: to.position.y + toDims.height / 2
  };

  // Determinar direção principal
  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;

  // Escolher pontos baseado na direção principal
  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal
    if (dx > 0) {
      return { start: fromPoints.right, end: toPoints.left };
    } else {
      return { start: fromPoints.left, end: toPoints.right };
    }
  } else {
    // Vertical
    if (dy > 0) {
      return { start: fromPoints.bottom, end: toPoints.top };
    } else {
      return { start: fromPoints.top, end: toPoints.bottom };
    }
  }
}

// Função para criar path SVG otimizado baseado nos pontos de conexão
export const createOptimizedConnectionPath = (
  fromPoint: ConnectionPoint,
  toPoint: ConnectionPoint,
  style: 'straight' | 'curved' | 'stepped' = 'curved'
): string => {
  const { x: x1, y: y1, side: fromSide } = fromPoint;
  const { x: x2, y: y2, side: toSide } = toPoint;

  if (style === 'straight') {
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }

  if (style === 'stepped') {
    // Conexão em degraus (mais limpa para layouts organizados)
    if (fromSide === 'right' && toSide === 'left') {
      const midX = x1 + (x2 - x1) / 2;
      return `M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`;
    }
    if (fromSide === 'bottom' && toSide === 'top') {
      const midY = y1 + (y2 - y1) / 2;
      return `M ${x1} ${y1} V ${midY} H ${x2} V ${y2}`;
    }
  }

  // Conexão curva (padrão)
  const dx = x2 - x1;
  const dy = y2 - y1;

  // Calcular pontos de controle baseado nas direções
  let cp1x, cp1y, cp2x, cp2y;

  if (fromSide === 'right' && toSide === 'left') {
    const offset = Math.abs(dx) * 0.5;
    cp1x = x1 + offset;
    cp1y = y1;
    cp2x = x2 - offset;
    cp2y = y2;
  } else if (fromSide === 'bottom' && toSide === 'top') {
    const offset = Math.abs(dy) * 0.5;
    cp1x = x1;
    cp1y = y1 + offset;
    cp2x = x2;
    cp2y = y2 - offset;
  } else if (fromSide === 'left' && toSide === 'right') {
    const offset = Math.abs(dx) * 0.5;
    cp1x = x1 - offset;
    cp1y = y1;
    cp2x = x2 + offset;
    cp2y = y2;
  } else if (fromSide === 'top' && toSide === 'bottom') {
    const offset = Math.abs(dy) * 0.5;
    cp1x = x1;
    cp1y = y1 - offset;
    cp2x = x2;
    cp2y = y2 + offset;
  } else {
    // Fallback para conexões diagonais
    cp1x = x1 + dx * 0.5;
    cp1y = y1;
    cp2x = x1 + dx * 0.5;
    cp2y = y2;
  }

  return `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
}; 