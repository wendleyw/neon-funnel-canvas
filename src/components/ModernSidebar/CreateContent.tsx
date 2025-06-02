import React from 'react';
import { Search } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { CategorySection } from './CategorySection';
import { ComponentTemplate } from '../../types/funnel';

interface Category {
  id: string;
  name: string;
  icon: string;
  templates: ComponentTemplate[];
}

interface CreateContentProps {
  searchQuery: string;
  favorites: string[];
  favoriteTemplates: ComponentTemplate[];
  filteredCategories: Category[];
  onSearchChange: (query: string) => void;
  onDragStart: (e: React.DragEvent, template: ComponentTemplate) => void;
  onToggleFavorite: (templateType: string) => void;
}

export const CreateContent: React.FC<CreateContentProps> = ({
  searchQuery,
  favorites,
  favoriteTemplates,
  filteredCategories,
  onSearchChange,
  onDragStart,
  onToggleFavorite
}) => {
  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-4">
        {/* Search field */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-gray-900 text-white pl-10 pr-4 py-2 rounded-lg text-sm border border-gray-700 focus:border-gray-500 focus:outline-none"
          />
        </div>

        {/* Favorites Section */}
        {favoriteTemplates.length > 0 && !searchQuery && (
          <CategorySection
            title="FAVORITES"
            icon="⭐"
            templates={favoriteTemplates}
            onDragStart={onDragStart}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            defaultExpanded={true}
          />
        )}

        {/* Categories */}
        {filteredCategories.map((category) => (
          <CategorySection
            key={category.id}
            title={category.name}
            icon={category.icon}
            templates={category.templates}
            onDragStart={onDragStart}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            defaultExpanded={searchQuery.length > 0}
          />
        ))}

        {/* Empty state */}
        {filteredCategories.length === 0 && searchQuery && (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-400 text-sm">
              No components found for "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}; 