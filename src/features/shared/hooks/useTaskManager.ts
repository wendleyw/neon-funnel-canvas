import { useCallback, useEffect, useMemo, useState } from 'react';
import { taskManager } from '../tasks/task-manager';
import { TaskCategory, TaskContext, TaskResult, Task } from '../tasks';

// Register all tasks when the hook is first imported
import { componentManagementTasks } from '../tasks/component-management';
import { connectionManagementTasks } from '../tasks/connection-management';
import { canvasOperationTasks } from '../tasks/canvas-operations';
import { projectManagementTasks } from '../tasks/project-management';
import { workspaceManagementTasks } from '../tasks/workspace-management';
import { dataPersistenceTasks } from '../tasks/data-persistence';
import { uiInteractionTasks } from '../tasks/ui-interactions';
import { validationTasks } from '../tasks/validation';
import { exportImportTasks } from '../tasks/export-import';
import { realTimeTasks } from '../tasks/real-time';
import { youtubeManagementTasks } from '../tasks/youtube-management';

// Auto-register all tasks
const allTasks = [
  ...componentManagementTasks,
  ...connectionManagementTasks,
  ...canvasOperationTasks,
  ...projectManagementTasks,
  ...workspaceManagementTasks,
  ...dataPersistenceTasks,
  ...uiInteractionTasks,
  ...validationTasks,
  ...exportImportTasks,
  ...realTimeTasks,
  ...youtubeManagementTasks
];

// Register all tasks once
allTasks.forEach(task => {
  try {
    taskManager.registerTask(task as Task);
  } catch (error) {
    console.warn(`Failed to register task ${task.id}:`, error);
  }
});

export interface UseTaskManagerProps {
  userId?: string;
  workspaceId?: string;
  projectId?: string;
}

export interface UseTaskManagerReturn {
  executeTask: <TInput, TOutput>(
    taskId: string,
    input: TInput
  ) => Promise<TaskResult<TOutput>>;
  getTasksByCategory: (category: TaskCategory) => Array<{ id: string; name: string; description: string }>;
  getTaskStats: () => {
    totalTasks: number;
    tasksByCategory: Record<string, number>;
    taskIds: string[];
  };
  isExecuting: boolean;
  lastResult: TaskResult | null;
  context: TaskContext;
}

/**
 * Provides a hook for managing and executing tasks within a specific context.
 * This hook integrates with various services and contexts to provide a unified way
 * to handle operations like UI updates, API calls, and state modifications.
 * 
 * @param props - Context settings (user, workspace, project)
 * @returns Métodos e estado para executar tarefas
 * 
 * @example
 * ```tsx
 * const { executeTask, getTasksByCategory, isExecuting } = useTaskManager({
 *   userId: 'user-123',
 *   workspaceId: 'workspace-456',
 *   projectId: 'project-789'
 * });
 * 
 * // Executar uma tarefa
 * const handleCreateComponent = async () => {
 *   const result = await executeTask('component.create', {
 *     template: { type: 'landing-page', label: 'Landing Page' },
 *     position: { x: 100, y: 100 },
 *     workspaceId: 'workspace-456',
 *     projectId: 'project-789'
 *   });
 *   
 *   if (result.success) {
 *     console.log('Component created:', result.data);
 *   } else {
 *     console.error('Failed to create component:', result.error);
 *   }
 * };
 * ```
 */
export const useTaskManager = (props: UseTaskManagerProps = {}): UseTaskManagerReturn => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<TaskResult | null>(null);

  // Create context with props
  const context = useMemo(() => {
    return taskManager.createContext({
      userId: props.userId,
      workspaceId: props.workspaceId,
      projectId: props.projectId
    });
  }, [props.userId, props.workspaceId, props.projectId]);

  // Execute task function
  const executeTask = useCallback(async <TInput, TOutput>(
    taskId: string,
    input: TInput
  ): Promise<TaskResult<TOutput>> => {
    console.log(`🚀 [useTaskManager] Executing task: ${taskId}`, { input, context });
    
    setIsExecuting(true);
    
    try {
      const result = await taskManager.executeTask<TInput, TOutput>(taskId, input, context);
      
      setLastResult(result);
      
      // Log result for debugging
      if (result.success) {
        console.log(`✅ [useTaskManager] Task completed: ${taskId}`, result);
      } else {
        console.error(`❌ [useTaskManager] Task failed: ${taskId}`, result);
      }
      
      return result;
    } catch (error) {
      console.error(`💥 [useTaskManager] Task execution error: ${taskId}`, error);
      
      const errorResult: TaskResult<TOutput> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          taskId,
          executionError: true,
          timestamp: Date.now()
        }
      };
      
      setLastResult(errorResult);
      return errorResult;
    } finally {
      setIsExecuting(false);
    }
  }, [context]);

  // Get tasks by category
  const getTasksByCategory = useCallback((category: TaskCategory) => {
    return taskManager.getTasks(category).map(task => ({
      id: task.id,
      name: task.name,
      description: task.description
    }));
  }, []);

  // Get task statistics
  const getTaskStats = useCallback(() => {
    return taskManager.getTaskStats();
  }, []);

  // Log task manager stats on mount (helpful for debugging)
  useEffect(() => {
    const stats = taskManager.getTaskStats();
    console.log('📊 [useTaskManager] Task Manager initialized with stats:', stats);
  }, []);

  return {
    executeTask,
    getTasksByCategory,
    getTaskStats,
    isExecuting,
    lastResult,
    context
  };
}; 