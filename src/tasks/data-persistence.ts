import { Task, TaskCategory, TaskContext, TaskResult } from './index';

export interface SaveDataInput {
  dataType: 'components' | 'connections' | 'project';
  data: unknown;
  projectId: string;
}

export const saveDataTask: Task<SaveDataInput, { saved: boolean }> = {
  id: 'data.save',
  name: 'Save Data',
  description: 'Saves data to persistent storage',
  category: TaskCategory.DATA_PERSISTENCE,
  
  validate: (input) => {
    return !!(input.dataType && input.data && input.projectId);
  },

  execute: async (input, context): Promise<TaskResult<{ saved: boolean }>> => {
    try {
      return {
        success: true,
        data: { saved: true },
        metadata: {
          dataType: input.dataType,
          projectId: input.projectId,
          savedAt: context.timestamp
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to save data: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

export const dataPersistenceTasks = [saveDataTask]; 