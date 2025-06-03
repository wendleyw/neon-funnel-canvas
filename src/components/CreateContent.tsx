import React, { useState } from 'react';
import { componentTemplates } from '../data/componentTemplates';
import { ComponentTemplate, FunnelComponent } from '../types/funnel';
import { DrawingTool, DrawingShape } from '../types/drawing';
// ... existing code ...

interface CreateContentProps {
  onDragStart: (template: ComponentTemplate) => void;
  onAddCompleteTemplate: (template: ComponentTemplate) => void;
  onShapeAdd: (shape: DrawingShape) => void;
}

export const CreateContent: React.FC<CreateContentProps> = ({
  onDragStart,
  onAddCompleteTemplate,
  onShapeAdd
}) => {
  const [activeTab, setActiveTab] = useState<'components' | 'diagrams'>('components');

  // Simplified component addition
  const handleAddToCanvas = (template: ComponentTemplate) => {
    console.log('[CreateContent] Adding component to canvas:', template.label);
    onAddCompleteTemplate(template);
  };

  // Simplified shape creation and addition
  const handleShapeSelect = (shapeType: DrawingTool) => {
    console.log('[CreateContent] Creating shape:', shapeType);
    
    // Create a simple shape with default properties
    const newShape: DrawingShape = {
      id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: shapeType,
      position: { x: 300, y: 200 },
      size: getDefaultSize(shapeType),
      style: getDefaultStyle(shapeType),
      text: getDefaultText(shapeType)
    };

    console.log('[CreateContent] Calling onShapeAdd with shape:', newShape);
    onShapeAdd(newShape);
  };

  // Helper functions for default shape properties
  const getDefaultSize = (type: DrawingTool) => {
    switch (type) {
      case 'circle': return { width: 80, height: 80 };
      case 'funnel': return { width: 100, height: 120 };
      case 'arrow': return { width: 100, height: 40 };
      case 'text': return { width: 120, height: 30 };
      case 'line': return { width: 100, height: 2 };
      default: return { width: 100, height: 60 };
    }
  };

  const getDefaultStyle = (type: DrawingTool) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    return {
      fill: type === 'line' ? 'transparent' : randomColor,
      stroke: type === 'line' ? randomColor : '#374151',
      strokeWidth: 2
    };
  };

  const getDefaultText = (type: DrawingTool): string => {
    switch (type) {
      case 'rectangle': return 'Process';
      case 'circle': return 'Start';
      case 'diamond': return 'Decision';
      case 'funnel': return 'Funnel';
      case 'arrow': return 'Flow';
      case 'text': return 'Text Note';
      default: return '';
    }
  };

  const shapeCategories = [
    {
      name: 'Basic Shapes',
      shapes: [
        { type: 'rectangle' as DrawingTool, icon: '⬛', label: 'Rectangle' },
        { type: 'circle' as DrawingTool, icon: '⭕', label: 'Circle' },
        { type: 'diamond' as DrawingTool, icon: '🔶', label: 'Diamond' },
      ]
    },
    {
      name: 'Flow Elements',
      shapes: [
        { type: 'arrow' as DrawingTool, icon: '➡️', label: 'Arrow' },
        { type: 'funnel' as DrawingTool, icon: '📊', label: 'Funnel' },
        { type: 'line' as DrawingTool, icon: '➖', label: 'Line' },
      ]
    },
    {
      name: 'Text & Notes',
      shapes: [
        { type: 'text' as DrawingTool, icon: '📝', label: 'Text' },
      ]
    }
  ];

  // Test button for drag & drop positioning
  const testDragDropPosition = () => {
    const testTemplate: ComponentTemplate = {
      id: 'test-drag-drop',
      type: 'landing-page',
      icon: '🎯',
      label: 'TEST DRAG DROP',
      color: '#8B5CF6',
      category: 'pages',
      description: 'Testing drag drop positioning',
      defaultProps: {
        title: 'TEST DRAG DROP',
        description: 'Testing drag drop positioning',
        image: '',
        url: '',
        status: 'draft',
        properties: {}
      }
    };
    
    console.log('[CreateContent] Testing drag drop position at center');
    handleAddToCanvas(testTemplate);
  };

  // Test button for animated connection
  const testAnimatedConnection = () => {
    console.log('[CreateContent] Testing animated neon connection');
    
    // Add two components first
    const component1: ComponentTemplate = {
      id: 'test-source',
      type: 'landing-page',
      icon: '🎯',
      label: 'Source Component',
      color: '#3B82F6',
      category: 'pages',
      description: 'Source for neon connection',
      defaultProps: {
        title: 'Source Component',
        description: 'Starting point for lead flow',
        status: 'draft',
        properties: {}
      }
    };
    
    const component2: ComponentTemplate = {
      id: 'test-target',
      type: 'conversion',
      icon: '💰',
      label: 'Target Component',
      color: '#10B981',
      category: 'conversion',
      description: 'Target for neon connection',
      defaultProps: {
        title: 'Target Component',
        description: 'End point for lead flow',
        status: 'draft',
        properties: {}
      }
    };
    
    // Add both components with specific positions
    handleAddToCanvas(component1);
    setTimeout(() => handleAddToCanvas(component2), 100);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('components')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'components'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Components
        </button>
        <button
          onClick={() => setActiveTab('diagrams')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'diagrams'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Diagrams
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'components' && (
          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">📦 Component Templates</h3>
              
              {/* Quick Test Buttons */}
              <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                <h4 className="text-sm font-medium text-gray-300 mb-2">🧪 Quick Test</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => handleAddToCanvas({
                      id: 'test-note',
                      type: 'note',
                      icon: '📝',
                      label: 'Test Note',
                      color: '#3B82F6',
                      category: 'basic',
                      description: 'Test note component',
                      defaultProps: {
                        title: 'Test Note',
                        description: 'This is a test note',
                        status: 'active' as const,
                        properties: {}
                      }
                    })}
                    className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    ➕ Add Test Note
                  </button>
                  <button
                    onClick={() => handleAddToCanvas({
                      id: 'test-frame',
                      type: 'frame',
                      icon: '🔲',
                      label: 'Test Frame',
                      color: '#10B981',
                      category: 'basic',
                      description: 'Test frame component',
                      defaultProps: {
                        title: 'Test Frame',
                        description: 'This is a test frame',
                        status: 'active' as const,
                        properties: {}
                      }
                    })}
                    className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    ➕ Add Test Frame
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {componentTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer border border-gray-700"
                    onClick={() => handleAddToCanvas(template)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">{template.label}</h4>
                        <p className="text-gray-400 text-sm">{template.description}</p>
                      </div>
                      <button 
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCanvas(template);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'diagrams' && (
          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">📊 Diagram Shapes</h3>
              
              {/* Quick Test Shape */}
              <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                <h4 className="text-sm font-medium text-gray-300 mb-2">🧪 Quick Test</h4>
                <button
                  onClick={() => handleShapeSelect('rectangle')}
                  className="w-full px-3 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                >
                  ➕ Add Test Rectangle
                </button>
              </div>

              {/* Drag & Drop Position Test */}
              <button
                onClick={testDragDropPosition}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
              >
                Test Drag Position
              </button>

              {/* Animated Connection Test */}
              <button
                onClick={testAnimatedConnection}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded transition-colors"
              >
                Test Neon Connection
              </button>

              {shapeCategories.map((category) => (
                <div key={category.name} className="mb-6">
                  <h4 className="text-white font-medium mb-3">{category.name}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {category.shapes.map((shape) => (
                      <button
                        key={shape.type}
                        onClick={() => handleShapeSelect(shape.type)}
                        className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-white text-center border border-gray-700"
                      >
                        <div className="text-2xl mb-1">{shape.icon}</div>
                        <div className="text-xs">{shape.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 