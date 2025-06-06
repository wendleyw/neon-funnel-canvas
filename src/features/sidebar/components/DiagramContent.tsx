import React, { useState, useCallback } from 'react';
import { DrawingTool, DrawingShape } from '../../../types/drawing';
import { marketingFunnelTemplates } from '../../../data/funnelTemplates';
import { Button } from '@/features/shared/ui/button';
import { Input } from '@/features/shared/ui/input';
import { Badge } from '@/features/shared/ui/badge';
import { ScrollArea } from '@/features/shared/ui/scroll-area';
import { 
  Search,
  Square, 
  Circle, 
  Diamond, 
  Hexagon, 
  Star,
  Triangle,
  ArrowRight,
  Minus,
  Type,
  Zap,
  Plus,
  ChevronRight,
  Palette,
  Layout
} from 'lucide-react';

interface ShapeCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  items: ShapeItem[];
}

interface ShapeItem {
  id: string;
  type: DrawingTool;
  icon: React.ComponentType<any>;
  name: string;
  description: string;
}

const shapeCategories: ShapeCategory[] = [
  {
    id: 'basic',
    name: 'Basic Shapes',
    icon: Square,
    items: [
      { id: 'rectangle', type: 'rectangle', icon: Square, name: 'Rectangle', description: 'Basic rectangle shape' },
      { id: 'circle', type: 'circle', icon: Circle, name: 'Circle', description: 'Basic circle shape' },
      { id: 'diamond', type: 'diamond', icon: Diamond, name: 'Diamond', description: 'Decision diamond' },
      { id: 'triangle', type: 'diamond', icon: Triangle, name: 'Triangle', description: 'Triangle shape' },
      { id: 'hexagon', type: 'hexagon', icon: Hexagon, name: 'Hexagon', description: 'Hexagon shape' },
      { id: 'star', type: 'star', icon: Star, name: 'Star', description: 'Star shape' }
    ]
  },
  {
    id: 'flowchart',
    name: 'Flowchart',
    icon: Layout,
    items: [
      { id: 'process', type: 'rectangle', icon: Square, name: 'Process', description: 'Process box' },
      { id: 'decision', type: 'diamond', icon: Diamond, name: 'Decision', description: 'Decision diamond' },
      { id: 'terminator', type: 'circle', icon: Circle, name: 'Start/End', description: 'Terminator shape' }
    ]
  },
  {
    id: 'arrows',
    name: 'Arrows & Lines',
    icon: ArrowRight,
    items: [
      { id: 'arrow', type: 'arrow', icon: ArrowRight, name: 'Arrow', description: 'Directional arrow' },
      { id: 'line', type: 'line', icon: Minus, name: 'Line', description: 'Simple line' }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: Zap,
    items: [
      { id: 'funnel', type: 'funnel', icon: Zap, name: 'Funnel', description: 'Marketing funnel shape' },
      { id: 'text', type: 'text', icon: Type, name: 'Text', description: 'Text element' }
    ]
  }
];

interface DiagramContentProps {
  onShapeAdd?: (shape: DrawingShape) => void;
}

export const DiagramContent: React.FC<DiagramContentProps> = ({ onShapeAdd }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string>('basic');
  const [isDragModalOpen, setIsDragModalOpen] = useState(false);
  const [draggedShape, setDraggedShape] = useState<ShapeItem | null>(null);

  // Filter categories based on search
  const filteredCategories = shapeCategories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  // Handle shape drag start
  const handleShapeDragStart = useCallback((shape: ShapeItem, e: React.MouseEvent) => {
    setDraggedShape(shape);
    setIsDragModalOpen(true);
    e.preventDefault();
  }, []);

  // Handle adding shape to canvas
  const handleAddToCanvas = useCallback((shape: ShapeItem) => {
    if (!onShapeAdd) return;

    const newShape: DrawingShape = {
      id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: shape.type,
      position: { x: 400, y: 300 }, // Center of canvas
      size: getDefaultSize(shape.type),
      style: getDefaultStyle(shape.type),
      text: getDefaultText(shape.type),
      textStyle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
        align: 'center',
        verticalAlign: 'middle'
      }
    };

    onShapeAdd(newShape);
  }, [onShapeAdd]);

  // Get default size for shape type
  const getDefaultSize = (type: DrawingTool) => {
    switch (type) {
      case 'circle':
        return { width: 80, height: 80 };
      case 'line':
        return { width: 100, height: 2 };
      case 'text':
        return { width: 80, height: 24 };
      default:
        return { width: 100, height: 60 };
    }
  };

  // Get default style
  const getDefaultStyle = (type: DrawingTool) => {
    const baseStyle = {
      strokeWidth: 1.5,
      opacity: 1
    };

    switch (type) {
      case 'rectangle':
        return {
          ...baseStyle,
          fill: '#FFFFFF',
          stroke: '#374151',
          borderRadius: 4
        };
      case 'circle':
        return {
          ...baseStyle,
          fill: '#FFFFFF',
          stroke: '#374151'
        };
      case 'diamond':
        return {
          ...baseStyle,
          fill: '#FFFFFF',
          stroke: '#374151'
        };
      case 'funnel':
        return {
          ...baseStyle,
          fill: '#F3F4F6',
          stroke: '#6B7280'
        };
      case 'arrow':
        return {
          ...baseStyle,
          fill: '#374151',
          stroke: '#374151'
        };
      case 'line':
        return {
          ...baseStyle,
          stroke: '#374151',
          strokeWidth: 2
        };
      case 'text':
        return {
          ...baseStyle,
          fill: 'transparent',
          stroke: 'transparent'
        };
      default:
        return {
          ...baseStyle,
          fill: '#FFFFFF',
          stroke: '#374151'
        };
    }
  };

  // Get default text
  const getDefaultText = (type: DrawingTool): string => {
    switch (type) {
      case 'rectangle':
        return 'Process';
      case 'circle':
        return 'Start';
      case 'diamond':
        return 'Decision';
      case 'funnel':
        return 'Funnel';
      case 'text':
        return 'Text';
      default:
        return '';
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search diagram elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          
          {/* Quick Info */}
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="h-4 w-4 text-purple-400" />
              <span className="text-purple-200 text-sm font-medium">Diagram Elements</span>
            </div>
            <p className="text-gray-400 text-xs">
              Drag shapes from here to the canvas or click to add directly
            </p>
          </div>

          {/* Shape Categories */}
          {filteredCategories.map((category) => {
            const CategoryIcon = category.icon;
            const isExpanded = expandedCategory === category.id;
            
            return (
              <div key={category.id} className="space-y-2">
                <button
                  onClick={() => setExpandedCategory(isExpanded ? '' : category.id)}
                  className="w-full flex items-center justify-between p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors border border-gray-700/50"
                >
                  <div className="flex items-center gap-3">
                    <CategoryIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-white font-medium">{category.name}</span>
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                      {category.items.length}
                    </Badge>
                  </div>
                  <ChevronRight 
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`} 
                  />
                </button>

                {isExpanded && (
                  <div className="grid grid-cols-1 gap-2 pl-4">
                    {category.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <div 
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-gray-900/50 hover:bg-gray-900 rounded-lg transition-colors cursor-pointer group border border-gray-700/30 hover:border-purple-500/30"
                          onMouseDown={(e) => handleShapeDragStart(item, e)}
                          onClick={() => handleAddToCanvas(item)}
                        >
                          <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-purple-600/20 transition-colors">
                            <ItemIcon className="h-4 w-4 text-gray-400 group-hover:text-purple-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-sm font-medium">{item.name}</h4>
                            <p className="text-gray-500 text-xs truncate">{item.description}</p>
                          </div>
                          <Plus className="h-4 w-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Templates Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <Layout className="h-5 w-5 text-gray-400" />
              <span className="text-white font-medium">Funnel Templates</span>
              <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                {marketingFunnelTemplates.length}
              </Badge>
            </div>

            <div className="space-y-1 pl-4">
              {marketingFunnelTemplates.slice(0, 3).map((template) => (
                <div 
                  key={template.id}
                  className="p-3 bg-gray-900/50 hover:bg-gray-900 rounded-lg transition-colors cursor-pointer group border border-gray-700/30 hover:border-blue-500/30"
                >
                  <h4 className="text-white text-sm font-medium mb-1">{template.name}</h4>
                  <p className="text-gray-500 text-xs mb-2 line-clamp-2">{template.description}</p>
                  {template.metrics && (
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                        {template.metrics.stages} stages
                      </Badge>
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                        {(template.metrics.expectedConversionRate * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <h4 className="text-blue-200 text-sm font-medium mb-2">How to use</h4>
            <ul className="text-blue-300 text-xs space-y-1">
              <li>• Click on any shape to add it to the canvas</li>
              <li>• Drag shapes directly to the canvas</li>
              <li>• Use templates for quick funnel creation</li>
              <li>• Search to find specific elements</li>
            </ul>
          </div>
        </div>
      </ScrollArea>

      {/* Drag Modal */}
      {isDragModalOpen && draggedShape && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md">
            <h3 className="text-white text-lg font-semibold mb-2">Add to Canvas</h3>
            <p className="text-gray-400 text-sm mb-4">
              Drag this {draggedShape.name} to the canvas or click "Add to Center"
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={() => {
                  handleAddToCanvas(draggedShape);
                  setIsDragModalOpen(false);
                  setDraggedShape(null);
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Add to Center
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setIsDragModalOpen(false);
                  setDraggedShape(null);
                }}
                className="border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 