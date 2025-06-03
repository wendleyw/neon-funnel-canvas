export interface FunnelComponent {
  id: string;
  type: 
    // Fontes de Tráfego
    | 'social-ads' | 'facebook-ads' | 'instagram-ads' | 'tiktok-ads' | 'google-ads' | 'google-search' | 'google-display' | 'youtube-ads' 
    | 'seo-organic' | 'email-traffic' | 'content-blog' | 'content-video' | 'content-podcast'
    // Captura de Leads e Engajamento
    | 'landing-page' | 'quiz' | 'form' | 'cta-button' | 'lead-magnet' | 'ebook' | 'checklist' | 'webinar' | 'template-offer'
    // Nutrição e Relacionamento
    | 'email-sequence' | 'automation' | 'retargeting-ads'
    // Vendas e Conversão
    | 'sales-page' | 'checkout' | 'order-bump' | 'upsell' | 'downsell' | 'conversion'
    // Pós-Venda e Retenção
    | 'thank-you-page' | 'member-area' | 'customer-support'
    // Analytics e Otimização
    | 'analytics' | 'ab-test'
    // Jornada do Cliente
    | 'customer-journey' | 'touchpoint' | 'emotion-point' | 'pain-point' | 'opportunity'
    // Fluxo de Processo
    | 'process-start' | 'process-step' | 'decision-point' | 'process-end'
    // Conteúdo
    | 'content-piece' | 'keyword' | 'distribution-channel'
    // MarTech Stack
    | 'crm-tool' | 'automation-tool' | 'ads-tool' | 'analytics-tool' | 'content-tool' | 'sales-tool' | 'communication-tool'
    
    // === FASE 2: DIAGRAMAS ESPECIALIZADOS ===
    
    // Marketing Funnel Diagrams - Com métricas
    | 'funnel-stage' | 'conversion-metric' | 'traffic-metric' | 'revenue-metric' | 'funnel-connector'
    
    // Customer Journey Maps - Com emotions/touchpoints
    | 'journey-stage' | 'customer-persona' | 'emotion-state' | 'touchpoint-interaction' | 'pain-point-critical' | 'opportunity-moment'
    
    // Process Flowcharts - Com decision points
    | 'flow-start' | 'flow-process' | 'flow-decision' | 'flow-end' | 'flow-connector' | 'flow-condition'
    
    // Content Mapping Grids
    | 'content-category' | 'content-format' | 'content-channel' | 'content-audience' | 'content-goal'
    
    // MarTech Stack Integration
    | 'martech-platform' | 'data-source' | 'integration-point' | 'automation-trigger' | 'data-flow'
    
    // Elementos Visuais (existentes)
    | 'note' | 'arrow' | 'frame' | 'custom'
    // Tipos existentes mantidos para compatibilidade
    | 'webinar-vsl' | string;
  position: { x: number; y: number };
  data: {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    status: 'draft' | 'active' | 'test' | 'published' | 'inactive';
    properties: Record<string, any>;
    
    // === PROPRIEDADES ESPECIALIZADAS PARA DIAGRAMAS ===
    
    // Para Marketing Funnel Diagrams
    metrics?: {
      visitors?: number;
      conversions?: number;
      conversionRate?: number;
      revenue?: number;
      cost?: number;
      roi?: number;
    };
    
    // Para Customer Journey Maps
    journey?: {
      stage?: 'awareness' | 'consideration' | 'decision' | 'retention' | 'advocacy';
      emotion?: 'delighted' | 'satisfied' | 'neutral' | 'frustrated' | 'angry';
      intensity?: 1 | 2 | 3 | 4 | 5;
      channels?: string[];
      actions?: string[];
    };
    
    // Para Process Flowcharts
    process?: {
      flowType?: 'start' | 'process' | 'decision' | 'end';
      conditions?: string[];
      outputs?: string[];
      responsible?: string;
      duration?: string;
    };
    
    // Para Content Mapping
    content?: {
      format?: 'blog' | 'video' | 'podcast' | 'ebook' | 'webinar' | 'social' | 'email';
      stage?: 'awareness' | 'consideration' | 'decision' | 'retention';
      priority?: 'high' | 'medium' | 'low';
      frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    };
    
    // Para MarTech Stack
    martech?: {
      category?: 'crm' | 'automation' | 'analytics' | 'advertising' | 'content' | 'sales' | 'support';
      vendor?: string;
      integrations?: string[];
      dataTypes?: string[];
      cost?: number;
    };
  };
  connections: string[];
  isExpanded?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// === NOVOS TIPOS PARA DIAGRAMAS ESPECIALIZADOS ===

export interface DiagramTemplate {
  id: string;
  name: string;
  description: string;
  type: 'marketing-funnel' | 'customer-journey' | 'process-flow' | 'content-mapping' | 'martech-stack';
  icon: string;
  category: string;
  components: FunnelComponent[];
  connections: Connection[];
  layout: {
    width: number;
    height: number;
    grid?: boolean;
    spacing?: number;
  };
  metadata?: {
    industry?: string;
    complexity?: 'simple' | 'intermediate' | 'advanced';
    estimatedTime?: string;
    tags?: string[];
  };
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  type: 'success' | 'failure' | 'conditional' | 'data-flow' | 'process-flow' | 'emotional-flow';
  color?: string;
  customColor?: string;
  animated?: boolean;
  
  // === PROPRIEDADES ESPECIALIZADAS PARA CONEXÕES ===
  connectionData?: {
    // Para fluxos de processo
    condition?: string;
    probability?: number;
    
    // Para fluxos de dados
    dataType?: string;
    frequency?: string;
    
    // Para jornadas do cliente
    trigger?: string;
    emotion?: string;
  };
  
  createdAt?: string;
  updatedAt?: string;
}

export interface FunnelProject {
  id: string;
  name: string;
  components: FunnelComponent[];
  connections: Connection[];
  
  // === PROPRIEDADES PARA DIAGRAMAS ESPECIALIZADOS ===
  projectType?: 'funnel' | 'marketing-funnel' | 'customer-journey' | 'process-flow' | 'content-mapping' | 'martech-stack' | 'mixed';
  diagramSettings?: {
    showMetrics?: boolean;
    showEmotions?: boolean;
    showDataFlow?: boolean;
    gridEnabled?: boolean;
    snapToGrid?: boolean;
  };
  
  createdAt: string;
  updatedAt: string;
}

export interface ComponentTemplate {
  id?: string;
  type: FunnelComponent['type'];
  icon: string;
  label: string;
  color: string;
  category: string;
  defaultProps: FunnelComponent['data'];
  title?: string;
  description?: string;
  config?: Record<string, any>;
  
  // === CONFIGURAÇÕES ESPECIALIZADAS ===
  diagramType?: 'marketing-funnel' | 'customer-journey' | 'process-flow' | 'content-mapping' | 'martech-stack' | 'general';
  complexity?: 'simple' | 'intermediate' | 'advanced';
}

export interface ComponentFormData {
  title: string;
  description: string;
  image: string;
  url: string;
  status: FunnelComponent['data']['status'];
  properties: Record<string, any>;
}
