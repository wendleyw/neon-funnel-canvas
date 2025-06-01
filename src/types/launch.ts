
export interface LaunchProject {
  id: string;
  name: string;
  description?: string;
  type: 'seed' | 'internal' | 'perpetual' | 'campaign' | 'product';
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
  budget?: number;
  currency: string;
  startDate?: string;
  endDate?: string;
  objectives: LaunchObjective[];
  checklist: LaunchChecklistItem[];
  metrics: LaunchMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface LaunchObjective {
  id: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string; // ex: 'leads', 'sales', 'revenue', 'users'
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

export interface LaunchChecklistItem {
  id: string;
  title: string;
  description?: string;
  phase: 'pre' | 'during' | 'post';
  completed: boolean;
  assignedTo?: string;
  dueDate?: string;
  dependencies: string[]; // IDs of other checklist items
}

export interface LaunchMetrics {
  totalLeads: number;
  totalSales: number;
  totalRevenue: number;
  conversionRate: number;
  cost: number;
  roi: number;
  roas: number;
  cpl: number; // Cost per Lead
  cac: number; // Customer Acquisition Cost
  ltv: number; // Lifetime Value
}

export interface Persona {
  id: string;
  name: string;
  age?: number;
  avatar?: string;
  description: string;
  pains: string[];
  dreams: string[];
  objections: string[];
  demographics: {
    location?: string;
    income?: string;
    education?: string;
    profession?: string;
  };
  psychographics: {
    interests: string[];
    values: string[];
    lifestyle: string[];
  };
  keyMessages: PersonaMessage[];
  linkedProducts: string[]; // Product IDs
  linkedCampaigns: string[]; // Campaign IDs
}

export interface PersonaMessage {
  id: string;
  type: 'headline' | 'pain_point' | 'solution' | 'cta' | 'objection_handler';
  content: string;
  context: string; // Where to use this message
}

export interface ProductOffer {
  id: string;
  name: string;
  description: string;
  type: 'digital' | 'physical' | 'service' | 'course' | 'subscription';
  price: number;
  currency: string;
  originalPrice?: number;
  bonus: OfferBonus[];
  valueProposition: string;
  mentalTriggers: MentalTrigger[];
  salesPageUrl?: string;
  images: string[];
  features: string[];
  benefits: string[];
  guarantee?: {
    type: 'money_back' | 'satisfaction' | 'performance';
    duration: number;
    unit: 'days' | 'months';
    description: string;
  };
}

export interface OfferBonus {
  id: string;
  name: string;
  description: string;
  value: number;
  image?: string;
}

export interface MentalTrigger {
  id: string;
  type: 'scarcity' | 'urgency' | 'social_proof' | 'authority' | 'reciprocity' | 'consistency';
  title: string;
  description: string;
  active: boolean;
  settings: Record<string, any>;
}

export interface TrafficSource {
  id: string;
  name: string;
  type: 'organic' | 'paid';
  platform: 'facebook' | 'google' | 'tiktok' | 'instagram' | 'youtube' | 'linkedin' | 'other';
  status: 'active' | 'paused' | 'completed';
  budget?: number;
  metrics: {
    impressions: number;
    clicks: number;
    ctr: number;
    cpc: number;
    conversions: number;
    cost: number;
    roas: number;
  };
  creatives: Creative[];
  targeting?: {
    age?: [number, number];
    gender?: 'male' | 'female' | 'all';
    locations: string[];
    interests: string[];
    behaviors: string[];
  };
}

export interface Creative {
  id: string;
  name: string;
  type: 'image' | 'video' | 'carousel' | 'text';
  url?: string;
  thumbnail?: string;
  copy: string;
  headline?: string;
  description?: string;
  cta: string;
  metrics: {
    impressions: number;
    clicks: number;
    ctr: number;
    conversions: number;
    cost: number;
  };
}
