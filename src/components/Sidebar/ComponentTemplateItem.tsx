
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
    
    // Preparar dados para o drag
    const dragData = JSON.stringify(template);
    e.dataTransfer.setData('application/json', dragData);
    e.dataTransfer.setData('text/plain', template.label);
    e.dataTransfer.effectAllowed = 'copy';
    
    // Chamar o handler pai
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
        flex items-center gap-3 rounded-lg transition-all duration-200 
        cursor-grab active:cursor-grabbing group relative
        ${isCompact 
          ? 'p-3 bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/30 hover:border-slate-600/50' 
          : 'p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50'
        }
        hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5
      `}
    >
      <div 
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-medium text-sm shrink-0 shadow-sm"
        style={{ backgroundColor: template.color }}
      >
        {template.icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className={`font-medium truncate ${isCompact ? 'text-sm text-slate-200' : 'text-sm text-gray-200'}`}>
          {template.label}
        </div>
        {!isCompact && template.defaultProps.description && (
          <div className="text-xs text-gray-400 truncate mt-0.5">
            {template.defaultProps.description}
          </div>
        )}
      </div>

      {onToggleFavorite && (
        <button
          onClick={handleToggleFavorite}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 hover:bg-slate-600/30 rounded-md shrink-0"
          title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Star 
            className={`w-4 h-4 transition-colors ${
              isFavorite 
                ? 'text-amber-400 fill-amber-400' 
                : 'text-slate-400 hover:text-amber-400'
            }`} 
          />
        </button>
      )}
    </div>
  );
};
