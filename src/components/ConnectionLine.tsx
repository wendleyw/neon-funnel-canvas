
import React from 'react';
import { Connection } from '../types/funnel';

interface ConnectionLineProps {
  connection: Connection;
  fromPosition: { x: number; y: number };
  toPosition: { x: number; y: number };
  isSelected?: boolean;
  onSelect?: () => void;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  connection,
  fromPosition,
  toPosition,
  isSelected = false,
  onSelect
}) => {
  const startX = fromPosition.x + 192; // Component width
  const startY = fromPosition.y + 40;  // Component center
  const endX = toPosition.x;
  const endY = toPosition.y + 40;

  const getConnectionColor = () => {
    switch (connection.type) {
      case 'success': return '#10B981';
      case 'failure': return '#EF4444';
      case 'conditional': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  // Área invisível clicável ao longo da conexão
  const pathData = `M ${startX} ${startY} L ${endX} ${endY}`;

  return (
    <g>
      {/* Área clicável invisível */}
      <path
        d={pathData}
        stroke="transparent"
        strokeWidth="20"
        fill="none"
        className="pointer-events-auto cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.();
        }}
      />
      
      {/* Indicador visual quando selecionado */}
      {isSelected && (
        <>
          <path
            d={pathData}
            stroke={getConnectionColor()}
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            opacity="0.6"
            className="pointer-events-none animate-pulse"
          />
          
          {/* Botão de delete no meio da conexão */}
          <g>
            <circle
              cx={(startX + endX) / 2}
              cy={(startY + endY) / 2}
              r="12"
              fill="#EF4444"
              className="pointer-events-auto cursor-pointer"
            />
            <text
              x={(startX + endX) / 2}
              y={(startY + endY) / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="12"
              fontWeight="bold"
              className="pointer-events-none select-none"
            >
              ×
            </text>
          </g>
        </>
      )}
    </g>
  );
};
