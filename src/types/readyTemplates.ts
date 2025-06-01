
import { FunnelComponent, Connection } from './funnel';

export interface ReadyTemplate {
  id: string;
  name: string;
  description: string;
  category: 'digital-launch' | 'lead-generation' | 'e-commerce' | 'webinar' | 'course' | 'coaching';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnail?: string;
  components: FunnelComponent[];
  connections: Connection[];
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}
