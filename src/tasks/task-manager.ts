import { Task, TaskCategory, TaskContext, TaskManager, TaskResult } from './index';

/**
 * Concrete implementation of the TaskManager interface
 * Handles task registration, execution, and context management
 */
export class AppTaskManager implements TaskManager {
  private tasks = new Map<string, Task>();
  private tasksByCategory = new Map<TaskCategory, Set<string>>();
  
  constructor() {
    // Initialize category maps
    Object.values(TaskCategory).forEach(category => {
      this.tasksByCategory.set(category, new Set());
    });
  }

  registerTask<TInput, TOutput>(task: Task<TInput, TOutput>): void {
    // Validate task before registration
    if (!task.id || !task.name || !task.execute) {
      throw new Error(`Invalid task: ${task.id || 'unknown'} - missing required properties`);
    }

    if (this.tasks.has(task.id)) {
      console.warn(`Task ${task.id} is being overwritten`);
    }

    this.tasks.set(task.id, task as Task);
    
    // Add to category index
    const categoryTasks = this.tasksByCategory.get(task.category);
    if (categoryTasks) {
      categoryTasks.add(task.id);
    }

    console.log(`📋 Registered task: ${task.id} (${task.category})`);
  }

  async executeTask<TInput, TOutput>(
    taskId: string,
    input: TInput,
    context: TaskContext
  ): Promise<TaskResult<TOutput>> {
    const task = this.tasks.get(taskId);
    
    if (!task) {
      return {
        success: false,
        error: `Task not found: ${taskId}`,
        metadata: { taskId, availableTasks: Array.from(this.tasks.keys()) }
      };
    }

    console.log(`🚀 Executing task: ${taskId}`, { input, context });

    try {
      // Validate input if validator exists
      if (task.validate && !task.validate(input)) {
        return {
          success: false,
          error: `Invalid input for task: ${taskId}`,
          metadata: { taskId, input }
        };
      }

      // Execute the task
      const startTime = Date.now();
      const result = await task.execute(input, context);
      const executionTime = Date.now() - startTime;

      console.log(`✅ Task completed: ${taskId} (${executionTime}ms)`, result);

      return {
        ...result,
        metadata: {
          ...result.metadata,
          taskId,
          executionTime,
          timestamp: context.timestamp
        }
      } as TaskResult<TOutput>;

    } catch (error) {
      console.error(`❌ Task failed: ${taskId}`, error);
      
      // Attempt rollback if available
      if (task.rollback) {
        try {
          await task.rollback(context);
          console.log(`🔄 Rollback completed for task: ${taskId}`);
        } catch (rollbackError) {
          console.error(`❌ Rollback failed for task: ${taskId}`, rollbackError);
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          taskId,
          originalError: error,
          timestamp: context.timestamp
        }
      };
    }
  }

  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  getTasks(category?: TaskCategory): Task[] {
    if (!category) {
      return Array.from(this.tasks.values());
    }

    const categoryTaskIds = this.tasksByCategory.get(category);
    if (!categoryTaskIds) {
      return [];
    }

    return Array.from(categoryTaskIds)
      .map(id => this.tasks.get(id))
      .filter((task): task is Task => task !== undefined);
  }

  createContext(partial?: Partial<TaskContext>): TaskContext {
    return {
      timestamp: Date.now(),
      ...partial
    };
  }

  // Additional utility methods
  getTaskStats() {
    const tasksByCategory: Record<string, number> = {};
    
    // Initialize all categories with 0
    Object.values(TaskCategory).forEach(category => {
      tasksByCategory[category] = 0;
    });
    
    // Count tasks by category
    this.tasksByCategory.forEach((taskIds, category) => {
      tasksByCategory[category] = taskIds.size;
    });
    
    return {
      totalTasks: this.tasks.size,
      tasksByCategory,
      taskIds: Array.from(this.tasks.keys())
    };
  }

  clearTasks(category?: TaskCategory): void {
    if (!category) {
      this.tasks.clear();
      this.tasksByCategory.forEach(set => set.clear());
      console.log('🧹 Cleared all tasks');
      return;
    }

    const categoryTasks = this.tasksByCategory.get(category);
    if (categoryTasks) {
      categoryTasks.forEach(taskId => this.tasks.delete(taskId));
      categoryTasks.clear();
      console.log(`🧹 Cleared tasks for category: ${category}`);
    }
  }
}

// Create and export singleton instance
export const taskManager = new AppTaskManager();