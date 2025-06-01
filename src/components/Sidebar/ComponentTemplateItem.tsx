
import React from 'react';
import { ComponentTemplate } from '../../types/funnel';

interface ComponentTemplateItemProps {
  template: ComponentTemplate;
  onDragStart: (e: React.DragEvent, template: ComponentTemplate) => void;
  onRemove?: () => void;
  isCustom?: boolean;
}

export const ComponentTemplateItem: React.FC<ComponentTemplateItemProps> = ({
  template,
  onDragStart,
  onRemove,
  isCustom = false
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, template);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="group relative flex items-center gap-2 p-2 rounded-md cursor-grab hover:bg-gray-800/70 transition-colors border border-gray-700/50 hover:border-gray-600"
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-lg flex-shrink-0">{template.icon}</span>
        <span className="text-xs text-gray-300 truncate font-medium">
          {template.label}
        </span>
      </div>
      
      {isCustom && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 p-1"
          title="Remover componente"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
      
      <div 
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-r ${template.color} opacity-60`}
      />
    </div>
  );
};
