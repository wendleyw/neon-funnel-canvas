
import React from 'react';
import { Edit, Copy, Trash2 } from 'lucide-react';
import { FunnelComponent } from '../../types/funnel';

interface ComponentNodeActionsProps {
  component: FunnelComponent;
  isSelected: boolean;
  isConnecting: boolean;
  onEditClick: (e: React.MouseEvent) => void;
  onDuplicateClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
}

export const ComponentNodeActions: React.FC<ComponentNodeActionsProps> = ({
  component,
  isSelected,
  isConnecting,
  onEditClick,
  onDuplicateClick,
  onDeleteClick
}) => {
  if (!isSelected || isConnecting) {
    return null;
  }

  return (
    <div 
      className="absolute flex items-center justify-center space-x-2"
      style={{
        left: component.position.x + 96 - 42, // Centraliza os 3 botões (96 é metade da largura do card)
        top: component.position.y + 170, // Posiciona abaixo do card
        zIndex: 1001
      }}
    >
      <button
        onClick={onEditClick}
        className="w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
        title="Editar componente"
      >
        <Edit className="w-3.5 h-3.5" />
      </button>
      
      <button
        onClick={onDuplicateClick}
        className="w-7 h-7 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
        title="Duplicar componente"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>
      
      <button
        onClick={onDeleteClick}
        className="w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
        title="Excluir componente"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
