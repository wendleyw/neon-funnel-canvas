
export interface FunnelComponent {
  id: string;
  type: 'landing-page' | 'quiz' | 'form' | 'email-sequence' | 'checkout' | 'automation' | 'analytics' | 'segmentation' | 'conversion' | 'custom' | string;
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
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  type: 'success' | 'failure' | 'conditional';
  color?: string;
  customColor?: string;
  animated?: boolean;
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
  type: FunnelComponent['type'];
  icon: string;
  label: string;
  color: string;
  category: string;
  defaultProps: FunnelComponent['data'];
}

export interface ComponentFormData {
  title: string;
  description: string;
  image: string;
  url: string;
  status: FunnelComponent['data']['status'];
  properties: Record<string, any>;
}
