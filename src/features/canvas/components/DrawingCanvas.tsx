import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DrawingTool, DrawingShape, FunnelTemplate, Point, Size } from '../types/drawing';
import { TemplatePanel } from './DrawingTools/TemplatePanel';
import { ShapeRenderer } from './DrawingTools/ShapeRenderer';
import { marketingFunnelTemplates } from '../data/funnelTemplates';

interface DrawingCanvasProps {
  className?: string;
  activeTool?: DrawingTool;
  onToolChange?: (tool: DrawingTool) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ 
  className = '',
  activeTool = 'select',
  onToolChange
}) => {
  const [shapes, setShapes] = useState<DrawingShape[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [showTemplatePanel, setShowTemplatePanel] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [clipboard, setClipboard] = useState<DrawingShape[]>([]);
  const [history, setHistory] = useState<DrawingShape[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const svgRef = useRef<SVGSVGElement>(null);

  // Grid pattern
  const gridSize = 20;

  // Generate unique ID for shapes
  const generateId = () => `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Handle mouse down on canvas
  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (activeTool === 'select') return;

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const point: Point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    setIsDrawing(true);
    setStartPoint(point);
  }, [activeTool]);

  // Handle mouse move for drawing
  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing || !startPoint || activeTool === 'select') return;

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentPoint: Point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    // Calculate size and position
    const size: Size = {
      width: Math.abs(currentPoint.x - startPoint.x),
      height: Math.abs(currentPoint.y - startPoint.y)
    };

    const position: Point = {
      x: Math.min(startPoint.x, currentPoint.x),
      y: Math.min(startPoint.y, currentPoint.y)
    };

    // Create preview shape (you might want to show this as a preview)
    // For now, we'll handle it in mouse up
  }, [isDrawing, startPoint, activeTool]);

  // Handle mouse up to create shape
  const handleMouseUp = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing || !startPoint || activeTool === 'select') return;

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentPoint: Point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    // Calculate size and position
    const size: Size = {
      width: Math.abs(currentPoint.x - startPoint.x),
      height: Math.abs(currentPoint.y - startPoint.y)
    };

    const position: Point = {
      x: Math.min(startPoint.x, currentPoint.x),
      y: Math.min(startPoint.y, currentPoint.y)
    };

    // Minimum size check
    if (size.width < 10 || size.height < 10) {
      setIsDrawing(false);
      setStartPoint(null);
      return;
    }

    // Create new shape
    const newShape: DrawingShape = {
      id: generateId(),
      type: activeTool,
      position,
      size,
      style: getDefaultStyle(activeTool),
      text: getDefaultText(activeTool),
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
        align: 'center',
        verticalAlign: 'middle'
      }
    };

    // Add shape to canvas
    const newShapes = [...shapes, newShape];
    setShapes(newShapes);
    addToHistory(newShapes);

    // Select the new shape
    setSelectedShapes([newShape.id]);

    // Reset drawing state
    setIsDrawing(false);
    setStartPoint(null);

    // Switch back to select tool for immediate editing
    if (onToolChange) {
      onToolChange('select');
    }
  }, [isDrawing, startPoint, activeTool, shapes, onToolChange]);

  // Get default style for shape type
  const getDefaultStyle = (type: DrawingTool) => {
    const baseStyle = {
      strokeWidth: 2,
      opacity: 1
    };

    switch (type) {
      case 'rectangle':
        return {
          ...baseStyle,
          fill: '#3B82F6',
          stroke: '#1E40AF',
          borderRadius: 8
        };
      case 'circle':
        return {
          ...baseStyle,
          fill: '#10B981',
          stroke: '#059669'
        };
      case 'diamond':
        return {
          ...baseStyle,
          fill: '#F59E0B',
          stroke: '#D97706'
        };
      case 'funnel':
        return {
          ...baseStyle,
          fill: '#8B5CF6',
          stroke: '#7C3AED',
          gradient: {
            type: 'linear' as const,
            colors: ['#A78BFA', '#8B5CF6'],
            direction: 180
          }
        };
      case 'arrow':
        return {
          ...baseStyle,
          fill: '#EF4444',
          stroke: '#DC2626'
        };
      case 'line':
        return {
          ...baseStyle,
          stroke: '#6B7280',
          strokeWidth: 3
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
          fill: '#6B7280',
          stroke: '#4B5563'
        };
    }
  };

  // Get default text for shape type
  const getDefaultText = (type: DrawingTool): string => {
    switch (type) {
      case 'funnel':
        return 'Funnel Stage';
      case 'rectangle':
        return 'Rectangle';
      case 'circle':
        return 'Circle';
      case 'diamond':
        return 'Decision';
      case 'arrow':
        return 'Process';
      case 'text':
        return 'Text';
      default:
        return 'Shape';
    }
  };

  // Add to history for undo/redo
  const addToHistory = (newShapes: DrawingShape[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newShapes]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Handle template selection
  const handleTemplateSelect = useCallback((template: FunnelTemplate) => {
    const templateShapes: DrawingShape[] = template.shapes.map((shapeTemplate, index) => ({
      ...shapeTemplate,
      id: generateId(),
      position: {
        x: shapeTemplate.position.x + 100, // Offset to avoid overlap
        y: shapeTemplate.position.y + 100
      }
    }));

    const newShapes = [...shapes, ...templateShapes];
    setShapes(newShapes);
    addToHistory(newShapes);
    setShowTemplatePanel(false);
  }, [shapes, history, historyIndex]);

  // Handle shape selection
  const handleShapeSelect = useCallback((shapeId: string) => {
    setSelectedShapes([shapeId]);
  }, []);

  // Undo function
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setShapes(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  // Redo function
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setShapes(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  // Copy function
  const handleCopy = useCallback(() => {
    const selectedShapeObjects = shapes.filter(shape => selectedShapes.includes(shape.id));
    setClipboard(selectedShapeObjects);
  }, [shapes, selectedShapes]);

  // Paste function
  const handlePaste = useCallback(() => {
    if (clipboard.length === 0) return;

    const pastedShapes: DrawingShape[] = clipboard.map(shape => ({
      ...shape,
      id: generateId(),
      position: {
        x: shape.position.x + 20,
        y: shape.position.y + 20
      }
    }));

    const newShapes = [...shapes, ...pastedShapes];
    setShapes(newShapes);
    addToHistory(newShapes);
    setSelectedShapes(pastedShapes.map(shape => shape.id));
  }, [clipboard, shapes, history, historyIndex]);

  // Delete function
  const handleDelete = useCallback(() => {
    const newShapes = shapes.filter(shape => !selectedShapes.includes(shape.id));
    setShapes(newShapes);
    addToHistory(newShapes);
    setSelectedShapes([]);
  }, [shapes, selectedShapes, history, historyIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            handleUndo();
            break;
          case 'y':
            e.preventDefault();
            handleRedo();
            break;
          case 'c':
            e.preventDefault();
            handleCopy();
            break;
          case 'v':
            e.preventDefault();
            handlePaste();
            break;
          case 'g':
            e.preventDefault();
            setShowGrid(!showGrid);
            break;
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, handleCopy, handlePaste, handleDelete, showGrid]);

  return (
    <div className={`flex h-full bg-black ${className}`}>
      {/* Main Canvas Area */}
      <div className="flex-1 relative">
        {/* Quick Actions - Right Side */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button
            onClick={() => setShowTemplatePanel(!showTemplatePanel)}
            className="bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-lg p-2 text-gray-400 hover:text-cyan-400 transition-colors"
            title="Templates"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5v18h14V4z" />
            </svg>
          </button>
          
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-lg p-2 transition-colors ${
              showGrid ? 'text-cyan-400 border-cyan-500/30' : 'text-gray-400 hover:text-white'
            }`}
            title="Toggle Grid"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
            </svg>
          </button>
        </div>

        {/* SVG Canvas */}
        <svg
          ref={svgRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Grid */}
          {showGrid && (
            <defs>
              <pattern
                id="grid"
                width={gridSize}
                height={gridSize}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                  fill="none"
                  stroke="#374151"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </pattern>
            </defs>
          )}
          
          {showGrid && (
            <rect width="100%" height="100%" fill="url(#grid)" />
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
      </div>

      {/* Template Panel */}
      <TemplatePanel
        isVisible={showTemplatePanel}
        onTemplateSelect={handleTemplateSelect}
        onClose={() => setShowTemplatePanel(false)}
      />
    </div>
  );
}; 