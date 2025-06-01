
import React from 'react';
import { Star } from 'lucide-react';
import { ComponentTemplate } from '../../types/funnel';

interface ComponentTemplateItemProps {
  template: ComponentTemplate;
  onDragStart: (e: React.DragEvent, template: ComponentTemplate) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (templateType: string) => void;
  isCompact?: boolean;
}

export const ComponentTemplateItem: React.FC<ComponentTemplateItemProps> = ({
  template,
  onDragStart,
  isFavorite = false,
  onToggleFavorite,
  isCompact = false
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    console.log('ComponentTemplateItem drag start:', template);
    e.dataTransfer.setData('application/json', JSON.stringify(template));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(e, template);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleFavorite?.(template.type);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`
        flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 
        border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 
        cursor-grab active:cursor-grabbing group relative
        ${isCompact ? 'p-2' : 'p-3'}
      `}
    >
      <div 
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-medium text-sm"
        style={{ backgroundColor: template.color }}
      >
        {template.icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-200 truncate">
          {template.label}
        </div>
        {!isCompact && template.defaultProps.description && (
          <div className="text-xs text-gray-400 truncate">
            {template.defaultProps.description}
          </div>
        )}
      </div>

      {onToggleFavorite && (
        <button
          onClick={handleToggleFavorite}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-600/50 rounded"
          title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Star 
            className={`w-4 h-4 ${
              isFavorite 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-400 hover:text-yellow-400'
            }`} 
          />
        </button>
      )}
    </div>
  );
};
