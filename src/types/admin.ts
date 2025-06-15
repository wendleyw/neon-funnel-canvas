export interface ContentTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  template_type: 'source' | 'page' | 'action';
}

export interface DeleteOperationResult {
  success: boolean;
  message: string;
  deletedCount?: number;
}

export interface SystemStatDetail {
  total: number;
  byType: {
    source: number;
    page: number;
    action: number;
  };
}

export interface SyncStatus {
  lastSynced: string;
  status: 'syncing' | 'synced' | 'error';
  error?: string;
}

export interface SystemStats {
  database: {
    total: number;
    byType: {
      source: number;
      page: number;
      action: number;
    };
    system?: {
      total: number;
      byType: {
        source: number;
        page: number;
        action: number;
      };
    };
    user: {
      total: number;
      byType: {
        source: number;
        page: number;
        action: number;
      };
    };
  };
  system?: {
    total: number;
    byType: {
      source: number;
      page: number;
      action: number;
    };
  };
  storage: {
    total_size: string;
    total_files: number;
  };
  syncStatus?: any;
}

export interface ContentItem {
  id: string;
  type: 'source' | 'page' | 'action';
  name: string;
  description: string | null;
  category: string;
  status: 'active' | 'inactive' | 'draft' | 'published';
  usage: number;
  rating: number;
  tags: string[];
  icon: string | null;
  color: string | null;
  config: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  is_premium: boolean;
  created_by: string | null;
}

export interface FrontendTemplate {
  id: string;
  type: 'source' | 'page' | 'action';
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'draft' | 'published';
  usage: number;
  rating: number;
  tags: string[];
  icon: string;
  color: string;
  config: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  isPremium: boolean;
  isSystemTemplate: boolean;
}

export interface CreateContentData {
  type: 'source' | 'page' | 'action';
  name: string;
  description: string;
  category: string;
  categoryId?: string;
  status: 'active' | 'inactive' | 'draft' | 'published';
  tags: string[];
  icon: string;
  color: string;
  config: Record<string, any>;
  created_by: string;
  is_premium: boolean;
}

export interface UpdateContentData {
  name?: string;
  description?: string;
  category?: string;
  categoryId?: string;
  status?: 'active' | 'inactive' | 'draft' | 'published';
  tags?: string[];
  icon?: string;
  color?: string;
  config?: Record<string, any>;
  is_premium?: boolean;
}
