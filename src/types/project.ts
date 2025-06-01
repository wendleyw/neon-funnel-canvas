
export interface ProjectStats {
  componentsCount: number;
  connectionsCount: number;
  lastModified: string;
  isValid: boolean;
}

export interface ProjectValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ProjectOperation {
  type: 'create' | 'update' | 'delete';
  entityType: 'component' | 'connection';
  entityId: string;
  timestamp: string;
}

export interface ProjectMetrics {
  performance: {
    renderTime: number;
    memoryUsage: number;
  };
  usage: {
    operations: ProjectOperation[];
    sessionDuration: number;
  };
}
