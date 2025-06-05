import { Task, TaskCategory, TaskContext, TaskResult } from './index';

export interface SwitchWorkspaceInput {
  workspaceId: string;
}

export const switchWorkspaceTask: Task<SwitchWorkspaceInput, { workspaceId: string }> = {
  id: 'workspace.switch',
  name: 'Switch Workspace',
  description: 'Switches to a different workspace',
  category: TaskCategory.WORKSPACE_MANAGEMENT,
  
  validate: (input) => {
    return !!input.workspaceId;
  },

  execute: async (input, context): Promise<TaskResult<{ workspaceId: string }>> => {
    try {
      return {
        success: true,
        data: { workspaceId: input.workspaceId },
        metadata: {
          previousWorkspaceId: context.workspaceId,
          newWorkspaceId: input.workspaceId,
          switchedAt: context.timestamp
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to switch workspace: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

export const workspaceManagementTasks = [switchWorkspaceTask]; 