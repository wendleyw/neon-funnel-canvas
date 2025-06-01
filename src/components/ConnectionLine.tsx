
import React from 'react';
import { Connection } from '../types/funnel';

interface ConnectionLineProps {
  connection: Connection;
  fromPosition: { x: number; y: number };
  toPosition: { x: number; y: number };
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  connection,
  fromPosition,
  toPosition
}) => {
  const startX = fromPosition.x + 160; // Component width + connection point offset
  const startY = fromPosition.y + 40; // Half component height
  const endX = toPosition.x;
  const endY = toPosition.y + 40;

  // Calculate control points for curved line
  const controlX1 = startX + (endX - startX) * 0.5;
  const controlY1 = startY;
  const controlX2 = startX + (endX - startX) * 0.5;
  const controlY2 = endY;

  const pathData = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;

  const getConnectionColor = () => {
    switch (connection.type) {
      case 'success': return '#10B981'; // green
      case 'failure': return '#EF4444'; // red
      case 'conditional': return '#F59E0B'; // amber
      default: return '#6B7280'; // gray
    }
  };

  return (
    <g>
      <defs>
        <marker
          id={`arrowhead-${connection.id}`}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={getConnectionColor()}
          />
        </marker>
      </defs>
      
      <path
        d={pathData}
        stroke={getConnectionColor()}
        strokeWidth="2"
        fill="none"
        markerEnd={`url(#arrowhead-${connection.id})`}
        className="animate-pulse opacity-80 hover:opacity-100 transition-opacity"
        style={{
          filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.2))'
        }}
      />
      
      {/* Connection type indicator */}
      <circle
        cx={startX + (endX - startX) * 0.5}
        cy={startY + (endY - startY) * 0.5}
        r="4"
        fill={getConnectionColor()}
        className="animate-pulse"
      />
    </g>
  );
};
