
import React, { useCallback } from 'react';
import { ComponentTemplate } from '../../types/funnel';

interface ComponentTemplateItemProps {
  template: ComponentTemplate;
  onDragStart: (e: React.DragEvent, template: ComponentTemplate) => void;
  isCustom?: boolean;
  onRemove?: () => void;
}

export const ComponentTemplateItem = React.memo<ComponentTemplateItemProps>(({ 
  template, 
  onDragStart, 
  isCustom, 
  onRemove 
}) => {
  const handleDragStart = useCallback((e: React.DragEvent) => {
    onDragStart(e, template);
  }, [onDragStart, template]);

  return (
    <div
      key={template.type}
      draggable
      onDragStart={handleDragStart}
      className="flex items-center p-3 bg-gray-900 rounded border border-gray-800 cursor-grab hover:bg-gray-800 hover:border-gray-700 transition-all active:cursor-grabbing group"
    >
      <div 
        className="w-8 h-8 rounded flex items-center justify-center text-white text-sm mr-3"
        style={{ backgroundColor: template.color }}
      >
        {template.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium text-sm truncate">{template.label}</h4>
        <p className="text-gray-400 text-xs truncate">{template.defaultData.description}</p>
      </div>
      {isCustom && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all ml-2"
        >
          ×
        </button>
      )}
    </div>
  );
});

ComponentTemplateItem.displayName = 'ComponentTemplateItem';
