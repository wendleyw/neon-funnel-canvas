
import React from 'react';
import { Plus, Settings } from 'lucide-react';
import { FunnelComponent } from '../../types/funnel';

interface ComponentNodeHeaderProps {
  component: FunnelComponent;
  isSelected: boolean;
  onDelete: () => void;
  onUpdate: (updates: Partial<FunnelComponent>) => void;
}

export const ComponentNodeHeader: React.FC<ComponentNodeHeaderProps> = ({
  component,
  isSelected,
  onDelete,
  onUpdate
}) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implementar edição
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div className="bg-gray-800 rounded-t-lg p-3 flex items-center justify-between">
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <span className="text-white text-sm">📱</span>
        <span className="text-white font-medium text-xs truncate">{component.data.title}</span>
      </div>
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleEditClick}
          className="text-gray-400 hover:text-blue-400 transition-colors p-1"
          title="Editar componente"
        >
          <Plus className="w-3 h-3" />
        </button>
        {isSelected && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Implementar ações avançadas
              }}
              className="text-gray-400 hover:text-white transition-colors p-1"
              title="Configurações avançadas"
            >
              <Settings className="w-3 h-3" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="text-gray-400 hover:text-red-400 transition-colors text-lg font-bold leading-none p-1"
            >
              ×
            </button>
          </>
        )}
      </div>
    </div>
  );
};
