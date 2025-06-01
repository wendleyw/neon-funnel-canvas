
import React from 'react';
import { Star } from 'lucide-react';
import { ComponentTemplateItem } from './ComponentTemplateItem';
import { digitalLaunchTemplates } from '../../features/digital-launch/data/templates';
import { componentTemplatesByCategory } from '../../data/componentTemplates';

interface FavoriteTemplatesSectionProps {
  favorites: string[];
  onDragStart: (e: React.DragEvent, template: any) => void;
  onToggleFavorite: (templateType: string) => void;
}

export const FavoriteTemplatesSection: React.FC<FavoriteTemplatesSectionProps> = ({
  favorites,
  onDragStart,
  onToggleFavorite
}) => {
  // Combine all templates from different sources
  const allTemplates = [
    ...digitalLaunchTemplates,
    ...Object.values(componentTemplatesByCategory).flat()
  ];

  const favoriteTemplates = allTemplates.filter(template => 
    favorites.includes(template.type)
  );

  if (favoriteTemplates.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <h3 className="text-sm font-semibold text-gray-300">
            Favoritos
          </h3>
        </div>
        <p className="text-xs text-gray-500 px-2">
          Clique na estrela dos componentes para adicionar aos favoritos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        <h3 className="text-sm font-semibold text-gray-300">
          Favoritos
        </h3>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {favoriteTemplates.map((template) => (
          <ComponentTemplateItem
            key={template.type}
            template={template}
            onDragStart={onDragStart}
            isFavorite={true}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};
