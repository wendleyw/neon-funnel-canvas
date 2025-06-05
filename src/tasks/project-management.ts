import { Task, TaskCategory, TaskContext, TaskResult } from './index';

export interface CreateProjectInput {
  name: string;
  description?: string;
  workspaceId: string;
}

export interface SaveProjectInput {
  projectId: string;
  data: {
    components: unknown[];
    connections: unknown[];
  };
}

export const createProjectTask: Task<CreateProjectInput, { projectId: string }> = {
  id: 'project.create',
  name: 'Create Project',
  description: 'Creates a new funnel project',
  category: TaskCategory.PROJECT_MANAGEMENT,
  
  validate: (input) => {
    return !!(input.name && input.workspaceId);
  },

  execute: async (input, context): Promise<TaskResult<{ projectId: string }>> => {
    try {
      const projectId = `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        success: true,
        data: { projectId },
        metadata: {
          name: input.name,
          description: input.description,
          workspaceId: input.workspaceId,
          createdAt: context.timestamp
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

export const saveProjectTask: Task<SaveProjectInput, { saved: boolean }> = {
  id: 'project.save',
  name: 'Save Project',
  description: 'Saves project data',
  category: TaskCategory.PROJECT_MANAGEMENT,
  
  validate: (input) => {
    return !!(input.projectId && input.data);
  },

  execute: async (input, context): Promise<TaskResult<{ saved: boolean }>> => {
    try {
      return {
        success: true,
        data: { saved: true },
        metadata: {
          projectId: input.projectId,
          componentsCount: Array.isArray(input.data.components) ? input.data.components.length : 0,
          connectionsCount: Array.isArray(input.data.connections) ? input.data.connections.length : 0,
          savedAt: context.timestamp
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to save project: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

export const projectManagementTasks = [createProjectTask, saveProjectTask]; 