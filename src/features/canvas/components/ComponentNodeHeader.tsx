
import React from 'react';
import { Plus, Settings } from 'lucide-react';
import { ComponentTemplate } from '../../../types/funnel';

interface ComponentNodeHeaderProps {
  template: ComponentTemplate;
  isSelected: boolean;
  onEditClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
}

export const ComponentNodeHeader: React.FC<ComponentNodeHeaderProps> = ({
  template,
  isSelected,
  onEditClick,
  onDeleteClick
}) => {
  const renderIcon = () => {
    if (typeof template.icon === 'string') {
      return <span className="text-white text-sm">{template.icon}</span>;
    }
    return <span className="text-white text-sm">🔧</span>;
  };

  return (
    <div className="bg-gray-800 rounded-t-lg p-3 flex items-center justify-between">
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        {renderIcon()}
        <span className="text-white font-medium text-xs truncate">{template.label}</span>
      </div>
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEditClick}
          className="text-gray-400 hover:text-blue-400 transition-colors p-1"
          title="Edit component"
        >
          <Plus className="w-3 h-3" />
        </button>
        {isSelected && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Implement advanced actions
              }}
              className="text-gray-400 hover:text-white transition-colors p-1"
              title="Advanced settings"
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
  );
};
