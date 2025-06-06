/**
 * Component Renderers Index
 * 
 * Following the modularity principle from custom-rules.md,
 * this file provides a clean entry point for all specialized renderers.
 */

export { SourceComponentRenderer } from './SourceComponentRenderer';
export { PageComponentRenderer } from './PageComponentRenderer';
export { ActionComponentRenderer } from './ActionComponentRenderer';

// Utility exports
export { 
  getComponentStatusInfo, 
  getSelectionClasses, 
  getConnectionHandleClasses, 
  splitTextIntoLines, 
  detectComponentType 
} from './shared/ComponentRendererUtils';

// Type exports
export type { StatusInfo } from './shared/ComponentRendererUtils'; 