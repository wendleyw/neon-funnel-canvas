import React from 'react';
import { UserAction } from '../../../data/userActions';
import { ComponentTemplate } from '../../../types/funnel';
import { useIsMobile } from '../../../hooks/use-mobile';
import { Plus } from 'lucide-react';

interface UserActionItemProps {
  action: UserAction;
  onDragStart: (template: ComponentTemplate) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
}

export const UserActionItem: React.FC<UserActionItemProps> = ({
  action,
  onDragStart,
  onTemplateClick
}) => {
  const isMobile = useIsMobile();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(action));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(action);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onTemplateClick) {
      onTemplateClick(action);
    }
  };

  return (
    <div
      className="group bg-gray-900 hover:bg-gray-800 rounded-lg border border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
      draggable={!isMobile}
      onDragStart={!isMobile ? handleDragStart : undefined}
      onClick={handleClick}
    >
      <div className="p-3">
        <div className="flex items-center gap-2">
          {/* Simple Icon */}
          <div 
            className="w-6 h-6 rounded flex items-center justify-center text-xs flex-shrink-0"
            style={{ backgroundColor: `${action.color}20`, color: action.color }}
          >
            {action.iconEmoji}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-medium text-white truncate">
              {action.userFriendlyName}
            </h4>
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              {action.description}
            </p>
          </div>
          
          {/* Add indicator */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Plus className="w-3 h-3 text-blue-400" />
          </div>
        </div>
      </div>
    </div>
  );
}; 