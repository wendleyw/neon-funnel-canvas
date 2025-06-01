
import React, { useMemo } from 'react';
import { FunnelComponent, Connection } from '../types/funnel';
import { Card } from './ui/card';
import { Minimize2 } from 'lucide-react';

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
  const scale = 0.1; // Escala do mini mapa
  const mapSize = { width: 200, height: 150 };

  const scaledComponents = useMemo(() => {
    return components.map(component => ({
      ...component,
      position: {
        x: component.position.x * scale,
        y: component.position.y * scale
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
          x: fromComponent.position.x * scale,
          y: fromComponent.position.y * scale
        },
        to: {
          x: toComponent.position.x * scale,
          y: toComponent.position.y * scale
        }
      };
    }).filter(Boolean);
  }, [connections, components, scale]);

  return (
    <Card className="fixed bottom-4 right-4 bg-gray-900 border-gray-700 shadow-xl z-40">
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white text-xs font-medium">Mini Mapa</h3>
          <Minimize2 className="w-3 h-3 text-gray-400" />
        </div>
        
        <div 
          className="relative bg-gray-800 border border-gray-700 rounded"
          style={{ width: mapSize.width, height: mapSize.height }}
        >
          {/* Viewport indicator */}
          <div
            className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20"
            style={{
              left: -canvasTransform.pan.x * scale,
              top: -canvasTransform.pan.y * scale,
              width: 100 / canvasTransform.zoom,
              height: 75 / canvasTransform.zoom,
            }}
          />
          
          {/* Connections */}
          <svg className="absolute inset-0 w-full h-full">
            {scaledConnections.map((connection, index) => {
              if (!connection) return null;
              return (
                <line
                  key={index}
                  x1={connection.from.x + 8}
                  y1={connection.from.y + 4}
                  x2={connection.to.x}
                  y2={connection.to.y + 4}
                  stroke="#6B7280"
                  strokeWidth="1"
                />
              );
            })}
          </svg>
          
          {/* Components */}
          {scaledComponents.map((component) => (
            <div
              key={component.id}
              className="absolute w-4 h-2 bg-blue-500 rounded cursor-pointer hover:bg-blue-400 transition-colors"
              style={{
                left: component.position.x,
                top: component.position.y,
              }}
              onClick={() => onComponentClick?.(component.id)}
              title={component.data.title}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};
