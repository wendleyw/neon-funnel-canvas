
export interface FunnelComponent {
  id: string;
  type: 'landing-page' | 'quiz' | 'form' | 'email-sequence' | 'checkout' | 'automation' | 'analytics' | 'segmentation' | 'conversion';
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
  defaultData: FunnelComponent['data'];
}

export interface ComponentFormData {
  title: string;
  description: string;
  image: string;
  url: string;
  status: FunnelComponent['data']['status'];
  properties: Record<string, any>;
}
