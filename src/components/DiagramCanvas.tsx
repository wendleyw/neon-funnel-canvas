import React, { useState, useCallback, useRef } from 'react';
import { DrawingTool, DrawingShape, FunnelTemplate, Point, Size } from '../types/drawing';
import { ShapeRenderer } from './DrawingTools/ShapeRenderer';
import { marketingFunnelTemplates } from '../data/funnelTemplates';
import { Button } from './ui/button';
import { Input } from './ui/input';
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
  MousePointer2,
  Hand,
  RotateCcw,
  RotateCw,
  Download,
  Share,
  Plus,
  ChevronDown,
  Grid3x3
} from 'lucide-react';

interface ShapeCategory {
  id: string;
  name: string;
  items: ShapeItem[];
}

interface ShapeItem {
  id: string;
  type: DrawingTool;
  icon: React.ComponentType<any>;
  tooltip: string;
}

const shapeCategories: ShapeCategory[] = [
  {
    id: 'standard',
    name: 'Standard',
    items: [
      { id: 'rectangle', type: 'rectangle', icon: Square, tooltip: 'Rectangle' },
      { id: 'circle', type: 'circle', icon: Circle, tooltip: 'Circle' },
      { id: 'diamond', type: 'diamond', icon: Diamond, tooltip: 'Diamond' },
      { id: 'triangle', type: 'diamond', icon: Triangle, tooltip: 'Triangle' },
      { id: 'hexagon', type: 'hexagon', icon: Hexagon, tooltip: 'Hexagon' },
      { id: 'star', type: 'star', icon: Star, tooltip: 'Star' }
    ]
  },
  {
    id: 'flowchart',
    name: 'Flowchart',
    items: [
      { id: 'process', type: 'rectangle', icon: Square, tooltip: 'Process' },
      { id: 'decision', type: 'diamond', icon: Diamond, tooltip: 'Decision' },
      { id: 'terminator', type: 'circle', icon: Circle, tooltip: 'Terminator' },
      { id: 'data', type: 'hexagon', icon: Hexagon, tooltip: 'Data' }
    ]
  },
  {
    id: 'arrows',
    name: 'Arrows & Lines',
    items: [
      { id: 'arrow', type: 'arrow', icon: ArrowRight, tooltip: 'Arrow' },
      { id: 'line', type: 'line', icon: Minus, tooltip: 'Line' }
    ]
  },
  {
    id: 'funnel',
    name: 'Marketing',
    items: [
      { id: 'funnel', type: 'funnel', icon: Zap, tooltip: 'Funnel' },
      { id: 'text', type: 'text', icon: Type, tooltip: 'Text' }
    ]
  }
];

export const DiagramCanvas: React.FC = () => {
  const [shapes, setShapes] = useState<DrawingShape[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<'select' | 'hand'>('select');
  const [showGrid, setShowGrid] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedShape, setDraggedShape] = useState<ShapeItem | null>(null);
  const [dragPosition, setDragPosition] = useState<Point | null>(null);
  const [history, setHistory] = useState<DrawingShape[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const gridSize = 20;

  // Generate unique ID
  const generateId = () => `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Filter shapes based on search
  const filteredCategories = shapeCategories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      searchTerm === '' || 
      item.tooltip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  // Handle drag start from sidebar
  const handleShapeDragStart = useCallback((shape: ShapeItem, e: React.MouseEvent) => {
    setDraggedShape(shape);
    e.preventDefault();
  }, []);

  // Handle mouse move during drag
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggedShape) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, [draggedShape]);

  // Handle drop on canvas
  const handleDrop = useCallback((e: React.MouseEvent) => {
    if (!draggedShape || !dragPosition) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const position: Point = {
      x: e.clientX - rect.left - 50,
      y: e.clientY - rect.top - 30
    };

    // Create new shape
    const newShape: DrawingShape = {
      id: generateId(),
      type: draggedShape.type,
      position,
      size: getDefaultSize(draggedShape.type),
      style: getDefaultStyle(draggedShape.type),
      text: getDefaultText(draggedShape.type),
      textStyle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
        align: 'center',
        verticalAlign: 'middle'
      }
    };

    const newShapes = [...shapes, newShape];
    setShapes(newShapes);
    addToHistory(newShapes);
    setSelectedShapes([newShape.id]);

    // Reset drag state
    setDraggedShape(null);
    setDragPosition(null);
  }, [draggedShape, dragPosition, shapes]);

  // Get default size for shape type
  const getDefaultSize = (type: DrawingTool): Size => {
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

  // Get default style (more Lucidchart-like)
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

  // Add to history
  const addToHistory = (newShapes: DrawingShape[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newShapes]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Handle shape selection
  const handleShapeSelect = useCallback((shapeId: string) => {
    setSelectedShapes([shapeId]);
  }, []);

  // Handle template selection
  const handleTemplateSelect = useCallback((template: FunnelTemplate) => {
    const templateShapes: DrawingShape[] = template.shapes.map((shapeTemplate) => ({
      ...shapeTemplate,
      id: generateId(),
      position: {
        x: shapeTemplate.position.x + 200,
        y: shapeTemplate.position.y + 100
      },
      style: {
        ...shapeTemplate.style,
        fill: '#FFFFFF',
        stroke: '#374151'
      },
      textStyle: {
        ...shapeTemplate.textStyle,
        color: '#374151'
      }
    }));

    const newShapes = [...shapes, ...templateShapes];
    setShapes(newShapes);
    addToHistory(newShapes);
  }, [shapes, history, historyIndex]);

  return (
    <div className="flex h-full bg-white">
      {/* Top Toolbar */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-white border-b border-gray-200 flex items-center px-4 z-50">
        <div className="flex items-center gap-2">
          {/* Tool Selection */}
          <div className="flex items-center bg-gray-50 rounded-lg p-1">
            <Button
              variant={activeTool === 'select' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTool('select')}
              className={`h-8 w-8 p-0 ${activeTool === 'select' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
            >
              <MousePointer2 className="h-4 w-4" />
            </Button>
            <Button
              variant={activeTool === 'hand' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTool('hand')}
              className={`h-8 w-8 p-0 ${activeTool === 'hand' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
            >
              <Hand className="h-4 w-4" />
            </Button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* History Controls */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (historyIndex > 0) {
                setHistoryIndex(historyIndex - 1);
                setShapes(history[historyIndex - 1]);
              }
            }}
            disabled={historyIndex <= 0}
            className="h-8 w-8 p-0 text-gray-600 disabled:opacity-30"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (historyIndex < history.length - 1) {
                setHistoryIndex(historyIndex + 1);
                setShapes(history[historyIndex + 1]);
              }
            }}
            disabled={historyIndex >= history.length - 1}
            className="h-8 w-8 p-0 text-gray-600 disabled:opacity-30"
          >
            <RotateCw className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300" />

          {/* Grid Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
            className={`h-8 w-8 p-0 ${showGrid ? 'text-blue-500' : 'text-gray-600'}`}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1" />

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 mt-12 flex flex-col">
        {/* Search */}
        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search shapes"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-8 text-sm border-gray-200 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Shape Categories */}
        <div className="flex-1 overflow-y-auto">
          {/* Shapes in Use (if any) */}
          {shapes.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Shapes in Use
              </h3>
              <div className="grid grid-cols-6 gap-1">
                {[...new Set(shapes.map(s => s.type))].slice(0, 6).map((type) => {
                  const shapeItem = shapeCategories
                    .flatMap(cat => cat.items)
                    .find(item => item.type === type);
                  
                  if (!shapeItem) return null;
                  
                  const Icon = shapeItem.icon;
                  return (
                    <div
                      key={type}
                      className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-300"
                      onMouseDown={(e) => handleShapeDragStart(shapeItem, e)}
                      title={shapeItem.tooltip}
                    >
                      <Icon className="h-4 w-4 text-gray-600" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Shape Categories */}
          {filteredCategories.map((category) => (
            <div key={category.id} className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {category.name}
                </h3>
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </div>
              
              <div className="grid grid-cols-6 gap-1">
                {category.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-colors"
                      onMouseDown={(e) => handleShapeDragStart(item, e)}
                      title={item.tooltip}
                    >
                      <Icon className="h-4 w-4 text-gray-600" />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Templates */}
          <div className="p-3 border-b border-gray-100">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Templates
            </h3>
            <div className="space-y-1">
              {marketingFunnelTemplates.slice(0, 3).map((template) => (
                <div
                  key={template.id}
                  className="p-2 text-xs text-gray-600 hover:bg-gray-50 rounded cursor-pointer border border-transparent hover:border-blue-200"
                  onClick={() => handleTemplateSelect(template)}
                >
                  {template.name}
                </div>
              ))}
            </div>
          </div>

          {/* More Shapes */}
          <div className="p-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <Plus className="h-3 w-3 mr-1" />
              More shapes
            </Button>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 mt-12 relative overflow-hidden bg-gray-50">
        <div 
          ref={canvasRef}
          className="w-full h-full relative"
          onMouseMove={handleMouseMove}
          onMouseUp={handleDrop}
        >
          <svg
            ref={svgRef}
            className="w-full h-full"
          >
            {/* Grid Pattern */}
            {showGrid && (
              <defs>
                <pattern
                  id="grid-pattern"
                  width={gridSize}
                  height={gridSize}
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx={gridSize/2} cy={gridSize/2} r="0.5" fill="#D1D5DB" />
                </pattern>
              </defs>
            )}
            
            {showGrid && (
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            )}

            {/* Render Shapes */}
            {shapes.map((shape) => (
              <ShapeRenderer
                key={shape.id}
                shape={shape}
                isSelected={selectedShapes.includes(shape.id)}
                onSelect={() => handleShapeSelect(shape.id)}
              />
            ))}
          </svg>

          {/* Drag Preview */}
          {draggedShape && dragPosition && (
            <div 
              className="absolute pointer-events-none z-50"
              style={{
                left: dragPosition.x - 20,
                top: dragPosition.y - 20
              }}
            >
              <div className="w-10 h-10 bg-white border-2 border-blue-400 rounded shadow-lg flex items-center justify-center">
                <draggedShape.icon className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          )}

          {/* Empty State */}
          {shapes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MousePointer2 className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-400 mb-2">Start creating</h3>
                <p className="text-gray-400">Drag shapes from the left panel to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 