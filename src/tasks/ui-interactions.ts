import { Task, TaskCategory, TaskContext, TaskResult } from './index';

export interface ShowToastInput {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  description?: string;
  duration?: number;
}

export const showToastTask: Task<ShowToastInput, { displayed: boolean }> = {
  id: 'ui.show-toast',
  name: 'Show Toast',
  description: 'Displays a toast notification',
  category: TaskCategory.UI_INTERACTIONS,
  
  validate: (input) => {
    return !!(input.type && input.message);
  },

  execute: async (input, context): Promise<TaskResult<{ displayed: boolean }>> => {
    try {
      return {
        success: true,
        data: { displayed: true },
        metadata: {
          type: input.type,
          message: input.message,
          description: input.description,
          duration: input.duration || 3000,
          displayedAt: context.timestamp
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to show toast: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

export const uiInteractionTasks = [showToastTask]; 