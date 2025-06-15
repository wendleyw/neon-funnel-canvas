
import React from 'react';

export interface ComponentData {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  status: 'active' | 'inactive' | 'draft' | 'published' | 'test' | 'paused';
  properties: Record<string, any>;
  metrics?: any;
  journey?: any;
  process?: any;
  content?: any;
  martech?: any;
}

export interface FunnelComponent {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: ComponentData;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  type: 'success' | 'failure' | 'redirect';
  color?: string;
  animated?: boolean;
  connectionData?: any;
}

export interface ComponentTemplate {
  id: string;
  name?: string;
  type: string;
  category: string;
  icon: React.ComponentType<{ className?: string }> | string;
  description: string;
  data?: Partial<ComponentData>;
  // Optional fields for backward compatibility and flexibility
  label?: string;
  originalType?: string;
  defaultProps?: any;
  color?: string;
  title?: string;
  diagramType?: 'shape' | 'card' | 'marketing-funnel' | 'customer-journey' | 'process-flow';
}

export interface FunnelProject {
    id: string;
    name: string;
    components: FunnelComponent[];
    connections: Connection[];
    viewport: any;
    createdAt?: string | number;
    updatedAt?: string | number;
}
