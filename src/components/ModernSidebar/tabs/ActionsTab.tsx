import React from 'react';
import { ComponentTemplate } from '../../../types/funnel';
import { DrawingShape, DrawingTool } from '../../../types/drawing';
import { useIsMobile } from '../../../hooks/use-mobile';
import MARKETING_COMPONENT_TEMPLATES from '../../../data/componentTemplates';
import { Square, Circle, ArrowRight, Type, Minus, Diamond, Triangle, Star } from 'lucide-react';

interface ActionsTabProps {
  onDragStart: (template: ComponentTemplate) => void;
  onShapeAdd?: (shape: DrawingShape) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
}

export const ActionsTab: React.FC<ActionsTabProps> = ({
  onDragStart,
  onShapeAdd,
  onTemplateClick
}) => {
  const isMobile = useIsMobile();

  // Filter for action-related components
  const actionComponents = MARKETING_COMPONENT_TEMPLATES.filter(
    template => template.category === 'sales-conversion' || template.category === 'lead-capture'
  );

  // Simplified drawing tools
  const drawingTools = [
    { icon: Square, label: 'Rectangle', type: 'rectangle' as DrawingTool, color: '#6B7280' },
    { icon: Circle, label: 'Circle', type: 'circle' as DrawingTool, color: '#3B82F6' },
    { icon: ArrowRight, label: 'Arrow', type: 'arrow' as DrawingTool, color: '#10B981' },
    { icon: Diamond, label: 'Diamond', type: 'diamond' as DrawingTool, color: '#F59E0B' },
    { icon: Triangle, label: 'Triangle', type: 'triangle' as DrawingTool, color: '#8B5CF6' },
    { icon: Star, label: 'Star', type: 'star' as DrawingTool, color: '#EF4444' },
    { icon: Type, label: 'Text', type: 'text' as DrawingTool, color: '#6366F1' },
    { icon: Minus, label: 'Line', type: 'line' as DrawingTool, color: '#059669' },
  ];

  const handleDragStart = (e: React.DragEvent, template: ComponentTemplate) => {
    e.dataTransfer.setData('application/json', JSON.stringify(template));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(template);
  };

  const handleShapeAdd = (shapeType: DrawingTool) => {
    if (onShapeAdd) {
      const shape: DrawingShape = {
        id: `shape-${Date.now()}`,
        type: shapeType,
        position: { x: 100, y: 100 },
        size: { width: 100, height: 60 },
        style: {
          fill: 'transparent',
          stroke: '#3B82F6',
          strokeWidth: 2,
        },
        text: shapeType === 'text' ? 'Your text here' : undefined,
      };
      onShapeAdd(shape);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Action Components */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Action Components Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <span>⚡</span>
              Action Components
            </h3>
            <div className="space-y-2">
              {actionComponents.map((template) => (
                <div
                  key={template.type}
                  className="bg-gray-900 border border-gray-700 rounded-lg p-3 hover:border-gray-600 transition-all duration-200 cursor-pointer group"
                  draggable={!isMobile}
                  onDragStart={(e) => !isMobile && handleDragStart(e, template)}
                  onClick={() => onTemplateClick?.(template)}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                      style={{ 
                        backgroundColor: `${template.color}20`, 
                        color: template.color,
                        border: `1px solid ${template.color}40`
                      }}
                    >
                      {template.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-sm truncate">
                        {template.label}
                      </h4>
                      <p className="text-xs text-gray-400 truncate">
                        {template.description}
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">+</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drawing Tools Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <span>🎨</span>
              Drawing Tools
            </h3>
            <div className={`grid gap-2 ${isMobile ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {drawingTools.map((tool) => (
                <button
                  key={tool.type}
                  onClick={() => handleShapeAdd(tool.type)}
                  className="bg-gray-900 border border-gray-700 rounded-lg p-3 hover:border-gray-600 transition-all duration-200 group flex flex-col items-center gap-2"
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ 
                      backgroundColor: `${tool.color}20`, 
                      color: tool.color,
                      border: `1px solid ${tool.color}40`
                    }}
                  >
                    <tool.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-white font-medium transition-colors">
                    {tool.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 