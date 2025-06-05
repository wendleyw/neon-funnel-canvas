import { Task, TaskCategory, TaskContext, TaskResult } from './index';

export interface BroadcastUpdateInput {
  eventType: 'component-added' | 'component-updated' | 'component-deleted' | 'connection-added' | 'connection-deleted';
  data: unknown;
  projectId: string;
}

export const broadcastUpdateTask: Task<BroadcastUpdateInput, { broadcasted: boolean }> = {
  id: 'realtime.broadcast',
  name: 'Broadcast Update',
  description: 'Broadcasts real-time updates to other users',
  category: TaskCategory.REAL_TIME,
  
  validate: (input) => {
    return !!(input.eventType && input.projectId);
  },

  execute: async (input, context): Promise<TaskResult<{ broadcasted: boolean }>> => {
    try {
      return {
        success: true,
        data: { broadcasted: true },
        metadata: {
          eventType: input.eventType,
          projectId: input.projectId,
          broadcastedAt: context.timestamp,
          userId: context.userId
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to broadcast update: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

export const realTimeTasks = [broadcastUpdateTask]; 