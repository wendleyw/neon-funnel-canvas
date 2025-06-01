
import React from 'react';
import { Connection } from '../types/funnel';
import { ConnectionEditor } from './ConnectionEditor';

interface ConnectionLineProps {
  connection: Connection;
  fromPosition: { x: number; y: number };
  toPosition: { x: number; y: number };
  isSelected?: boolean;
  onSelect?: () => void;
  onUpdate?: (connectionId: string, updates: Partial<Connection>) => void;
  onDelete?: (connectionId: string) => void;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  connection,
  fromPosition,
  toPosition,
  isSelected = false,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const startX = fromPosition.x + 192; // Component width
  const startY = fromPosition.y + 40;  // Component center
  const endX = toPosition.x;
  const endY = toPosition.y + 40;

  const getConnectionColor = () => {
    // Prioriza cor customizada
    if (connection.customColor) {
      return connection.customColor;
    }
    
    // Cores padrão por tipo
    switch (connection.type) {
      case 'success': return '#10B981';
      case 'failure': return '#EF4444';
      case 'conditional': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const pathData = `M ${startX} ${startY} L ${endX} ${endY}`;
  const color = getConnectionColor();
  const gradientId = `gradient-${connection.id}`;
  const isAnimated = connection.animated || false;

  const editorPosition = {
    x: (startX + endX) / 2,
    y: (startY + endY) / 2
  };

  return (
    <g>
      {/* Definição do degradê */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.1" />
          <stop offset="50%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Área clicável invisível mais ampla */}
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
      
      {/* Linha principal com degradê */}
      <path
        d={pathData}
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        fill="none"
        className={`pointer-events-none ${isAnimated ? 'animate-pulse' : ''}`}
      />
      
      {/* Bola animada no meio da linha */}
      <circle
        cx={(startX + endX) / 2}
        cy={(startY + endY) / 2}
        r="4"
        fill={color}
        className={`pointer-events-none ${isAnimated ? 'animate-bounce' : ''}`}
        opacity={isAnimated ? "0.8" : "0.6"}
      />
      
      {/* Indicador visual quando selecionado */}
      {isSelected && (
        <>
          {/* Linha pulsante para indicar seleção */}
          <path
            d={pathData}
            stroke={color}
            strokeWidth="3"
            fill="none"
            strokeDasharray="8,4"
            opacity="0.8"
            className="pointer-events-none animate-pulse"
          />
          
          {/* Editor de conexão quando selecionado */}
          <foreignObject
            x={0}
            y={0}
            width="100%"
            height="100%"
            className="pointer-events-auto"
          >
            <ConnectionEditor
              connection={connection}
              position={editorPosition}
              onUpdate={onUpdate || (() => {})}
              onDelete={onDelete || (() => {})}
              onClose={() => onSelect?.()}
            />
          </foreignObject>
        </>
      )}
    </g>
  );
};
