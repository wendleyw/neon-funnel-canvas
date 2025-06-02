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
  // Ajustar pontos de conexão para o centro-direita do componente de origem
  // e centro-esquerda do componente de destino
  const startX = fromPosition.x + 272; // Largura do componente (272px)
  const startY = fromPosition.y + 80;  // Centro vertical do componente
  const endX = toPosition.x;           // Borda esquerda do componente de destino
  const endY = toPosition.y + 80;      // Centro vertical do componente

  console.log(`🎨 Renderizando linha de conexão ${connection.id}:`, {
    from: { x: startX, y: startY },
    to: { x: endX, y: endY },
    isSelected,
    type: connection.type
  });

  const getConnectionColor = () => {
    // Prioriza cor customizada
    if (connection.customColor) {
      return connection.customColor;
    }
    
    // Cores padrão por tipo com maior intensidade
    switch (connection.type) {
      case 'success': return '#10B981';
      case 'failure': return '#EF4444';
      case 'conditional': return '#F59E0B';
      default: return '#06B6D4'; // Cyan para conexões padrão
    }
  };

  // Criar uma curva suave em vez de linha reta
  const controlPointX = startX + (endX - startX) * 0.5;
  const pathData = `M ${startX} ${startY} Q ${controlPointX} ${startY} ${endX} ${endY}`;
  
  const color = getConnectionColor();
  const gradientId = `gradient-${connection.id}`;
  const glowId = `glow-${connection.id}`;
  const isAnimated = connection.animated === true;

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
        {/* Definições avançadas */}
        <defs>
          {/* Gradiente para linha animada */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.3" />
          </linearGradient>
          
          {/* Filtro de glow mais intenso */}
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Sombra mais suave */}
          <filter id={`shadow-${connection.id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor={color} floodOpacity="0.4"/>
          </filter>
        </defs>

        {/* Área clicável invisível mais ampla */}
        <path
          d={pathData}
          stroke="transparent"
          strokeWidth="30"
          fill="none"
          className="pointer-events-auto cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            console.log(`🖱️ Clique na conexão ${connection.id}`);
            onSelect?.();
          }}
        />
        
        {/* Linha base com glow */}
        <path
          d={pathData}
          stroke={color}
          strokeWidth="3"
          fill="none"
          filter={`url(#${glowId})`}
          className="pointer-events-none"
          opacity="0.8"
        />
        
        {/* Linha principal animada */}
        <path
          d={pathData}
          stroke={isAnimated ? `url(#${gradientId})` : color}
          strokeWidth="2"
          fill="none"
          className={`pointer-events-none ${isAnimated ? 'animate-pulse' : ''}`}
          strokeDasharray={isAnimated ? "10,5" : "none"}
          style={{
            animation: isAnimated ? 'dashMove 2s linear infinite' : 'none'
          }}
        />
        
        {/* Pontos nas extremidades */}
        <circle
          cx={startX}
          cy={startY}
          r="4"
          fill={color}
          className="pointer-events-none"
          filter={`url(#${glowId})`}
        />
        <circle
          cx={endX}
          cy={endY}
          r="4"
          fill={color}
          className="pointer-events-none"
          filter={`url(#${glowId})`}
        />
        
        {/* Indicador de fluxo - seta animada no meio */}
        {isAnimated && (
          <g className="pointer-events-none">
            <circle
              cx={controlPointX}
              cy={(startY + endY) / 2}
              r="6"
              fill={color}
              className="animate-pulse"
              opacity="0.9"
              filter={`url(#${glowId})`}
            />
            <polygon
              points={`${controlPointX-3},${(startY + endY) / 2 - 2} ${controlPointX+3},${(startY + endY) / 2} ${controlPointX-3},${(startY + endY) / 2 + 2}`}
              fill="white"
              className="animate-bounce"
            />
          </g>
        )}
        
        {/* Indicador visual quando selecionado */}
        {isSelected && (
          <>
            <path
              d={pathData}
              stroke={color}
              strokeWidth="6"
              fill="none"
              strokeDasharray="12,6"
              opacity="0.6"
              className="pointer-events-none animate-pulse"
              filter={`url(#${glowId})`}
            />
            <path
              d={pathData}
              stroke="white"
              strokeWidth="1"
              fill="none"
              strokeDasharray="8,4"
              opacity="0.8"
              className="pointer-events-none animate-pulse"
            />
          </>
        )}
      </svg>

      {/* CSS para animação de dash */}
      <style>
        {`
          @keyframes dashMove {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 30; }
          }
        `}
      </style>

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
