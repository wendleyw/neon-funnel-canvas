import React from 'react';
import { Star } from 'lucide-react';
import { ComponentTemplate } from '../../types/funnel';

interface ComponentTemplateItemProps {
  template: ComponentTemplate;
  onDragStart: (e: React.DragEvent, template: ComponentTemplate) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (template: ComponentTemplate) => void;
  subtitle?: string;
  tags?: string[];
}

export const ComponentTemplateItem: React.FC<ComponentTemplateItemProps> = ({
  template,
  onDragStart,
  isFavorite = false,
  onToggleFavorite,
  subtitle,
  tags
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    const dragData = JSON.stringify(template);
    e.dataTransfer.setData('application/json', dragData);
    e.dataTransfer.setData('text/plain', template.label);
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(e, template);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleFavorite?.(template);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`
        flex items-center gap-3 p-3 rounded-lg transition-colors duration-150 
        cursor-grab active:cursor-grabbing group relative
        bg-black hover:bg-neutral-900 border border-neutral-700 hover:border-neutral-600
      `}
    >
      <div className="flex-1 flex flex-col min-w-0">
        <div className="font-semibold text-white text-sm truncate">
          {template.label}
        </div>
        {subtitle && (
          <div className="text-xs text-gray-400 truncate mt-0.5">
            {subtitle}
          </div>
        )}
        {tags && tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-x-1.5 gap-y-1">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="inline-block bg-neutral-800 border border-neutral-600 text-gray-300 text-[10px] px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {onToggleFavorite && (
        <button
          onClick={handleToggleFavorite}
          className="transition-opacity duration-200 p-1.5 hover:bg-neutral-700 rounded-full shrink-0 ml-2 self-center"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star 
            className={`w-5 h-5 transition-colors ${
              isFavorite 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-500 hover:text-yellow-500'
            }`} 
          />
        </button>
      )}
    </div>
  );
};
