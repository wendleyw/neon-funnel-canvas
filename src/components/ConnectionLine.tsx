
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
    <>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 10 }}
      >
        {/* Definição do degradê */}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.1" />
            <stop offset="50%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
          
          {/* Shadow filter */}
          <filter id={`shadow-${connection.id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={color} floodOpacity="0.3"/>
          </filter>
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
        
        {/* Linha principal - com ou sem animação baseado no estado */}
        <path
          d={pathData}
          stroke={isAnimated ? `url(#${gradientId})` : color}
          strokeWidth="3"
          fill="none"
          filter={`url(#shadow-${connection.id})`}
          className={`pointer-events-none ${isAnimated ? 'animate-pulse' : ''}`}
          opacity={isAnimated ? "1" : "0.8"}
        />
        
        {/* Bola animada no meio da linha - só aparece quando animado */}
        {isAnimated && (
          <circle
            cx={(startX + endX) / 2}
            cy={(startY + endY) / 2}
            r="4"
            fill={color}
            className="pointer-events-none animate-bounce"
            opacity="0.8"
            filter={`url(#shadow-${connection.id})`}
          />
        )}
        
        {/* Indicador visual quando selecionado */}
        {isSelected && (
          <path
            d={pathData}
            stroke={color}
            strokeWidth="5"
            fill="none"
            strokeDasharray="8,4"
            opacity="0.8"
            className="pointer-events-none animate-pulse"
          />
        )}
      </svg>

      {/* Editor de conexão quando selecionado */}
      {isSelected && (
        <ConnectionEditor
          connection={connection}
          position={editorPosition}
          onUpdate={onUpdate || (() => {})}
          onDelete={onDelete || (() => {})}
          onClose={() => onSelect?.()}
        />
      )}
    </>
  );
};
