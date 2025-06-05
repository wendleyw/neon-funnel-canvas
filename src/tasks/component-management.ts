import { Task, TaskCategory, TaskContext, TaskResult } from './index';
import { FunnelComponent, ComponentTemplate } from '../types/funnel';

// Types for component management tasks
export interface CreateComponentInput {
  template: ComponentTemplate;
  position: { x: number; y: number };
  workspaceId: string;
  projectId: string;
}

export interface UpdateComponentInput {
  componentId: string;
  updates: Partial<FunnelComponent>;
}

export interface DeleteComponentInput {
  componentId: string;
}

export interface DuplicateComponentInput {
  componentId: string;
  offset?: { x: number; y: number };
}

export interface MoveComponentInput {
  componentId: string;
  newPosition: { x: number; y: number };
}

// Component Management Tasks
export const createComponentTask: Task<CreateComponentInput, FunnelComponent> = {
  id: 'component.create',
  name: 'Create Component',
  description: 'Creates a new funnel component from a template',
  category: TaskCategory.COMPONENT_MANAGEMENT,
  
  validate: (input) => {
    return !!(input.template?.type && input.position && input.workspaceId);
  },

  execute: async (input, context): Promise<TaskResult<FunnelComponent>> => {
    try {
      const newComponent: FunnelComponent = {
        id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: input.template.type as FunnelComponent['type'],
        position: input.position,
        connections: [],
        data: {
          title: input.template.defaultProps?.title || input.template.label,
          description: input.template.defaultProps?.description || '',
          image: input.template.defaultProps?.image || '',
          url: input.template.defaultProps?.url || '',
          status: input.template.defaultProps?.status || 'draft',
          properties: input.template.defaultProps?.properties || {}
        }
      };

      return {
        success: true,
        data: newComponent,
        metadata: {
          templateType: input.template.type,
          position: input.position,
          workspaceId: input.workspaceId,
          projectId: input.projectId
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create component: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

export const updateComponentTask: Task<UpdateComponentInput, FunnelComponent> = {
  id: 'component.update',
  name: 'Update Component',
  description: 'Updates an existing funnel component',
  category: TaskCategory.COMPONENT_MANAGEMENT,
  
  validate: (input) => {
    return !!(input.componentId && input.updates);
  },

  execute: async (input, context): Promise<TaskResult<FunnelComponent>> => {
    try {
      // In a real implementation, this would interact with the data store
      // For now, we'll return the structure expected
      const updatedComponent: Partial<FunnelComponent> = {
        id: input.componentId,
        ...input.updates
      };

      return {
        success: true,
        data: updatedComponent as FunnelComponent,
        metadata: {
          componentId: input.componentId,
          updatedFields: Object.keys(input.updates)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to update component: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

export const deleteComponentTask: Task<DeleteComponentInput, { deletedComponentId: string }> = {
  id: 'component.delete',
  name: 'Delete Component',
  description: 'Deletes a funnel component and its connections',
  category: TaskCategory.COMPONENT_MANAGEMENT,
  
  validate: (input) => {
    return !!input.componentId;
  },

  execute: async (input, context): Promise<TaskResult<{ deletedComponentId: string }>> => {
    try {
      return {
        success: true,
        data: { deletedComponentId: input.componentId },
        metadata: {
          componentId: input.componentId,
          deletedAt: context.timestamp
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete component: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  },

  rollback: async (context) => {
    // In a real implementation, this would restore the deleted component
    console.log('🔄 Rolling back component deletion', context);
  }
};

export const duplicateComponentTask: Task<DuplicateComponentInput, FunnelComponent> = {
  id: 'component.duplicate',
  name: 'Duplicate Component',
  description: 'Creates a copy of an existing component',
  category: TaskCategory.COMPONENT_MANAGEMENT,
  
  validate: (input) => {
    return !!input.componentId;
  },

  execute: async (input, context): Promise<TaskResult<FunnelComponent>> => {
    try {
      const offset = input.offset || { x: 50, y: 50 };
      
      // In a real implementation, this would fetch the original component
      // and create a copy with new ID and offset position
      const duplicatedComponent: FunnelComponent = {
        id: `component-dup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'landing-page', // This would come from the original component
        position: { x: 100 + offset.x, y: 100 + offset.y }, // This would be original position + offset
        connections: [], // Connections are not duplicated
        data: {
          title: 'Copy of Component', // This would come from the original
          description: '',
          image: '',
          url: '',
          status: 'draft',
          properties: {}
        }
      };

      return {
        success: true,
        data: duplicatedComponent,
        metadata: {
          originalComponentId: input.componentId,
          offset
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to duplicate component: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

export const moveComponentTask: Task<MoveComponentInput, { componentId: string; newPosition: { x: number; y: number } }> = {
  id: 'component.move',
  name: 'Move Component',
  description: 'Updates the position of a component on the canvas',
  category: TaskCategory.COMPONENT_MANAGEMENT,
  
  validate: (input) => {
    return !!(input.componentId && input.newPosition);
  },

  execute: async (input, context): Promise<TaskResult<{ componentId: string; newPosition: { x: number; y: number } }>> => {
    try {
      return {
        success: true,
        data: {
          componentId: input.componentId,
          newPosition: input.newPosition
        },
        metadata: {
          componentId: input.componentId,
          newPosition: input.newPosition,
          movedAt: context.timestamp
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to move component: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

// Export all component management tasks
export const componentManagementTasks = [
  createComponentTask,
  updateComponentTask,
  deleteComponentTask,
  duplicateComponentTask,
  moveComponentTask
]; 