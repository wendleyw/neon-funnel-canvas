
import React, { useState } from 'react';
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
  const [showEditor, setShowEditor] = useState(false);

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

  const handleConnectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.();
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    onSelect?.();
  };

  return (
    <>
      <g>
        {/* Definições avançadas de filtros e gradientes */}
        <defs>
          {/* Gradiente principal melhorado */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="25%" stopColor={color} stopOpacity="0.9" />
            <stop offset="75%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </linearGradient>
          
          {/* Sombra e brilho */}
          <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
            <feOffset dx="0" dy="3" result="offset"/>
            <feFlood floodColor={color} floodOpacity="0.4"/>
            <feComposite in2="offset" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Área clicável invisível mais ampla */}
        <path
          d={pathData}
          stroke="transparent"
          strokeWidth="28"
          fill="none"
          className="pointer-events-auto cursor-pointer transition-all duration-300"
          onClick={handleConnectionClick}
          onMouseEnter={(e) => {
            const target = e.currentTarget;
            target.style.stroke = `${color}15`;
            target.style.strokeWidth = "32";
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            target.style.stroke = "transparent";
            target.style.strokeWidth = "28";
          }}
        />
        
        {/* Linha base com sombra */}
        <path
          d={pathData}
          stroke={color}
          strokeWidth="2"
          fill="none"
          className="pointer-events-none"
          filter={`url(#${shadowId})`}
          opacity="0.7"
        />
        
        {/* Linha principal com gradiente melhorado */}
        <path
          d={pathData}
          stroke={`url(#${gradientId})`}
          strokeWidth={isSelected ? "5" : "4"}
          fill="none"
          className={`pointer-events-none transition-all duration-300 ${
            isAnimated ? 'animate-pulse' : ''
          }`}
          style={{
            filter: isSelected ? `drop-shadow(0 0 12px ${color}80)` : `drop-shadow(0 0 6px ${color}40)`
          }}
        />
        
        {/* Partícula animada no centro */}
        <circle
          cx={(startX + endX) / 2}
          cy={(startY + endY) / 2}
          r={isSelected ? "8" : "5"}
          fill={color}
          className={`pointer-events-none transition-all duration-300 ${
            isAnimated ? 'animate-bounce' : isSelected ? 'animate-pulse' : ''
          }`}
          opacity="0.9"
          style={{
            filter: `drop-shadow(0 0 8px ${color}90)`,
            transform: isSelected ? 'scale(1.3)' : 'scale(1)'
          }}
        />
        
        {/* Efeito de brilho quando selecionado */}
        {isSelected && (
          <>
            {/* Linha pulsante externa */}
            <path
              d={pathData}
              stroke={color}
              strokeWidth="8"
              fill="none"
              strokeDasharray="15,10"
              opacity="0.5"
              className="pointer-events-none animate-pulse"
              style={{
                filter: `drop-shadow(0 0 15px ${color}70)`
              }}
            />
            
            {/* Partículas extras nos extremos */}
            <circle
              cx={startX}
              cy={startY}
              r="4"
              fill={color}
              className="pointer-events-none animate-ping"
              opacity="0.7"
            />
            <circle
              cx={endX}
              cy={endY}
              r="4"
              fill={color}
              className="pointer-events-none animate-ping"
              opacity="0.7"
              style={{ animationDelay: '0.5s' }}
            />
          </>
        )}
      </g>

      {/* Editor de conexão renderizado fora do SVG */}
      {showEditor && (
        <ConnectionEditor
          connection={connection}
          position={editorPosition}
          onUpdate={onUpdate || (() => {})}
          onDelete={onDelete || (() => {})}
          onClose={handleCloseEditor}
        />
      )}
    </>
  );
};
