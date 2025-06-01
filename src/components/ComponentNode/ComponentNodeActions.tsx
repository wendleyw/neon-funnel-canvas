
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
      className="absolute flex gap-2 z-[1001]"
      style={{
        left: component.position.x + 76, // Centralizar horizontalmente no card (192/2 - 40)
        top: component.position.y + 140, // 2cm (aprox. 75px) abaixo do card
      }}
    >
      {onEditClick && (
        <Button
          size="icon"
          variant="outline"
          onClick={onEditClick}
          className="w-8 h-8 bg-white/95 hover:bg-white border-gray-300 text-gray-700 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-xl"
          title="Editar componente"
        >
          <Edit3 size={16} />
        </Button>
      )}
      
      <Button
        size="icon"
        variant="outline"
        onClick={onConnectionClick}
        className="w-8 h-8 bg-blue-50/95 hover:bg-blue-100 border-blue-300 text-blue-700 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-xl"
        title="Conectar com outro componente"
      >
        <Link2 size={16} />
      </Button>
      
      <Button
        size="icon"
        variant="outline"
        onClick={onDuplicateClick}
        className="w-8 h-8 bg-green-50/95 hover:bg-green-100 border-green-300 text-green-700 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-xl"
        title="Duplicar componente"
      >
        <Copy size={16} />
      </Button>
    </div>
  );
};
