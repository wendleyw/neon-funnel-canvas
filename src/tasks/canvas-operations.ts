import { Task, TaskCategory, TaskContext, TaskResult } from './index';

// Types for canvas operations
export interface ZoomCanvasInput {
  zoomLevel: number;
  centerPoint?: { x: number; y: number };
  duration?: number;
}

export interface PanCanvasInput {
  deltaX: number;
  deltaY: number;
  duration?: number;
}

export interface FitViewInput {
  nodeIds?: string[];
  padding?: number;
  duration?: number;
  maxZoom?: number;
  minZoom?: number;
}

export interface DragDropInput {
  templateData: string;
  dropPosition: { x: number; y: number };
  viewportInfo: {
    zoom: number;
    x: number;
    y: number;
    bounds: DOMRect;
  };
}

export interface CenterOnNodeInput {
  nodeId: string;
  zoomLevel?: number;
  duration?: number;
}

export interface HighlightNodeInput {
  nodeId: string;
  duration?: number;
  highlightColor?: string;
}

// Canvas Operations Tasks
export const zoomCanvasTask: Task<ZoomCanvasInput, { newZoomLevel: number; centerPoint?: { x: number; y: number } }> = {
  id: 'canvas.zoom',
  name: 'Zoom Canvas',
  description: 'Zooms the canvas to a specific level',
  category: TaskCategory.CANVAS_OPERATIONS,
  
  validate: (input) => {
    return !!(input.zoomLevel >= 0.1 && input.zoomLevel <= 3);
  },

  execute: async (input, context): Promise<TaskResult<{ newZoomLevel: number; centerPoint?: { x: number; y: number } }>> => {
    try {
      return {
        success: true,
        data: {
          newZoomLevel: input.zoomLevel,
          centerPoint: input.centerPoint
        },
        metadata: {
          previousZoom: 1, // This would come from current state
          duration: input.duration || 300,
          centerPoint: input.centerPoint,
          timestamp: context.timestamp
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to zoom canvas: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

export const panCanvasTask: Task<PanCanvasInput, { newPosition: { x: number; y: number } }> = {
  id: 'canvas.pan',
  name: 'Pan Canvas',
  description: 'Pans the canvas by specified delta values',
  category: TaskCategory.CANVAS_OPERATIONS,
  
  validate: (input) => {
    return !!(typeof input.deltaX === 'number' && typeof input.deltaY === 'number');
  },

  execute: async (input, context): Promise<TaskResult<{ newPosition: { x: number; y: number } }>> => {
    try {
      // In a real implementation, this would get current position and add deltas
      const newPosition = {
        x: 0 + input.deltaX, // Would be currentPosition.x + deltaX
        y: 0 + input.deltaY  // Would be currentPosition.y + deltaY
      };

      return {
        success: true,
        data: { newPosition },
        metadata: {
          deltaX: input.deltaX,
          deltaY: input.deltaY,
          duration: input.duration || 300,
          timestamp: context.timestamp
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to pan canvas: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

export const fitViewTask: Task<FitViewInput, { viewport: { x: number; y: number; zoom: number } }> = {
  id: 'canvas.fit-view',
  name: 'Fit View',
  description: 'Fits the view to show all or specific nodes',
  category: TaskCategory.CANVAS_OPERATIONS,
  
  validate: (input) => {
    return true; // All inputs are optional with defaults
  },

  execute: async (input, context): Promise<TaskResult<{ viewport: { x: number; y: number; zoom: number } }>> => {
    try {
      // In a real implementation, this would calculate optimal viewport based on node positions
      const calculatedViewport = {
        x: 0,
        y: 0,
        zoom: input.maxZoom || 1.5
      };

      return {
        success: true,
        data: { viewport: calculatedViewport },
        metadata: {
          nodeIds: input.nodeIds,
          padding: input.padding || 0.1,
          duration: input.duration || 800,
          maxZoom: input.maxZoom || 1.5,
          minZoom: input.minZoom || 0.1,
          timestamp: context.timestamp
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fit view: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

export const processDragDropTask: Task<DragDropInput, { dropPosition: { x: number; y: number }; shouldCreateComponent: boolean }> = {
  id: 'canvas.process-drag-drop',
  name: 'Process Drag and Drop',
  description: 'Processes drag and drop operations and calculates drop position',
  category: TaskCategory.CANVAS_OPERATIONS,
  
  validate: (input) => {
    return !!(input.templateData && input.dropPosition && input.viewportInfo);
  },

  execute: async (input, context): Promise<TaskResult<{ dropPosition: { x: number; y: number }; shouldCreateComponent: boolean }>> => {
    try {
      // Calculate actual canvas position from screen coordinates
      const viewport = input.viewportInfo;
      
      // Convert screen coordinates to canvas coordinates
      const canvasX = (input.dropPosition.x - viewport.bounds.left - viewport.x) / viewport.zoom;
      const canvasY = (input.dropPosition.y - viewport.bounds.top - viewport.y) / viewport.zoom;
      
      // Add some randomization to avoid overlapping
      const randomOffset = () => (Math.random() - 0.5) * 50;
      
      const finalPosition = {
        x: canvasX + randomOffset(),
        y: canvasY + randomOffset()
      };

      // Validate that we have valid template data
      let templateValid = false;
      try {
        const parsed = JSON.parse(input.templateData);
        templateValid = !!(parsed.type && parsed.label);
      } catch {
        templateValid = false;
      }

      return {
        success: true,
        data: {
          dropPosition: finalPosition,
          shouldCreateComponent: templateValid
        },
        metadata: {
          originalPosition: input.dropPosition,
          viewportInfo: input.viewportInfo,
          calculatedPosition: finalPosition,
          templateValid,
          timestamp: context.timestamp
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to process drag and drop: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

export const centerOnNodeTask: Task<CenterOnNodeInput, { centeredNodeId: string; viewport: { x: number; y: number; zoom: number } }> = {
  id: 'canvas.center-on-node',
  name: 'Center on Node',
  description: 'Centers the canvas view on a specific node',
  category: TaskCategory.CANVAS_OPERATIONS,
  
  validate: (input) => {
    return !!input.nodeId;
  },

  execute: async (input, context): Promise<TaskResult<{ centeredNodeId: string; viewport: { x: number; y: number; zoom: number } }>> => {
    try {
      // In a real implementation, this would get the node position and calculate center
      const viewport = {
        x: 0, // Would be calculated based on node position
        y: 0, // Would be calculated based on node position
        zoom: input.zoomLevel || 1.2
      };

      return {
        success: true,
        data: {
          centeredNodeId: input.nodeId,
          viewport
        },
        metadata: {
          nodeId: input.nodeId,
          zoomLevel: input.zoomLevel || 1.2,
          duration: input.duration || 800,
          timestamp: context.timestamp
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to center on node: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

export const highlightNodeTask: Task<HighlightNodeInput, { highlightedNodeId: string; duration: number }> = {
  id: 'canvas.highlight-node',
  name: 'Highlight Node',
  description: 'Temporarily highlights a node for visual feedback',
  category: TaskCategory.CANVAS_OPERATIONS,
  
  validate: (input) => {
    return !!input.nodeId;
  },

  execute: async (input, context): Promise<TaskResult<{ highlightedNodeId: string; duration: number }>> => {
    try {
      const duration = input.duration || 3000;

      return {
        success: true,
        data: {
          highlightedNodeId: input.nodeId,
          duration
        },
        metadata: {
          nodeId: input.nodeId,
          highlightColor: input.highlightColor || '#EF4444',
          duration,
          timestamp: context.timestamp
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to highlight node: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};

// Export all canvas operation tasks
export const canvasOperationTasks = [
  zoomCanvasTask,
  panCanvasTask,
  fitViewTask,
  processDragDropTask,
  centerOnNodeTask,
  highlightNodeTask
]; 