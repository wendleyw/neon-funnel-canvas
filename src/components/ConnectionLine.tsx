
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

  const pathData = `M ${startX} ${startY} L ${endX} ${endY}`;
  const color = getConnectionColor();
  const gradientId = `gradient-${connection.id}`;

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
          
          {/* Controles de cor quando selecionado */}
          <g>
            <foreignObject
              x={(startX + endX) / 2 - 60}
              y={(startY + endY) / 2 - 50}
              width="120"
              height="100"
              className="pointer-events-auto"
            >
              <div className="flex flex-col items-center gap-2 bg-gray-900 p-3 rounded-lg shadow-lg border border-gray-700">
                <div className="text-white text-xs font-medium">Cor da Conexão</div>
                <div className="flex gap-2">
                  <button
                    className="w-6 h-6 rounded-full bg-green-500 border-2 border-white hover:scale-110 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Aqui você pode adicionar a lógica para mudar a cor para success
                      console.log('Mudando cor para success');
                    }}
                  />
                  <button
                    className="w-6 h-6 rounded-full bg-red-500 border-2 border-white hover:scale-110 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Aqui você pode adicionar a lógica para mudar a cor para failure
                      console.log('Mudando cor para failure');
                    }}
                  />
                  <button
                    className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-white hover:scale-110 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Aqui você pode adicionar a lógica para mudar a cor para conditional
                      console.log('Mudando cor para conditional');
                    }}
                  />
                </div>
                
                {/* Botão de delete */}
                <button
                  className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect?.();
                  }}
                >
                  ×
                </button>
              </div>
            </foreignObject>
          </g>
        </>
      )}
    </g>
  );
};
