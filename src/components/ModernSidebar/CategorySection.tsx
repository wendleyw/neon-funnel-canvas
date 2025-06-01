
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ComponentTemplateItem } from '../Sidebar/ComponentTemplateItem';
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

  if (templates.length === 0) return null;

  return (
    <div className="border-b border-slate-700/30 last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <div className="text-left">
            <span className="text-sm font-medium text-slate-200">{title}</span>
            <span className="block text-xs text-slate-400">{templates.length} componentes</span>
          </div>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-3 space-y-2">
          {templates.map((template) => (
            <ComponentTemplateItem
              key={template.type}
              template={template}
              onDragStart={onDragStart}
              isFavorite={favorites.includes(template.type)}
              onToggleFavorite={onToggleFavorite}
              isCompact
            />
          ))}
        </div>
      )}
    </div>
  );
};
