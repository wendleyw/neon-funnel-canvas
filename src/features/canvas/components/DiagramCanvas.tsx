import React, { useState, useRef, useCallback } from 'react';
import { DrawingTool } from '../../../types/drawing';
import { FunnelComponent } from '../../../types/funnel';
import { 
  Square, 
  Circle, 
  Triangle, 
  Hexagon, 
  Star, 
  Type, 
  MousePointer,
  Grid3X3 as Grid3x3
} from 'lucide-react';

interface DiagramCanvasProps {
  onShapeAdd?: (shape: any) => void;
  onComponentAdd?: (component: FunnelComponent) => void;
  onComponentUpdate?: (id: string, updates: Partial<FunnelComponent>) => void;
  onComponentDelete?: (id: string) => void;
  components?: FunnelComponent[];
  readOnly?: boolean;
  className?: string;
}

export const DiagramCanvas: React.FC<DiagramCanvasProps> = ({
  onShapeAdd,
  onComponentAdd,
  onComponentUpdate,
  onComponentDelete,
  components = [],
  readOnly = false,
  className = ''
}) => {
  const [activeTool, setActiveTool] = useState<DrawingTool>('select');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [currentPoint, setCurrentPoint] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleToolSelect = (tool: DrawingTool) => {
    setActiveTool(tool);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (readOnly || activeTool === 'select') return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setStartPoint({ x, y });
    setCurrentPoint({ x, y });
    setIsDrawing(true);
  }, [activeTool, readOnly]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDrawing) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPoint({ x, y });
  }, [isDrawing]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return;
    
    // Calculate width and height
    const width = Math.abs(currentPoint.x - startPoint.x);
    const height = Math.abs(currentPoint.y - startPoint.y);
    
    // Only create shape if it has some size
    if (width > 10 && height > 10 && onShapeAdd) {
      // Normalize coordinates to always have top-left as the starting point
      const x = Math.min(startPoint.x, currentPoint.x);
      const y = Math.min(startPoint.y, currentPoint.y);
      
      const shape = {
        type: activeTool,
        position: { x, y },
        size: { width, height },
        style: {
          fill: 'rgba(59, 130, 246, 0.5)',
          stroke: '#3b82f6',
          strokeWidth: 2
        },
        text: '',
        textStyle: {
          fontSize: '14px',
          fontFamily: 'Arial',
          fill: '#ffffff'
        }
      };
      
      onShapeAdd(shape);
    }
    
    setIsDrawing(false);
  }, [isDrawing, activeTool, startPoint, currentPoint, onShapeAdd]);

  const renderDrawingPreview = () => {
    if (!isDrawing) return null;
    
    const width = Math.abs(currentPoint.x - startPoint.x);
    const height = Math.abs(currentPoint.y - startPoint.y);
    const left = Math.min(startPoint.x, currentPoint.x);
    const top = Math.min(startPoint.y, currentPoint.y);
    
    let shapeElement = null;
    
    switch (activeTool) {
      case 'rectangle':
        shapeElement = (
          <div 
            className="absolute border-2 border-blue-500 bg-blue-500/30"
            style={{ 
              left, 
              top, 
              width, 
              height 
            }}
          />
        );
        break;
      case 'circle':
        shapeElement = (
          <div 
            className="absolute border-2 border-blue-500 bg-blue-500/30 rounded-full"
            style={{ 
              left, 
              top, 
              width, 
              height 
            }}
          />
        );
        break;
      case 'diamond':
        shapeElement = (
          <div 
            className="absolute border-2 border-blue-500 bg-blue-500/30"
            style={{ 
              left, 
              top, 
              width, 
              height,
              transform: 'rotate(45deg)',
              transformOrigin: 'center'
            }}
          />
        );
        break;
      case 'line':
        const angle = Math.atan2(
          currentPoint.y - startPoint.y,
          currentPoint.x - startPoint.x
        );
        const length = Math.sqrt(
          Math.pow(currentPoint.x - startPoint.x, 2) + 
          Math.pow(currentPoint.y - startPoint.y, 2)
        );
        
        shapeElement = (
          <div 
            className="absolute border-t-2 border-blue-500"
            style={{ 
              left: startPoint.x, 
              top: startPoint.y, 
              width: length,
              transform: `rotate(${angle}rad)`,
              transformOrigin: '0 0'
            }}
          />
        );
        break;
      default:
        break;
    }
    
    return shapeElement;
  };

  return (
    <div className={`relative flex flex-col h-full ${className}`}>
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex items-center space-x-2 p-2 bg-gray-800 border-b border-gray-700">
          <button 
            className={`p-2 rounded ${activeTool === 'select' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => handleToolSelect('select')}
            title="Select"
          >
            <MousePointer className="w-4 h-4" />
          </button>
          <button 
            className={`p-2 rounded ${activeTool === 'rectangle' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => handleToolSelect('rectangle')}
            title="Rectangle"
          >
            <Square className="w-4 h-4" />
          </button>
          <button 
            className={`p-2 rounded ${activeTool === 'circle' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => handleToolSelect('circle')}
            title="Circle"
          >
            <Circle className="w-4 h-4" />
          </button>
          <button 
            className={`p-2 rounded ${activeTool === 'diamond' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => handleToolSelect('diamond')}
            title="Diamond"
          >
            <Triangle className="w-4 h-4" />
          </button>
          <button 
            className={`p-2 rounded ${activeTool === 'hexagon' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => handleToolSelect('hexagon')}
            title="Hexagon"
          >
            <Hexagon className="w-4 h-4" />
          </button>
          <button 
            className={`p-2 rounded ${activeTool === 'star' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => handleToolSelect('star')}
            title="Star"
          >
            <Star className="w-4 h-4" />
          </button>
          <button 
            className={`p-2 rounded ${activeTool === 'line' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => handleToolSelect('line')}
            title="Line"
          >
            <div className="w-4 h-4 flex items-center justify-center">—</div>
          </button>
          <button 
            className={`p-2 rounded ${activeTool === 'text' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => handleToolSelect('text')}
            title="Text"
          >
            <Type className="w-4 h-4" />
          </button>
          <button 
            className={`p-2 rounded ${activeTool === 'funnel' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => handleToolSelect('funnel')}
            title="Funnel"
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="flex-1 relative bg-gray-900 overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Existing components would be rendered here */}
        {components.map(component => (
          <div 
            key={component.id}
            className="absolute border border-gray-600 bg-gray-800 p-2 rounded"
            style={{
              left: component.position.x,
              top: component.position.y,
              minWidth: '100px',
              minHeight: '50px'
            }}
          >
            <div className="text-sm font-medium">{component.data.title}</div>
            {component.data.description && (
              <div className="text-xs text-gray-400">{component.data.description}</div>
            )}
          </div>
        ))}
        
        {/* Drawing preview */}
        {renderDrawingPreview()}
      </div>
    </div>
  );
};
