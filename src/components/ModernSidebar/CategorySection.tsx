
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Heart } from 'lucide-react';
import { ComponentTemplate } from '../../types/funnel';

interface CategorySectionProps {
  title: string;
  icon: string;
  templates: ComponentTemplate[];
  onDragStart: (e: React.DragEvent, template: ComponentTemplate) => void;
  favorites: string[];
  onToggleFavorite: (templateType: string) => void;
  defaultExpanded?: boolean;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  icon,
  templates,
  onDragStart,
  favorites,
  onToggleFavorite,
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-left text-gray-300 hover:text-white hover:bg-gray-900/50 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <span className="font-medium text-sm uppercase tracking-wider">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-1">
          {templates.map((template) => (
            <div
              key={template.type}
              draggable
              onDragStart={(e) => onDragStart(e, template)}
              className="flex items-center justify-between p-2 mx-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded cursor-grab active:cursor-grabbing transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">{template.icon}</span>
                <span className="text-sm">{template.name}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(template.type);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart
                  className={`w-4 h-4 ${
                    favorites.includes(template.type)
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-500 hover:text-red-500'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
