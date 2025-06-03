import React, { useMemo, useCallback } from 'react';
import { FunnelComponent, Connection } from '../types/funnel';
import { Card } from './ui/card';
import { Minimize2, Maximize2 } from 'lucide-react';

interface MiniMapProps {
  components: FunnelComponent[];
  connections: Connection[];
  canvasTransform: { pan: { x: number; y: number }; zoom: number };
  onComponentClick?: (componentId: string) => void;
}

export const MiniMap: React.FC<MiniMapProps> = ({
  components,
  connections,
  canvasTransform,
  onComponentClick
}) => {
  const [isMinimized, setIsMinimized] = React.useState(false);
  const scale = 0.05; // Smaller scale for better overview
  const mapSize = { width: 240, height: 180 };
  const viewportSize = { width: 120, height: 90 }; // Viewport size

  const scaledComponents = useMemo(() => {
    return components.map(component => ({
      ...component,
      position: {
        x: component.position.x * scale + mapSize.width / 4,
        y: component.position.y * scale + mapSize.height / 4
      }
    }));
  }, [components, scale]);

  const scaledConnections = useMemo(() => {
    return connections.map(connection => {
      const fromComponent = components.find(c => c.id === connection.from);
      const toComponent = components.find(c => c.id === connection.to);
      
      if (!fromComponent || !toComponent) return null;
      
      return {
        ...connection,
        from: {
          x: fromComponent.position.x * scale + mapSize.width / 4,
          y: fromComponent.position.y * scale + mapSize.height / 4
        },
        to: {
          x: toComponent.position.x * scale + mapSize.width / 4,
          y: toComponent.position.y * scale + mapSize.height / 4
        }
      };
    }).filter(Boolean);
  }, [connections, components, scale]);

  const viewportPosition = useMemo(() => {
    return {
      x: Math.max(0, Math.min(mapSize.width - viewportSize.width, 
        mapSize.width / 2 - (canvasTransform.pan.x * scale))),
      y: Math.max(0, Math.min(mapSize.height - viewportSize.height, 
        mapSize.height / 2 - (canvasTransform.pan.y * scale)))
    };
  }, [canvasTransform, scale]);

  const handleComponentClick = useCallback((componentId: string) => {
    onComponentClick?.(componentId);
  }, [onComponentClick]);

  const toggleMinimize = useCallback(() => {
    setIsMinimized(!isMinimized);
  }, [isMinimized]);

  if (isMinimized) {
    return (
      <Card className="fixed bottom-4 right-4 bg-gray-900/95 border-gray-700 shadow-xl z-40 backdrop-blur-sm">
        <div className="p-2">
          <button
            onClick={toggleMinimize}
            className="flex items-center gap-2 text-white text-xs font-medium hover:text-blue-400 transition-colors"
          >
            <Maximize2 className="w-3 h-3" />
            Mini Mapa
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 bg-gray-900/95 border-gray-700 shadow-xl z-40 backdrop-blur-sm">
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white text-xs font-medium">Mini Mapa</h3>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs">{Math.round(canvasTransform.zoom * 100)}%</span>
            <button
              onClick={toggleMinimize}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Minimize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        <div 
          className="relative bg-gray-800/50 border border-gray-700 rounded overflow-hidden"
          style={{ width: mapSize.width, height: mapSize.height }}
        >
          {/* Viewport indicator */}
          <div
            className="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none"
            style={{
              left: viewportPosition.x,
              top: viewportPosition.y,
              width: viewportSize.width / canvasTransform.zoom,
              height: viewportSize.height / canvasTransform.zoom,
              minWidth: 20,
              minHeight: 15
            }}
          />
          
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />
          
          {/* Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {scaledConnections.map((connection, index) => {
              if (!connection) return null;
              return (
                <line
                  key={index}
                  x1={connection.from.x + 3}
                  y1={connection.from.y + 2}
                  x2={connection.to.x + 3}
                  y2={connection.to.y + 2}
                  stroke="#6B7280"
                  strokeWidth="1"
                  opacity="0.7"
                />
              );
            })}
          </svg>
          
          {/* Components */}
          {scaledComponents.map((component) => (
            <div
              key={component.id}
              className="absolute w-6 h-4 bg-blue-500 rounded-sm cursor-pointer hover:bg-blue-400 transition-colors border border-blue-300"
              style={{
                left: Math.max(0, Math.min(mapSize.width - 24, component.position.x)),
                top: Math.max(0, Math.min(mapSize.height - 16, component.position.y)),
              }}
              onClick={() => handleComponentClick(component.id)}
              title={component.data.title}
            />
          ))}
          
          {/* Center indicator */}
          <div 
            className="absolute w-1 h-1 bg-red-500 rounded-full pointer-events-none"
            style={{
              left: mapSize.width / 2,
              top: mapSize.height / 2
            }}
          />
        </div>
      </div>
    </Card>
  );
};
