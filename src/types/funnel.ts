export interface FunnelComponent {
  id: string;
  type: 
    // Traffic Sources - Paid
    | 'facebook-ads' | 'instagram-ads' | 'google-ads' | 'bing-ads' | 'youtube-ads' | 'linkedin-ads' 
    | 'tiktok-ads' | 'twitter-ads' | 'pinterest-ads' | 'snapchat-ads' | 'reddit-ads'
    // Traffic Sources - Search
    | 'google-organic' | 'bing-organic' | 'youtube-organic' | 'all-search'
    // Traffic Sources - Social
    | 'facebook-organic' | 'instagram-organic' | 'pinterest-organic' | 'reddit-organic' 
    | 'linkedin-organic' | 'tiktok-organic' | 'x-organic'
    // Traffic Sources - Messaging
    | 'whatsapp-business' | 'telegram-marketing' | 'facebook-messenger' | 'slack-marketing' 
    | 'sms-marketing' | 'chatbot-marketing'
    // Traffic Sources - CRM
    | 'ontraport-crm' | 'keap-crm' | 'hubspot-crm' | 'salesforce-crm' | 'pipedrive-crm' | 'mailchimp-crm'
    | 'intercom-crm' | 'marketo-crm' | 'constant-contact-crm' | 'activecampaign-crm' | 'drip-crm'
    // Traffic Sources - Other Sites
    | 'zoho-site' | 'yelp-site' | 'zendesk-site' | 'drift-site' | 'gotomeeting-site' | 'amazon-site'
    | 'zoom-site' | 'gmail-site' | 'spotify-site' | 'snapchat-site' | 'clutch-site' | 'googlemaps-site'
    // Traffic Sources - Offline
    | 'job-interview' | 'print-advertising' | 'event-marketing' | 'online-meeting' | 'banner-advertising'
    | 'direct-mail' | 'tv-advertising' | 'biz-directory' | 'workshop-seminar' | 'radio-advertising'
    | 'guest-blog' | 'job-site' | 'meeting-networking' | 'billboard-advertising' | 'business-card'
    | 'career-site' | 'phone-marketing' | 'report-marketing' | 'qr-code'
    // Traffic Sources - Content & Events
    | 'webinar-traffic' | 'podcast-marketing' | 'content-marketing' | 'influencer-marketing' | 'referral-traffic'
    // Traffic Sources - Other
    | 'email-marketing' | 'direct-traffic' | 'affiliate-marketing'
    // Custom Icons
    | 'custom-uploaded-icon'
    // Legacy types (maintain compatibility)
    | 'social-ads' | 'google-search' | 'google-display' | 'seo-organic' | 'email-traffic' 
    | 'content-blog' | 'content-video' | 'content-podcast'
    // Lead Capture and Engagement
    | 'landing-page' | 'quiz' | 'form' | 'cta-button' | 'lead-magnet' | 'ebook' | 'checklist' | 'webinar' | 'template-offer'
    // Nurturing and Relationship
    | 'email-sequence' | 'automation' | 'retargeting-ads'
    // Sales and Conversion
    | 'sales-page' | 'checkout' | 'order-bump' | 'upsell' | 'downsell' | 'conversion'
    // Post-Sale and Retention
    | 'thank-you-page' | 'member-area' | 'customer-support'
    // Analytics and Optimization
    | 'analytics' | 'ab-test'
    // Customer Journey
    | 'customer-journey' | 'touchpoint' | 'emotion-point' | 'pain-point' | 'opportunity'
    // Process Flow
    | 'process-start' | 'process-step' | 'decision-point' | 'process-end'
    // Content
    | 'content-piece' | 'keyword' | 'distribution-channel'
    // MarTech Stack
    | 'crm-tool' | 'automation-tool' | 'ads-tool' | 'analytics-tool' | 'content-tool' | 'sales-tool' | 'communication-tool'
    
    // === USER ACTIONS ===
    // Conversion Actions
    | 'purchase' | 'form-completion' | 'schedule-meeting' | 'deal-won'
    // Engagement Actions  
    | 'watch-video' | 'link-click' | 'scroll' | 'button-click' | 'deal-status'
    // Integration Actions
    | 'ghl-appointment' | 'ghl-order' | 'ghl-opportunity-orange' | 'ghl-opportunity-green' | 'hubspot-deal' | 'hubspot-deal-status'
    // Custom Actions
    | 'add-to-list' | 'contact' | 'request-content' | 'request-info' | 'popup' | 'add-to-cart' | 'add-tag'
    
    // === PHASE 2: SPECIALIZED DIAGRAMS ===
    
    // Marketing Funnel Diagrams - With metrics
    | 'funnel-stage' | 'conversion-metric' | 'traffic-metric' | 'revenue-metric' | 'funnel-connector'
    
    // Customer Journey Maps - With emotions/touchpoints
    | 'journey-stage' | 'customer-persona' | 'emotion-state' | 'touchpoint-interaction' | 'pain-point-critical' | 'opportunity-moment'
    
    // Process Flowcharts - With decision points
    | 'flow-start' | 'flow-process' | 'flow-decision' | 'flow-end' | 'flow-connector' | 'flow-condition'
    
    // Content Mapping Grids
    | 'content-category' | 'content-format' | 'content-channel' | 'content-audience' | 'content-goal'
    
    // MarTech Stack Integration
    | 'martech-platform' | 'data-source' | 'integration-point' | 'automation-trigger' | 'data-flow'
    
    // Visual Elements (existing)
    | 'note' | 'arrow' | 'frame' | 'custom'
    // Existing types maintained for compatibility
    | 'webinar-vsl' | string;
  position: { x: number; y: number };
  data: {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    status: 'draft' | 'active' | 'test' | 'published' | 'inactive';
    properties: Record<string, any>;
    
    // === SPECIALIZED PROPERTIES FOR DIAGRAMS ===
    
    // For Marketing Funnel Diagrams
    metrics?: {
      visitors?: number;
      conversions?: number;
      conversionRate?: number;
      revenue?: number;
      cost?: number;
      roi?: number;
    };
    
    // For Customer Journey Maps
    journey?: {
      stage?: 'awareness' | 'consideration' | 'decision' | 'retention' | 'advocacy';
      emotion?: 'delighted' | 'satisfied' | 'neutral' | 'frustrated' | 'angry';
      intensity?: 1 | 2 | 3 | 4 | 5;
      channels?: string[];
      actions?: string[];
    };
    
    // For Process Flowcharts
    process?: {
      flowType?: 'start' | 'process' | 'decision' | 'end';
      conditions?: string[];
      outputs?: string[];
      responsible?: string;
      duration?: string;
    };
    
    // For Content Mapping
    content?: {
      format?: 'blog' | 'video' | 'podcast' | 'ebook' | 'webinar' | 'social' | 'email';
      stage?: 'awareness' | 'consideration' | 'decision' | 'retention';
      priority?: 'high' | 'medium' | 'low';
      frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    };
    
    // For MarTech Stack
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

// === NEW TYPES FOR SPECIALIZED DIAGRAMS ===

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
  
  // === SPECIALIZED PROPERTIES FOR CONNECTIONS ===
  connectionData?: {
    // For process flows
    condition?: string;
    probability?: number;
    
    // For data flows
    dataType?: string;
    frequency?: string;
    
    // For customer journeys
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
  
  // === PROPERTIES FOR SPECIALIZED DIAGRAMS ===
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
  tags?: string[];
  defaultProps: FunnelComponent['data'];
  title?: string;
  description?: string;
  config?: Record<string, any>;
  
  // === SPECIALIZED SETTINGS ===
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

export type ComponentType = 
  | 'landing-page' 
  | 'sales-page' 
  | 'quiz'
  | 'form'
  | 'email-sequence'
  | 'checkout'
  | 'thank-you-page'
  | 'webinar-live'
  | 'webinar-replay'
  | 'opt-in-page'
  | 'download-page'
  | 'calendar-page'
  | 'custom-shape'
  | 'lead-hub'; // New: Central hub for Lead connections
