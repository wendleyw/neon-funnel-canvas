
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  projects: string[]; // Array of project IDs
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceProject {
  id: string;
  name: string;
  workspaceId: string;
  componentsCount: number;
  connectionsCount: number;
  createdAt: string;
  updatedAt: string;
}
