
import React from 'react';
import { FunnelComponent } from '../../types/funnel';
import { Button } from '../ui/button';
import { Edit3, Link2, Copy } from 'lucide-react';

interface ComponentNodeActionsProps {
  component: FunnelComponent;
  isSelected: boolean;
  isConnecting: boolean;
  onDuplicateClick: (e: React.MouseEvent) => void;
  onConnectionClick: (e: React.MouseEvent) => void;
  onEditClick?: (e: React.MouseEvent) => void;
}

export const ComponentNodeActions: React.FC<ComponentNodeActionsProps> = ({
  component,
  isSelected,
  isConnecting,
  onDuplicateClick,
  onConnectionClick,
  onEditClick
}) => {
  if (!isSelected || isConnecting) return null;

  return (
    <div
      className="absolute flex gap-2 z-[800]"
      style={{
        left: component.position.x + 56, // Centralizar horizontalmente no card
        top: component.position.y + 170, // Posicionar abaixo do card
      }}
    >
      {onEditClick && (
        <Button
          size="icon"
          variant="ghost"
          onClick={onEditClick}
          className="w-10 h-10 bg-gray-800/90 hover:bg-gray-700 border border-gray-600/50 text-gray-300 hover:text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-xl rounded-xl"
          title="Editar componente"
        >
          <Edit3 size={18} />
        </Button>
      )}
      
      <Button
        size="icon"
        variant="ghost"
        onClick={onConnectionClick}
        className="w-10 h-10 bg-blue-900/90 hover:bg-blue-800 border border-blue-600/50 text-blue-300 hover:text-blue-100 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-xl rounded-xl"
        title="Conectar com outro componente"
      >
        <Link2 size={18} />
      </Button>
      
      <Button
        size="icon"
        variant="ghost"
        onClick={onDuplicateClick}
        className="w-10 h-10 bg-green-900/90 hover:bg-green-800 border border-green-600/50 text-green-300 hover:text-green-100 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-xl rounded-xl"
        title="Duplicar componente"
      >
        <Copy size={18} />
      </Button>
    </div>
  );
};
