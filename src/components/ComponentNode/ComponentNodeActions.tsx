
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
        left: component.position.x + 20,
        top: component.position.y + 120, // Posicionar abaixo do componente
      }}
    >
      {onEditClick && (
        <Button
          size="sm"
          variant="outline"
          onClick={onEditClick}
          className="bg-white/90 hover:bg-white border-gray-300 text-gray-700 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
        >
          <Edit3 size={14} className="mr-1" />
          Editar
        </Button>
      )}
      
      <Button
        size="sm"
        variant="outline"
        onClick={onConnectionClick}
        className="bg-blue-50/90 hover:bg-blue-100 border-blue-300 text-blue-700 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
      >
        <Link2 size={14} className="mr-1" />
        Conectar
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={onDuplicateClick}
        className="bg-green-50/90 hover:bg-green-100 border-green-300 text-green-700 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
      >
        <Copy size={14} className="mr-1" />
        Duplicar
      </Button>
    </div>
  );
};
