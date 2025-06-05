import { Task, TaskCategory, TaskContext, TaskResult } from './index';
import { Connection as FunnelConnection } from '../types/funnel';

// Types for connection management tasks
export interface CreateConnectionInput {
  sourceComponentId: string;
  targetComponentId: string;
  connectionType?: string;
  connectionData?: {
    condition?: string;
    dataType?: string;
    properties?: Record<string, unknown>;
  };
}

export interface UpdateConnectionInput {
  connectionId: string;
  updates: Partial<FunnelConnection>;
}

export interface DeleteConnectionInput {
  connectionId: string;
}

export interface ValidateConnectionInput {
  sourceComponentId: string;
  targetComponentId: string;
  connectionRules?: Record<string, string[]>;
}

export interface RecalculateConnectionHandlesInput {
  connectionId: string;
  sourcePosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
}

// Connection Management Tasks
export const createConnectionTask: Task<CreateConnectionInput, FunnelConnection> = {
  id: 'connection.create',
  name: 'Create Connection',
  description: 'Creates a new connection between two components',
  category: TaskCategory.CONNECTION_MANAGEMENT,
  
  validate: (input) => {
    return !!(input.sourceComponentId && 
              input.targetComponentId && 
              input.sourceComponentId !== input.targetComponentId);
  },

  execute: async (input, context): Promise<TaskResult<FunnelConnection>> => {
    try {
      const newConnection: FunnelConnection = {
        id: `connection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        from: input.sourceComponentId,
        to: input.targetComponentId,
        type: input.connectionType === 'failure' ? 'failure' : 'success',
        color: input.connectionType === 'failure' ? '#EF4444' : '#10B981',
        animated: true,
        connectionData: {
          condition: input.connectionData?.condition || 'Lead',
          dataType: input.connectionData?.dataType || 'standard'
        }
      };

      return {
        success: true,
        data: newConnection,
        metadata: {
          sourceComponentId: input.sourceComponentId,
          targetComponentId: input.targetComponentId,
          connectionType: input.connectionType,
          createdAt: context.timestamp
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create connection: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

export const updateConnectionTask: Task<UpdateConnectionInput, FunnelConnection> = {
  id: 'connection.update',
  name: 'Update Connection',
  description: 'Updates an existing connection',
  category: TaskCategory.CONNECTION_MANAGEMENT,
  
  validate: (input) => {
    return !!(input.connectionId && input.updates);
  },

  execute: async (input, context): Promise<TaskResult<FunnelConnection>> => {
    try {
      // In a real implementation, this would fetch and update the existing connection
      const updatedConnection: Partial<FunnelConnection> = {
        id: input.connectionId,
        ...input.updates
      };

      return {
        success: true,
        data: updatedConnection as FunnelConnection,
        metadata: {
          connectionId: input.connectionId,
          updatedFields: Object.keys(input.updates),
          updatedAt: context.timestamp
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to update connection: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

export const deleteConnectionTask: Task<DeleteConnectionInput, { deletedConnectionId: string }> = {
  id: 'connection.delete',
  name: 'Delete Connection',
  description: 'Deletes a connection between components',
  category: TaskCategory.CONNECTION_MANAGEMENT,
  
  validate: (input) => {
    return !!input.connectionId;
  },

  execute: async (input, context): Promise<TaskResult<{ deletedConnectionId: string }>> => {
    try {
      return {
        success: true,
        data: { deletedConnectionId: input.connectionId },
        metadata: {
          connectionId: input.connectionId,
          deletedAt: context.timestamp
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete connection: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  },

  rollback: async (context) => {
    // In a real implementation, this would restore the deleted connection
    console.log('🔄 Rolling back connection deletion', context);
  }
};

export const validateConnectionTask: Task<ValidateConnectionInput, { isValid: boolean; reason?: string }> = {
  id: 'connection.validate',
  name: 'Validate Connection',
  description: 'Validates if a connection between two components is allowed',
  category: TaskCategory.CONNECTION_MANAGEMENT,
  
  validate: (input) => {
    return !!(input.sourceComponentId && input.targetComponentId);
  },

  execute: async (input, context): Promise<TaskResult<{ isValid: boolean; reason?: string }>> => {
    try {
      // Default connection rules - in a real implementation, this would come from configuration
      const defaultConnectionRules: Record<string, string[]> = {
        'landing-page': ['quiz', 'form', 'email-sequence', 'webinar-live', 'opt-in-page', 'sales-page'],
        'quiz': ['sales-page', 'opt-in-page', 'email-sequence', 'thank-you-page'],
        'form': ['thank-you-page', 'email-sequence', 'sales-page'],
        'email-sequence': ['sales-page', 'webinar-live', 'landing-page', 'checkout'],
        'sales-page': ['checkout', 'thank-you-page'],
        'checkout': ['thank-you-page'],
        'webinar-live': ['sales-page', 'opt-in-page', 'checkout'],
        'webinar-replay': ['sales-page', 'opt-in-page', 'checkout'],
        'opt-in-page': ['form', 'email-sequence', 'download-page', 'thank-you-page'],
        'download-page': ['thank-you-page'],
        'calendar-page': ['thank-you-page', 'sales-page']
      };

      const connectionRules = input.connectionRules || defaultConnectionRules;
      
      // In a real implementation, we would fetch the actual component types
      // For now, we'll simulate validation
      const isValid = true; // This would be the actual validation logic
      
      return {
        success: true,
        data: { 
          isValid,
          reason: isValid ? undefined : 'Connection not allowed by validation rules'
        },
        metadata: {
          sourceComponentId: input.sourceComponentId,
          targetComponentId: input.targetComponentId,
          validationRules: Object.keys(connectionRules).length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to validate connection: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

export const recalculateConnectionHandlesTask: Task<RecalculateConnectionHandlesInput, { sourceHandle: string; targetHandle: string }> = {
  id: 'connection.recalculate-handles',
  name: 'Recalculate Connection Handles',
  description: 'Recalculates optimal connection points based on component positions',
  category: TaskCategory.CONNECTION_MANAGEMENT,
  
  validate: (input) => {
    return !!(input.connectionId && input.sourcePosition && input.targetPosition);
  },

  execute: async (input, context): Promise<TaskResult<{ sourceHandle: string; targetHandle: string }>> => {
    try {
      // Calculate optimal handles based on positions
      const deltaX = input.targetPosition.x - input.sourcePosition.x;
      const deltaY = input.targetPosition.y - input.sourcePosition.y;
      
      let sourceHandle: string;
      let targetHandle: string;
      
      // Simple logic for handle calculation - in a real implementation this would be more sophisticated
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal connection is stronger
        if (deltaX > 0) {
          sourceHandle = 'right-source';
          targetHandle = 'left-target';
        } else {
          sourceHandle = 'left-source';
          targetHandle = 'right-target';
        }
      } else {
        // Vertical connection is stronger
        if (deltaY > 0) {
          sourceHandle = 'bottom-source';
          targetHandle = 'top-target';
        } else {
          sourceHandle = 'top-source';
          targetHandle = 'bottom-target';
        }
      }

      return {
        success: true,
        data: { sourceHandle, targetHandle },
        metadata: {
          connectionId: input.connectionId,
          sourcePosition: input.sourcePosition,
          targetPosition: input.targetPosition,
          deltaX,
          deltaY,
          calculatedAt: context.timestamp
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to recalculate connection handles: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

// Export all connection management tasks
export const connectionManagementTasks = [
  createConnectionTask,
  updateConnectionTask,
  deleteConnectionTask,
  validateConnectionTask,
  recalculateConnectionHandlesTask
]; 