
import React from 'react';
import { Copy, Link } from 'lucide-react';
import { FunnelComponent } from '../../types/funnel';

interface ComponentNodeActionsProps {
  component: FunnelComponent;
  isSelected: boolean;
  isConnecting: boolean;
  onDuplicateClick: (e: React.MouseEvent) => void;
  onConnectionClick: (e: React.MouseEvent) => void;
}

export const ComponentNodeActions: React.FC<ComponentNodeActionsProps> = ({
  component,
  isSelected,
  isConnecting,
  onDuplicateClick,
  onConnectionClick
}) => {
  if (!isSelected || isConnecting) {
    return null;
  }

  return (
    <div 
      className="absolute flex items-center justify-center space-x-3"
      style={{
        left: component.position.x + 96 - 40, // Centraliza os botões (96 é metade da largura do card)
        top: component.position.y + 180, // 20px abaixo do card
        zIndex: 1001
      }}
    >
      <button
        onClick={onDuplicateClick}
        className="w-8 h-8 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
        title="Duplicar componente"
      >
        <Copy className="w-4 h-4" />
      </button>
      
      <button
        onClick={onConnectionClick}
        className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
        title="Conectar com outro componente"
      >
        <Link className="w-4 h-4" />
      </button>
    </div>
  );
};
