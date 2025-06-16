
import React from 'react';
import { FunnelComponent, ComponentTemplate } from '../../../../types/funnel';
import { getIconAsString } from './shared/ComponentRendererUtils';

interface PageComponentRendererProps {
  component: FunnelComponent;
  template: ComponentTemplate;
  isSelected: boolean;
  isConnecting: boolean;
  canConnect: boolean;
  onEditClick: (e?: React.MouseEvent) => void;
  onDeleteClick: (e?: React.MouseEvent) => void;
  onConnectionClick: (e?: React.MouseEvent) => void;
  onDuplicateClick?: (e?: React.MouseEvent) => void;
}

export const PageComponentRenderer: React.FC<PageComponentRendererProps> = ({
  component,
  template,
  isSelected,
  isConnecting,
  canConnect,
  onEditClick,
  onDeleteClick,
  onConnectionClick,
  onDuplicateClick
}) => {
  const iconString = getIconAsString(template.icon);

  return (
    <div className={`
      relative bg-gradient-to-br from-gray-800 to-gray-900 
      border-2 rounded-xl shadow-lg transition-all duration-200 group
      ${isSelected ? 'border-blue-400 shadow-blue-400/20' : 'border-gray-600'}
      ${canConnect ? 'border-green-400 shadow-green-400/30 animate-pulse' : ''}
      ${isConnecting ? 'border-orange-400' : ''}
      hover:shadow-xl hover:border-gray-500
      w-48 min-h-[100px]
    `}>
      
      {/* Header */}
      <div className="bg-gray-700/50 rounded-t-xl p-3 border-b border-gray-600">
        <div className="flex items-center space-x-2">
          <span className="text-lg">
            {iconString}
          </span>
          <span className="text-white font-medium text-sm truncate flex-1">
            {component.data.title}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {component.data.description && (
          <p className="text-gray-300 text-xs leading-relaxed mb-2 line-clamp-3">
            {component.data.description}
          </p>
        )}
        
        {/* Properties summary */}
        {component.data.properties && Object.keys(component.data.properties).length > 0 && (
          <div className="text-xs text-gray-400">
            {Object.keys(component.data.properties).length} properties configured
          </div>
        )}
      </div>

      {/* Status indicator */}
      <div className={`
        absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800
        ${component.data.status === 'active' ? 'bg-green-500' : 
          component.data.status === 'draft' ? 'bg-yellow-500' : 
          component.data.status === 'inactive' ? 'bg-red-500' : 'bg-gray-500'}
      `} />

      {/* Actions overlay */}
      {isSelected && (
        <div className="absolute -top-8 right-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 rounded px-2 py-1">
          <button
            onClick={onEditClick}
            className="text-blue-400 hover:text-blue-300 text-xs"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={onConnectionClick}
            className="text-green-400 hover:text-green-300 text-xs"
            title="Connect"
          >
            🔗
          </button>
          <button
            onClick={onDeleteClick}
            className="text-red-400 hover:text-red-300 text-xs"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};
