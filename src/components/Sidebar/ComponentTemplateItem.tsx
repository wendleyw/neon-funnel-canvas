
import React from 'react';
import { ComponentTemplate } from '../../types/funnel';
import { Star, X } from 'lucide-react';

interface ComponentTemplateItemProps {
  template: ComponentTemplate;
  onDragStart: (e: React.DragEvent, template: ComponentTemplate) => void;
  isCustom?: boolean;
  onRemove?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (templateType: string) => void;
  isCompact?: boolean;
}

export const ComponentTemplateItem = React.memo<ComponentTemplateItemProps>(({
  template,
  onDragStart,
  isCustom = false,
  onRemove,
  isFavorite = false,
  onToggleFavorite,
  isCompact = false
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, template);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onToggleFavorite) {
      onToggleFavorite(template.type);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onRemove) {
      onRemove();
    }
  };

  const baseClasses = isCompact 
    ? "flex items-center gap-2 p-2 rounded-md cursor-grab hover:bg-gray-800/50 transition-colors group border border-gray-700/50"
    : "flex items-center gap-3 p-3 rounded-lg cursor-grab hover:bg-gray-800/50 transition-colors group border border-gray-700/50";

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={baseClasses}
      style={{ borderLeftColor: template.color }}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className={isCompact ? "text-sm" : "text-base"}>{template.icon}</span>
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium text-gray-200 truncate ${isCompact ? 'text-xs' : 'text-sm'}`}>
            {template.label}
          </h4>
          {!isCompact && (
            <p className="text-xs text-gray-400 truncate">
              Arrastar para o canvas
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onToggleFavorite && (
          <button
            onClick={handleToggleFavorite}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
            title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Star 
              className={`w-3 h-3 ${isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} 
            />
          </button>
        )}
        
        {isCustom && onRemove && (
          <button
            onClick={handleRemove}
            className="p-1 rounded hover:bg-red-600 transition-colors"
            title="Remover componente"
          >
            <X className="w-3 h-3 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
});

ComponentTemplateItem.displayName = 'ComponentTemplateItem';
