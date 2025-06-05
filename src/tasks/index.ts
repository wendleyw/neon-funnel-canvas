/**
 * Task-based refactoring system
 * 
 * This module organizes the application functionality into discrete, manageable tasks
 * following the principles defined in the project rules.
 */

export interface TaskResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface TaskContext {
  userId?: string;
  workspaceId?: string;
  projectId?: string;
  timestamp: number;
}

export interface Task<TInput = unknown, TOutput = unknown> {
  id: string;
  name: string;
  description: string;
  category: TaskCategory;
  execute: (input: TInput, context: TaskContext) => Promise<TaskResult<TOutput>>;
  validate?: (input: TInput) => boolean;
  rollback?: (context: TaskContext) => Promise<void>;
}

export enum TaskCategory {
  COMPONENT_MANAGEMENT = 'component-management',
  CONNECTION_MANAGEMENT = 'connection-management',
  CANVAS_OPERATIONS = 'canvas-operations',
  PROJECT_MANAGEMENT = 'project-management',
  WORKSPACE_MANAGEMENT = 'workspace-management',
  DATA_PERSISTENCE = 'data-persistence',
  UI_INTERACTIONS = 'ui-interactions',
  VALIDATION = 'validation',
  EXPORT_IMPORT = 'export-import',
  REAL_TIME = 'real-time',
  YOUTUBE_MANAGEMENT = 'youtube-management'
}

export interface TaskManager {
  registerTask<TInput, TOutput>(task: Task<TInput, TOutput>): void;
  executeTask<TInput, TOutput>(
    taskId: string, 
    input: TInput, 
    context: TaskContext
  ): Promise<TaskResult<TOutput>>;
  getTask(taskId: string): Task | undefined;
  getTasks(category?: TaskCategory): Task[];
  createContext(partial?: Partial<TaskContext>): TaskContext;
}

// Export task categories for easier access
export * from './component-management';
export * from './connection-management';
export * from './canvas-operations';
export * from './project-management';
export * from './workspace-management';
export * from './data-persistence';
export * from './ui-interactions';
export * from './validation';
export * from './export-import';
export * from './real-time';
export * from './youtube-management';
export * from './task-manager'; 