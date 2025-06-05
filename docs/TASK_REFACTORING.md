# 🚀 Task-Based System Refactoring

## Overview

This document describes the complete refactoring of the funnel canvas system, organizing all functionality into **discrete and manageable tasks**. The refactoring follows the principles defined in the project rules and offers better maintainability, testability, and code reusability.

## 📋 Task System Structure

### Basic Architecture

```
src/tasks/
├── index.ts                 # Main types and TaskManager interface
├── task-manager.ts          # Task manager implementation
├── component-management.ts  # Component management tasks
├── connection-management.ts # Connection management tasks
├── canvas-operations.ts     # Canvas operation tasks
├── project-management.ts    # Project management tasks
├── workspace-management.ts  # Workspace management tasks
├── data-persistence.ts      # Data persistence tasks
├── ui-interactions.ts       # UI interaction tasks
├── validation.ts            # Validation tasks
├── export-import.ts         # Export/import tasks
└── real-time.ts             # Real-time tasks
```

### Main Types

```typescript
interface Task<TInput = unknown, TOutput = unknown> {
  id: string;
  name: string;
  description: string;
  category: TaskCategory;
  execute: (input: TInput, context: TaskContext) => Promise<TaskResult<TOutput>>;
  validate?: (input: TInput) => boolean;
  rollback?: (context: TaskContext) => Promise<void>;
}

interface TaskResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, unknown>;
}

interface TaskContext {
  userId?: string;
  workspaceId?: string;
  projectId?: string;
  timestamp: number;
}
```

## 🎯 Task Categories

### 1. Component Management
- **`component.create`** - Create new component
- **`component.update`** - Update existing component
- **`component.delete`** - Delete component
- **`component.duplicate`** - Duplicate component
- **`component.move`** - Move component on canvas

### 2. Connection Management
- **`connection.create`** - Create new connection
- **`connection.update`** - Update existing connection
- **`connection.delete`** - Delete connection
- **`connection.validate`** - Validate connection
- **`connection.recalculate-handles`** - Recalculate connection points

### 3. Canvas Operations
- **`canvas.zoom`** - Zoom on canvas
- **`canvas.pan`** - Pan on canvas
- **`canvas.fit-view`** - Fit view
- **`canvas.process-drag-drop`** - Process drag & drop
- **`canvas.center-on-node`** - Center on node
- **`canvas.highlight-node`** - Highlight node

### 4. UI Interactions
- **`ui.show-toast`** - Display toast notification

### 5. Project Management
- **`project.create`** - Create new project
- **`project.load`** - Load an existing project
- **`project.save`** - Save project
- **`project.delete`** - Delete the current project
- **`project.export`** - Export project data (e.g., to JSON, specific formats)

### 6. Real-Time
- **`realtime.broadcast`** - Broadcast real-time updates

## 🔧 How to Use the Task System

### React Hook

```typescript
import { useTaskManager } from '../hooks/useTaskManager';

const MyComponent = () => {
  const { executeTask, isExecuting, getTaskStats } = useTaskManager({
    userId: 'user-123',
    workspaceId: 'workspace-456',
    projectId: 'project-789'
  });

  const handleCreateComponent = async () => {
    const result = await executeTask('component.create', {
      template: { type: 'landing-page', label: 'Landing Page' },
      position: { x: 100, y: 100 },
      workspaceId: 'workspace-456',
      projectId: 'project-789'
    });
    
    if (result.success) {
      console.log('Component created:', result.data);
    } else {
      console.error('Failed:', result.error);
    }
  };

  return (
    <div>
      <button onClick={handleCreateComponent} disabled={isExecuting}>
        {isExecuting ? 'Executing...' : 'Create Component'}
      </button>
    </div>
  );
};
```

### Direct Execution

```typescript
import { taskManager } from '../tasks/task-manager';

// Create context
const context = taskManager.createContext({
  userId: 'user-123',
  workspaceId: 'workspace-456',
  projectId: 'project-789'
});

// Execute task
const result = await taskManager.executeTask('component.create', {
  template: { type: 'landing-page', label: 'Landing Page' },
  position: { x: 100, y: 100 },
  workspaceId: 'workspace-456',
  projectId: 'project-789'
}, context);
```

## ✨ Example: Refactored ReactFlowCanvas

The `TaskBasedReactFlowCanvas` demonstrates how to use the task system:

```typescript
// TASK-BASED: Handle drag and drop
const onDrop = useCallback(async (event: React.DragEvent) => {
  // 1. Process drag & drop
  const dropResult = await executeTask('canvas.process-drag-drop', {
    templateData,
    dropPosition: { x: event.clientX, y: event.clientY },
    viewportInfo: { zoom, x, y, bounds }
  });

  // 2. Create component
  const createResult = await executeTask('component.create', {
    template,
    position: dropResult.data.dropPosition,
    workspaceId,
    projectId
  });

  // 3. Center on component
  await executeTask('canvas.center-on-node', {
    nodeId: createResult.data.id,
    zoomLevel: 1.2
  });

  // 4. Show notification
  await executeTask('ui.show-toast', {
    type: 'success',
    message: '✅ Component added!'
  });

  // 5. Broadcast in real-time
  await executeTask('realtime.broadcast', {
    eventType: 'component-added',
    data: createResult.data,
    projectId
  });
}, [executeTask]);
```

## 🎯 Advantages of the Task System

### 1. **Separation of Responsibilities**
- Each task has a specific and well-defined responsibility
- Business logic separated from UI logic

### 2. **Testability**
- Each task can be tested independently
- Easy mocking for unit tests
- Input validation and rollback included

### 3. **Reusability**
- Tasks can be reused in different contexts
- Composition of complex tasks from simple tasks

### 4. **Traceability**
- Automatic logging of task execution
- Detailed metadata for debugging
- Operation history

### 5. **Rollback and Recovery**
- Rollback mechanism for failed operations
- Automatic recovery in case of error

### 6. **Strong Typing**
- TypeScript with specific types for input and output
- Compile-time type validation

## 🔍 Debugging and Monitoring

### Automatic Logs
The system automatically logs:
- Start and end of task execution
- Input parameters
- Results or errors
- Execution time
- Context metadata

### Statistics
```typescript
const stats = getTaskStats();
console.log('Total registered tasks:', stats.totalTasks);
console.log('Tasks by category:', stats.tasksByCategory);
console.log('Task IDs:', stats.taskIds);
```

### Visual Indicators
- Active task execution indicator
- Visual feedback for ongoing operations
- Automatic success/error notifications

## 🚀 Next Steps

### 1. **Full Integration**
- Migrate all components to use the task system
- Gradually remove legacy code

### 2. **Error Handling and Rollback Expansion**
- Implement more sophisticated rollback strategies
- Global error handling and reporting system

### 3. **Performance Optimization**
- Optimize execution of critical tasks
- Batch processing for multiple operations

### 4. **Advanced Features**
- Task queue with prioritization
- Undo/Redo functionality based on tasks
- User-defined task macros

The task system offers a robust, scalable, and maintainable architecture for the funnel canvas project. It promotes good development practices, facilitates testing and debugging, and provides a solid foundation for future expansions. 