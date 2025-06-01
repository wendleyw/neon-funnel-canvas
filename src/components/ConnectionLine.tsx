
import React from 'react';
import { Connection } from '../types/funnel';

interface ConnectionLineProps {
  connection: Connection;
  fromPosition: { x: number; y: number };
  toPosition: { x: number; y: number };
  isSelected?: boolean;
  onSelect?: () => void;
  onColorChange?: (connectionId: string, newType: string) => void;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  connection,
  fromPosition,
  toPosition,
  isSelected = false,
  onSelect,
  onColorChange
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

  const pathData = `M ${startX} ${startY} L ${endX} ${endY}`;
  const color = getConnectionColor();
  const gradientId = `gradient-${connection.id}`;

  const handleColorChange = (newType: string) => {
    if (onColorChange) {
      onColorChange(connection.id, newType);
    }
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
        className="pointer-events-none"
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
          
          {/* Controles de cor quando selecionado - UI melhorada */}
          <g>
            <foreignObject
              x={(startX + endX) / 2 - 80}
              y={(startY + endY) / 2 - 60}
              width="160"
              height="120"
              className="pointer-events-auto"
            >
              <div className="flex flex-col items-center gap-3 bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-600 backdrop-blur-sm">
                <div className="text-white text-sm font-semibold">Tipo de Conexão</div>
                
                {/* Seletor de cores melhorado */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    className={`group relative w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                      connection.type === 'success' ? 'border-white shadow-lg' : 'border-gray-500'
                    }`}
                    style={{ backgroundColor: '#10B981' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleColorChange('success');
                    }}
                    title="Sucesso"
                  >
                    <div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                    {connection.type === 'success' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full" />
                    )}
                  </button>
                  
                  <button
                    className={`group relative w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                      connection.type === 'failure' ? 'border-white shadow-lg' : 'border-gray-500'
                    }`}
                    style={{ backgroundColor: '#EF4444' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleColorChange('failure');
                    }}
                    title="Falha"
                  >
                    <div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                    {connection.type === 'failure' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full" />
                    )}
                  </button>
                  
                  <button
                    className={`group relative w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                      connection.type === 'conditional' ? 'border-white shadow-lg' : 'border-gray-500'
                    }`}
                    style={{ backgroundColor: '#F59E0B' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleColorChange('conditional');
                    }}
                    title="Condicional"
                  >
                    <div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                    {connection.type === 'conditional' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full" />
                    )}
                  </button>
                </div>
                
                {/* Labels das cores */}
                <div className="grid grid-cols-3 gap-3 text-xs text-gray-300">
                  <span className="text-center">Sucesso</span>
                  <span className="text-center">Falha</span>
                  <span className="text-center">Condicional</span>
                </div>
                
                {/* Botão de delete melhorado */}
                <button
                  className="w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect?.();
                  }}
                  title="Deletar conexão"
                >
                  <span className="text-lg font-bold">×</span>
                </button>
              </div>
            </foreignObject>
          </g>
        </>
      )}
    </g>
  );
};
