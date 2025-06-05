import { Task, TaskCategory, TaskContext, TaskResult } from './index';

export interface ValidateComponentInput {
  componentData: {
    title: string;
    type: string;
    position: { x: number; y: number };
  };
}

export const validateComponentTask: Task<ValidateComponentInput, { isValid: boolean; errors: string[] }> = {
  id: 'validation.component',
  name: 'Validate Component',
  description: 'Validates component data',
  category: TaskCategory.VALIDATION,
  
  validate: (input) => {
    return !!(input.componentData);
  },

  execute: async (input, context): Promise<TaskResult<{ isValid: boolean; errors: string[] }>> => {
    try {
      const errors: string[] = [];
      
      if (!input.componentData.title) {
        errors.push('Title is required');
      }
      
      if (!input.componentData.type) {
        errors.push('Type is required');
      }
      
      if (!input.componentData.position) {
        errors.push('Position is required');
      }

      return {
        success: true,
        data: {
          isValid: errors.length === 0,
          errors
        },
        metadata: {
          validatedAt: context.timestamp,
          componentType: input.componentData.type
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to validate component: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

export const validationTasks = [validateComponentTask]; 