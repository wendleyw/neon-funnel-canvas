import { FunnelComponent, FunnelProject } from '../types/funnel';
import { DrawingShape, DrawingTool } from '../types/drawing';

export interface AddToCanvasOptions {
  position?: { x: number; y: number };
  debugMode?: boolean;
}

export class CanvasAddService {
  private static instance: CanvasAddService;
  private debugMode: boolean = true;

  static getInstance(): CanvasAddService {
    if (!CanvasAddService.instance) {
      CanvasAddService.instance = new CanvasAddService();
    }
    return CanvasAddService.instance;
  }

  private log(message: string, data?: any) {
    if (this.debugMode) {
      console.log(`🎨 [CanvasAddService] ${message}`, data || '');
    }
  }

  // Generate unique ID
  private generateId(): string {
    return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Add component template to canvas using projectHandlers for consistency
  addComponentTemplate(
    template: any,
    onComponentAdd: (component: FunnelComponent) => void,
    options: AddToCanvasOptions = {}
  ): boolean {
    this.log('Adding component template via projectHandlers', { template, options });

    try {
      const position = options.position || { x: 400, y: 300 };
      
      const newComponent: FunnelComponent = {
        id: this.generateId(),
        type: template.type,
        position,
        data: {
          title: template.label || template.defaultProps?.title || 'New Component',
          description: template.description || template.defaultProps?.description || '',
          status: 'active' as const,
          properties: {
            ...template.defaultProps?.properties,
            addedVia: 'componentTemplate',
            addedAt: new Date().toISOString()
          }
        },
        connections: []
      };

      this.log('Created component', newComponent);
      
      // Use projectHandlers for consistent state management
      onComponentAdd(newComponent);

      this.log('✅ Component template added via projectHandlers');
      return true;
    } catch (error) {
      this.log('❌ Error adding component template', error);
      return false;
    }
  }

  // FIXED: Preserve diagram types instead of converting to different component types
  private getSimpleComponentType(shapeType: DrawingTool): FunnelComponent['type'] {
    // PRESERVE original diagram types when possible
    switch (shapeType) {
      case 'rectangle':
        return 'frame'; // Rectangle becomes frame (visual container)
      case 'circle':
        return 'note'; // Circle becomes note (but we'll enhance the styling)
      case 'diamond':
        return 'custom'; // Diamond becomes custom shape
      case 'arrow':
        return 'arrow'; // Arrow stays as arrow ✅
      case 'funnel':
        return 'conversion'; // Funnel becomes conversion ✅
      case 'text':
        return 'note'; // Text becomes note
      case 'line':
        return 'custom'; // Line becomes custom
      case 'hexagon':
        return 'custom'; // Hexagon becomes custom
      case 'star':
        return 'custom'; // Star becomes custom
      case 'connector':
        return 'arrow'; // Connector becomes arrow
      default:
        return 'note'; // Safe fallback
    }
  }

  // Enhanced component creation that preserves diagram identity
  private createDiagramComponent(shape: DrawingShape): FunnelComponent {
    const componentType = this.getSimpleComponentType(shape.type);
    
    return {
      id: shape.id || this.generateId(),
      type: componentType,
      position: shape.position,
      data: {
        title: shape.text || this.getShapeTitle(shape.type),
        description: `${shape.type} diagram converted to ${componentType} component`,
        status: 'active' as const,
        properties: {
          // CRITICAL: Preserve original diagram identity
          isDiagramShape: true,
          originalDiagramType: shape.type, // ← This preserves the original type!
          diagramData: {
            shapeType: shape.type,
            originalStyle: shape.style,
            originalTextStyle: shape.textStyle,
            originalSize: shape.size
          },
          
          // Enhanced visual properties based on diagram type
          width: shape.size?.width || this.getDefaultWidth(shape.type),
          height: shape.size?.height || this.getDefaultHeight(shape.type),
          backgroundColor: shape.style?.fill || this.getDefaultBackground(shape.type),
          borderColor: shape.style?.stroke || '#374151',
          borderWidth: shape.style?.strokeWidth || 2,
          borderRadius: this.getBorderRadius(shape.type),
          
          // Diagram-specific styling
          visualVariant: this.getDiagramVisualVariant(shape.type),
          shapeRenderer: this.getShapeRenderer(shape.type),
          
          // Text styling
          textColor: '#FFFFFF',
          fontSize: 14,
          fontWeight: '600',
          textAlign: 'center',
          
          // Shape-specific properties
          ...this.getShapeSpecificProps(shape),
          
          // Metadata
          addedVia: 'diagramShape',
          addedAt: new Date().toISOString(),
          componentVariant: this.getComponentVariant(shape.type)
        }
      },
      connections: []
    };
  }

  // Add diagram shape using the enhanced creation method
  addDiagramShape(
    shape: DrawingShape,
    onComponentAdd: (component: FunnelComponent) => void,
    options: AddToCanvasOptions = {}
  ): boolean {
    this.log('Adding diagram shape via enhanced creation', { shape, options });

    try {
      const position = options.position || shape.position || { x: 400, y: 300 };
      
      // Use enhanced creation method
      const newComponent = this.createDiagramComponent({
        ...shape,
        position
      });

      this.log('Created enhanced diagram component', {
        id: newComponent.id,
        type: newComponent.type,
        originalDiagramType: newComponent.data.properties.originalDiagramType,
        title: newComponent.data.title,
        visualProps: {
          width: newComponent.data.properties.width,
          height: newComponent.data.properties.height,
          backgroundColor: newComponent.data.properties.backgroundColor,
          visualVariant: newComponent.data.properties.visualVariant
        }
      });
      
      // Use projectHandlers for consistent state management
      onComponentAdd(newComponent);

      this.log('✅ Enhanced diagram shape added with preserved identity');
      return true;
    } catch (error) {
      this.log('❌ Error adding diagram shape', error);
      return false;
    }
  }

  // Test method using projectHandlers for consistency
  addTestComponent(
    onComponentAdd: (component: FunnelComponent) => void,
    options: AddToCanvasOptions = {}
  ): boolean {
    this.log('Adding test component via projectHandlers');

    const testComponent: FunnelComponent = {
      id: this.generateId(),
      type: 'note',
      position: options.position || { x: 200, y: 200 },
      data: {
        title: 'Test Component',
        description: 'This is a test component to verify the add system works',
        status: 'active' as const,
        properties: {
          isTestComponent: true,
          addedAt: new Date().toISOString()
        }
      },
      connections: []
    };

    try {
      // Use projectHandlers for consistent state management
      onComponentAdd(testComponent);
      
      this.log('✅ Test component added via projectHandlers');
      return true;
    } catch (error) {
      this.log('❌ Error adding test component', error);
      return false;
    }
  }

  private getShapeTitle(shapeType: DrawingTool): string {
    switch (shapeType) {
      case 'rectangle': return 'Process Frame';
      case 'circle': return 'Start/End Point';
      case 'diamond': return 'Decision Gate';
      case 'arrow': return 'Flow Arrow';
      case 'funnel': return 'Conversion Stage';
      case 'text': return 'Text Note';
      case 'line': return 'Connection Line';
      default: return 'Shape Element';
    }
  }

  // Enable/disable debug mode
  setDebugMode(enabled: boolean) {
    this.debugMode = enabled;
    this.log(`Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Helper methods for enhanced styling
  private getDefaultWidth(shapeType: DrawingTool): number {
    switch (shapeType) {
      case 'circle': return 80;
      case 'funnel': return 120;
      case 'arrow': return 100;
      case 'line': return 150;
      case 'text': return 120;
      default: return 140;
    }
  }

  private getDefaultHeight(shapeType: DrawingTool): number {
    switch (shapeType) {
      case 'circle': return 80;
      case 'funnel': return 100;
      case 'arrow': return 40;
      case 'line': return 6;
      case 'text': return 40;
      default: return 80;
    }
  }

  private getDefaultBackground(shapeType: DrawingTool): string {
    switch (shapeType) {
      case 'rectangle': return '#3B82F6'; // Blue for frames
      case 'circle': return '#10B981'; // Green for notes
      case 'diamond': return '#F59E0B'; // Orange for landing pages
      case 'arrow': return '#8B5CF6'; // Purple for arrows
      case 'funnel': return '#EF4444'; // Red for conversions
      case 'text': return '#6B7280'; // Gray for text
      case 'line': return '#374151'; // Dark gray for lines
      default: return '#6366F1';
    }
  }

  private getBorderRadius(shapeType: DrawingTool): number {
    switch (shapeType) {
      case 'circle': return 50; // Fully rounded
      case 'funnel': return 12; // Rounded corners
      case 'diamond': return 8; // Slightly rounded
      default: return 6; // Standard rounded
    }
  }

  private getShapeSpecificProps(shape: DrawingShape): Record<string, any> {
    switch (shape.type) {
      case 'arrow':
        return {
          arrowDirection: 'right',
          arrowStyle: 'solid',
          arrowSize: 'medium'
        };
      case 'funnel':
        return {
          funnelStages: ['top', 'middle', 'bottom'],
          conversionRate: 0.25,
          gradient: true
        };
      case 'line':
        return {
          lineStyle: 'solid',
          lineThickness: shape.style?.strokeWidth || 2,
          isConnector: true
        };
      default:
        return {};
    }
  }

  private getComponentVariant(shapeType: DrawingTool): string {
    switch (shapeType) {
      case 'rectangle': return 'process-frame';
      case 'circle': return 'start-end-point';
      case 'diamond': return 'decision-gate';
      case 'arrow': return 'flow-arrow';
      case 'funnel': return 'conversion-stage';
      case 'text': return 'text-note';
      case 'line': return 'connection-line';
      default: return 'diagram-element';
    }
  }

  // New helper methods for enhanced diagram support
  private getDiagramVisualVariant(shapeType: DrawingTool): string {
    switch (shapeType) {
      case 'rectangle': return 'diagram-rectangle';
      case 'circle': return 'diagram-circle';
      case 'diamond': return 'diagram-diamond';
      case 'arrow': return 'diagram-arrow';
      case 'funnel': return 'diagram-funnel';
      case 'text': return 'diagram-text';
      case 'line': return 'diagram-line';
      case 'hexagon': return 'diagram-hexagon';
      case 'star': return 'diagram-star';
      case 'connector': return 'diagram-connector';
      default: return 'diagram-generic';
    }
  }

  private getShapeRenderer(shapeType: DrawingTool): string {
    switch (shapeType) {
      case 'circle': return 'circle-renderer';
      case 'diamond': return 'diamond-renderer';
      case 'hexagon': return 'hexagon-renderer';
      case 'star': return 'star-renderer';
      case 'arrow': return 'arrow-renderer';
      case 'line': return 'line-renderer';
      default: return 'rectangle-renderer';
    }
  }
}

export const canvasAddService = CanvasAddService.getInstance(); 