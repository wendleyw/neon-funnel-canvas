
export interface FunnelComponent {
  id: string;
  type: 'landing-page' | 'quiz' | 'form' | 'email-sequence' | 'checkout' | 'automation' | 'analytics' | 'segmentation' | 'conversion' | 'custom' | 'target-audience' | 'offer' | 'traffic-organic' | 'traffic-paid' | 'lead-capture' | 'nurturing' | 'webinar-vsl' | 'sales-page' | 'checkout-upsell' | 'post-sales' | 'analysis' | 'instagram-post' | 'instagram-story' | 'instagram-reels' | 'instagram-carousel' | 'tiktok-video' | 'youtube-short' | 'youtube-video' | 'youtube-thumbnail' | 'facebook-post' | 'facebook-ad' | 'linkedin-post' | 'twitter-post' | 'note' | 'arrow' | 'frame' | string;
  position: { x: number; y: number };
  data: {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    status: 'draft' | 'active' | 'test' | 'published' | 'inactive';
    properties: Record<string, any>;
  };
  connections: string[];
  isExpanded?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  type: 'success' | 'failure' | 'conditional';
  color?: string;
  customColor?: string;
  animated?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FunnelProject {
  id: string;
  name: string;
  components: FunnelComponent[];
  connections: Connection[];
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
}

export interface ComponentFormData {
  title: string;
  description: string;
  image: string;
  url: string;
  status: FunnelComponent['data']['status'];
  properties: Record<string, any>;
}
