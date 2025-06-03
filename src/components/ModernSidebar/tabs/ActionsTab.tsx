import React, { useState } from 'react';
import { ComponentTemplate } from '../../../types/funnel';
import { DrawingShape, DrawingTool } from '../../../types/drawing';
import { useIsMobile } from '../../../hooks/use-mobile';
import { actionSections, UserAction } from '../../../data/userActions';
import { UserActionItem } from '../components/UserActionItem';
import { Square, Circle, ArrowRight, Type, Minus, Diamond, Triangle, Star, ChevronDown, ChevronRight } from 'lucide-react';

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
  const [expandedSections, setExpandedSections] = useState<string[]>(['conversion']);

  const toggleSection = (sectionId: string) => {
    console.log('🔄 Toggle section:', sectionId);
    try {
      setExpandedSections(prev => {
        const newExpanded = prev.includes(sectionId) 
          ? prev.filter(id => id !== sectionId)
          : [...prev, sectionId];
        console.log('📝 New expanded sections:', newExpanded);
        return newExpanded;
      });
    } catch (error) {
      console.error('❌ Error toggling section:', error);
    }
  };

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

  const handleShapeAdd = (shapeType: DrawingTool) => {
    console.log('🎨 Adding shape:', shapeType);
    try {
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
        console.log('✅ Shape added successfully:', shape);
      }
    } catch (error) {
      console.error('❌ Error adding shape:', error);
    }
  };

  const handleActionClick = (action: UserAction) => {
    console.log('🎯 Action clicked:', action.type, action.label);
    try {
      if (onTemplateClick) {
        onTemplateClick(action);
        console.log('✅ Template click handled successfully');
      }
    } catch (error) {
      console.error('❌ Error handling action click:', error);
    }
  };

  const handleActionDragStart = (template: ComponentTemplate) => {
    console.log('🖱️ Action drag started:', template.type, template.label);
    try {
      onDragStart(template);
      console.log('✅ Drag start handled successfully');
    } catch (error) {
      console.error('❌ Error handling drag start:', error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* User Actions */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          
          {/* Header */}
          <div className="text-center pb-2">
            <h2 className="text-lg font-semibold text-white mb-1">User Actions</h2>
            <p className="text-xs text-gray-400">Ações que o usuário pode realizar</p>
          </div>

          {/* Action Sections */}
          {Object.entries(actionSections).map(([sectionId, section]) => {
            const isExpanded = expandedSections.includes(sectionId);
            
            return (
              <div key={sectionId} className="space-y-2">
                {/* Section Header */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleSection(sectionId);
                  }}
                  className="w-full flex items-center justify-between p-3 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg border border-gray-700/50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ 
                        backgroundColor: `${section.color}20`, 
                        color: section.color,
                        border: `1px solid ${section.color}40`
                      }}
                    >
                      {section.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                        {section.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-white transition-colors flex-shrink-0">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {/* Section Content */}
                {isExpanded && (
                  <div className="space-y-3 ml-2 border-l-2 border-gray-700/50 pl-4">
                    {section.actions.map((action) => (
                      <UserActionItem
                        key={action.type}
                        action={action}
                        onDragStart={handleActionDragStart}
                        onTemplateClick={handleActionClick}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Drawing Tools Section */}
          <div className="pt-4 border-t border-gray-700/50">
            <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <span>🎨</span>
              Drawing Tools
            </h3>
            <div className={`grid gap-2 ${isMobile ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {drawingTools.map((tool) => (
                <button
                  key={tool.type}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleShapeAdd(tool.type);
                  }}
                  className="bg-gray-900/60 border border-gray-700/60 rounded-lg p-3 hover:border-gray-600 hover:bg-gray-800/80 transition-all duration-200 group flex flex-col items-center gap-2 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  type="button"
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
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