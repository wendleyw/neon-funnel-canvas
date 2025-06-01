
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
  const startX = fromPosition.x + 192; // Component width
  const startY = fromPosition.y + 40;  // Component center
  const endX = toPosition.x;
  const endY = toPosition.y + 40;

  // Curva suave
  const controlX1 = startX + Math.abs(endX - startX) * 0.5;
  const controlY1 = startY;
  const controlX2 = endX - Math.abs(endX - startX) * 0.5;
  const controlY2 = endY;

  const pathData = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;

  const getConnectionColor = () => {
    switch (connection.type) {
      case 'success': return '#10B981';
      case 'failure': return '#EF4444';
      case 'conditional': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  return (
    <g>
      <defs>
        <marker
          id={`arrowhead-${connection.id}`}
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill={getConnectionColor()}
          />
        </marker>
        
        {/* Gradiente para a linha */}
        <linearGradient id={`gradient-${connection.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={getConnectionColor()} stopOpacity="0.8" />
          <stop offset="50%" stopColor={getConnectionColor()} stopOpacity="1" />
          <stop offset="100%" stopColor={getConnectionColor()} stopOpacity="0.8" />
        </linearGradient>
      </defs>
      
      {/* Linha de fundo mais grossa para o glow */}
      <path
        d={pathData}
        stroke={getConnectionColor()}
        strokeWidth="6"
        fill="none"
        opacity="0.3"
        className="blur-sm"
      />
      
      {/* Linha principal */}
      <path
        d={pathData}
        stroke={`url(#gradient-${connection.id})`}
        strokeWidth="3"
        fill="none"
        markerEnd={`url(#arrowhead-${connection.id})`}
        className="transition-all duration-300 hover:stroke-width-4"
        style={{
          filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))'
        }}
      />
    </g>
  );
};
