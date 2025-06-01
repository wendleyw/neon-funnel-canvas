
import React from 'react';
import { Plus, Settings, Link, Copy } from 'lucide-react';
import { ComponentTemplate } from '../../types/funnel';

interface ComponentNodeHeaderProps {
  template: ComponentTemplate;
  isSelected: boolean;
  isConnecting: boolean;
  onEditClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
  onConnectionClick: (e: React.MouseEvent) => void;
  onDuplicateClick: (e: React.MouseEvent) => void;
}

export const ComponentNodeHeader: React.FC<ComponentNodeHeaderProps> = ({
  template,
  isSelected,
  isConnecting,
  onEditClick,
  onDeleteClick,
  onConnectionClick,
  onDuplicateClick
}) => {
  return (
    <>
      {/* Connection Button - só aparece quando selecionado e não está conectando */}
      {isSelected && !isConnecting && (
        <button
          onClick={onConnectionClick}
          className="absolute -top-3 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 z-10"
          title="Conectar com outro componente"
        >
          <Link className="w-4 h-4" />
        </button>
      )}
      
      {/* Duplicate Button - aparece quando selecionado */}
      {isSelected && !isConnecting && (
        <button
          onClick={onDuplicateClick}
          className="absolute -top-3 right-16 bg-green-500 hover:bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 z-10"
          title="Duplicar componente"
        >
          <Copy className="w-4 h-4" />
        </button>
      )}

      {/* Header */}
      <div className="bg-gray-800 rounded-t-lg p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <span className="text-white text-sm">{template.icon}</span>
          <span className="text-white font-medium text-xs truncate">{template.label}</span>
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEditClick}
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
                onClick={onDeleteClick}
                className="text-gray-400 hover:text-red-400 transition-colors text-lg font-bold leading-none p-1"
              >
                ×
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};
