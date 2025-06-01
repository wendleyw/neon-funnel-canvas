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
  const shadowId = `shadow-${connection.id}`;
  const isAnimated = connection.animated || false;

  const editorPosition = {
    x: (startX + endX) / 2,
    y: (startY + endY) / 2
  };

  return (
    <g>
      {/* Definições avançadas de filtros e gradientes */}
      <defs>
        {/* Gradiente principal melhorado */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="25%" stopColor={color} stopOpacity="0.8" />
          <stop offset="75%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
        
        {/* Sombra e brilho */}
        <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
          <feOffset dx="0" dy="2" result="offset"/>
          <feFlood floodColor={color} floodOpacity="0.3"/>
          <feComposite in2="offset" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Área clicável invisível mais ampla com hover efect */}
      <path
        d={pathData}
        stroke="transparent"
        strokeWidth="24"
        fill="none"
        className="pointer-events-auto cursor-pointer transition-all duration-200"
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.();
        }}
        onMouseEnter={(e) => {
          const target = e.currentTarget;
          target.style.stroke = `${color}20`;
          target.style.strokeWidth = "28";
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget;
          target.style.stroke = "transparent";
          target.style.strokeWidth = "24";
        }}
      />
      
      {/* Linha base com sombra */}
      <path
        d={pathData}
        stroke={color}
        strokeWidth="1"
        fill="none"
        className="pointer-events-none"
        filter={`url(#${shadowId})`}
        opacity="0.6"
      />
      
      {/* Linha principal com gradiente melhorado */}
      <path
        d={pathData}
        stroke={`url(#${gradientId})`}
        strokeWidth="3"
        fill="none"
        className={`pointer-events-none transition-all duration-300 ${
          isAnimated ? 'animate-pulse' : ''
        } ${isSelected ? 'drop-shadow-lg' : ''}`}
        style={{
          filter: isSelected ? `drop-shadow(0 0 8px ${color}80)` : 'none'
        }}
      />
      
      {/* Partícula animada no centro */}
      <circle
        cx={(startX + endX) / 2}
        cy={(startY + endY) / 2}
        r={isSelected ? "6" : "4"}
        fill={color}
        className={`pointer-events-none transition-all duration-300 ${
          isAnimated ? 'animate-bounce' : isSelected ? 'animate-pulse' : ''
        }`}
        opacity={isAnimated ? "0.9" : "0.7"}
        style={{
          filter: `drop-shadow(0 0 6px ${color}80)`,
          transform: isSelected ? 'scale(1.2)' : 'scale(1)'
        }}
      />
      
      {/* Efeito de brilho quando selecionado */}
      {isSelected && (
        <>
          {/* Linha pulsante externa */}
          <path
            d={pathData}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeDasharray="12,8"
            opacity="0.4"
            className="pointer-events-none animate-pulse"
            style={{
              filter: `drop-shadow(0 0 12px ${color}60)`
            }}
          />
          
          {/* Partículas extras nos extremos */}
          <circle
            cx={startX}
            cy={startY}
            r="3"
            fill={color}
            className="pointer-events-none animate-ping"
            opacity="0.6"
          />
          <circle
            cx={endX}
            cy={endY}
            r="3"
            fill={color}
            className="pointer-events-none animate-ping"
            opacity="0.6"
            style={{ animationDelay: '0.5s' }}
          />
        </>
      )}
      
      {/* Editor de conexão quando selecionado - renderizado como portal no DOM */}
      {isSelected && (
        <ConnectionEditor
          connection={connection}
          position={editorPosition}
          onUpdate={onUpdate || (() => {})}
          onDelete={onDelete || (() => {})}
          onClose={() => onSelect?.()}
        />
      )}
    </g>
  );
};
