import { Task, TaskCategory, TaskContext, TaskResult } from './index';

export interface ExportProjectInput {
  projectId: string;
  format: 'json' | 'csv' | 'pdf';
}

export const exportProjectTask: Task<ExportProjectInput, { exportUrl: string; format: string }> = {
  id: 'export.project',
  name: 'Export Project',
  description: 'Exports project data in specified format',
  category: TaskCategory.EXPORT_IMPORT,
  
  validate: (input) => {
    return !!(input.projectId && input.format);
  },

  execute: async (input, context): Promise<TaskResult<{ exportUrl: string; format: string }>> => {
    try {
      const exportUrl = `exports/${input.projectId}.${input.format}`;
      
      return {
        success: true,
        data: {
          exportUrl,
          format: input.format
        },
        metadata: {
          projectId: input.projectId,
          format: input.format,
          exportedAt: context.timestamp
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to export project: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

export const exportImportTasks = [exportProjectTask]; 