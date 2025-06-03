export interface FunnelComponent {
  id: string;
  type: 
    // Fontes de Tráfego - Paid
    | 'facebook-ads' | 'instagram-ads' | 'google-ads' | 'bing-ads' | 'youtube-ads' | 'linkedin-ads' 
    | 'tiktok-ads' | 'twitter-ads' | 'pinterest-ads' | 'snapchat-ads' | 'reddit-ads'
    // Fontes de Tráfego - Search
    | 'google-organic' | 'bing-organic' | 'youtube-organic' | 'all-search'
    // Fontes de Tráfego - Social
    | 'facebook-organic' | 'instagram-organic' | 'pinterest-organic' | 'reddit-organic' 
    | 'linkedin-organic' | 'tiktok-organic' | 'x-organic'
    // Fontes de Tráfego - Messaging
    | 'whatsapp-business' | 'telegram-marketing' | 'facebook-messenger' | 'slack-marketing' 
    | 'sms-marketing' | 'chatbot-marketing'
    // Fontes de Tráfego - CRM
    | 'ontraport-crm' | 'keap-crm' | 'hubspot-crm' | 'salesforce-crm' | 'pipedrive-crm' | 'mailchimp-crm'
    | 'intercom-crm' | 'marketo-crm' | 'constant-contact-crm' | 'activecampaign-crm' | 'drip-crm'
    // Fontes de Tráfego - Other Sites
    | 'zoho-site' | 'yelp-site' | 'zendesk-site' | 'drift-site' | 'gotomeeting-site' | 'amazon-site'
    | 'zoom-site' | 'gmail-site' | 'spotify-site' | 'snapchat-site' | 'clutch-site' | 'googlemaps-site'
    // Fontes de Tráfego - Offline
    | 'job-interview' | 'print-advertising' | 'event-marketing' | 'online-meeting' | 'banner-advertising'
    | 'direct-mail' | 'tv-advertising' | 'biz-directory' | 'workshop-seminar' | 'radio-advertising'
    | 'guest-blog' | 'job-site' | 'meeting-networking' | 'billboard-advertising' | 'business-card'
    | 'career-site' | 'phone-marketing' | 'report-marketing' | 'qr-code'
    // Fontes de Tráfego - Content & Events
    | 'webinar-traffic' | 'podcast-marketing' | 'content-marketing' | 'influencer-marketing' | 'referral-traffic'
    // Fontes de Tráfego - Other
    | 'email-marketing' | 'direct-traffic' | 'affiliate-marketing'
    // Custom Icons
    | 'custom-uploaded-icon'
    // Legacy types (manter compatibilidade)
    | 'social-ads' | 'google-search' | 'google-display' | 'seo-organic' | 'email-traffic' 
    | 'content-blog' | 'content-video' | 'content-podcast'
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
    
    // === USER ACTIONS (Ações do Usuário) ===
    // Conversion Actions
    | 'purchase' | 'form-completion' | 'schedule-meeting' | 'deal-won'
    // Engagement Actions  
    | 'watch-video' | 'link-click' | 'scroll' | 'button-click' | 'deal-status'
    // Integration Actions
    | 'ghl-appointment' | 'ghl-order' | 'ghl-opportunity-orange' | 'ghl-opportunity-green' | 'hubspot-deal' | 'hubspot-deal-status'
    // Custom Actions
    | 'add-to-list' | 'contact' | 'request-content' | 'request-info' | 'popup' | 'add-to-cart' | 'add-tag'
    
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
