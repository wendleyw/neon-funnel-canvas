
import React, { useState, useCallback, useMemo } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { ModernSidebarHeader } from './ModernSidebarHeader';
import { QuickActionsSection } from './QuickActionsSection';
import { CategorySection } from './CategorySection';
import { ModernSidebarStatusBar } from './ModernSidebarStatusBar';
import { ReadyTemplatesModal } from '../ReadyTemplates/ReadyTemplatesModal';
import { ComponentTemplate } from '../../types/funnel';
import { FunnelComponent, Connection } from '../../types/funnel';
import { modernSidebarCategories, searchModernTemplates } from '../../data/modernSidebarCategories';

interface ModernSidebarProps {
  onDragStart: (template: ComponentTemplate) => void;
  onAddCompleteTemplate?: (components: FunnelComponent[], connections: Connection[]) => void;
  componentCount?: number;
  connectionCount?: number;
}

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  onDragStart,
  onAddCompleteTemplate,
  componentCount = 0,
  connectionCount = 0
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['offer', 'target-audience', 'lead-capture']);
  const [isReadyTemplatesOpen, setIsReadyTemplatesOpen] = useState(false);

  const handleDragStart = useCallback((e: React.DragEvent, template: ComponentTemplate) => {
    console.log('Starting drag for template:', template);
    e.dataTransfer.setData('application/json', JSON.stringify(template));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(template);
  }, [onDragStart]);

  const toggleFavorite = useCallback((templateType: string) => {
    setFavorites(prev => 
      prev.includes(templateType) 
        ? prev.filter(t => t !== templateType)
        : [...prev, templateType]
    );
  }, []);

  const handleReadyTemplateSelect = useCallback((components: FunnelComponent[], connections: Connection[]) => {
    if (onAddCompleteTemplate) {
      onAddCompleteTemplate(components, connections);
    }
  }, [onAddCompleteTemplate]);

  // Filtrar templates baseado na busca
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return modernSidebarCategories;
    }

    const searchResults = searchModernTemplates(searchQuery);
    const filteredCats: typeof modernSidebarCategories = {};

    Object.entries(modernSidebarCategories).forEach(([key, category]) => {
      const categoryTemplates = category.templates.filter(template =>
        searchResults.some(result => result.type === template.type)
      );
      
      if (categoryTemplates.length > 0) {
        filteredCats[key as keyof typeof modernSidebarCategories] = {
          ...category,
          templates: categoryTemplates
        };
      }
    });

    return filteredCats;
  }, [searchQuery]);

  // Templates favoritos
  const favoriteTemplates = useMemo(() => {
    const allTemplates = Object.values(modernSidebarCategories).flatMap(cat => cat.templates);
    return allTemplates.filter(template => favorites.includes(template.type));
  }, [favorites]);

  return (
    <ErrorBoundary>
      <div className="w-80 h-full bg-gradient-to-b from-slate-800/20 to-slate-900/40 backdrop-blur-sm border-r border-slate-700/50 flex flex-col">
        <ModernSidebarHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <QuickActionsSection
          onTemplatesClick={() => setIsReadyTemplatesOpen(true)}
          favoriteCount={favorites.length}
        />

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-slate-800/50 scrollbar-thumb-slate-600/50">
          {/* Seção de Favoritos */}
          {favoriteTemplates.length > 0 && !searchQuery && (
            <CategorySection
              title="FAVORITOS"
              icon="⭐"
              templates={favoriteTemplates}
              onDragStart={handleDragStart}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              defaultExpanded={true}
            />
          )}

          {/* Categorias */}
          {Object.values(filteredCategories).map((category) => (
            <CategorySection
              key={category.id}
              title={category.title}
              icon={category.icon}
              templates={category.templates}
              onDragStart={handleDragStart}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              defaultExpanded={searchQuery.length > 0}
            />
          ))}

          {/* Estado vazio */}
          {Object.keys(filteredCategories).length === 0 && searchQuery && (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-slate-400 text-sm">
                Nenhum componente encontrado para "{searchQuery}"
              </p>
            </div>
          )}
        </div>

        <ModernSidebarStatusBar
          componentCount={componentCount}
          connectionCount={connectionCount}
        />

        <ReadyTemplatesModal
          isOpen={isReadyTemplatesOpen}
          onClose={() => setIsReadyTemplatesOpen(false)}
          onTemplateSelect={handleReadyTemplateSelect}
        />
      </div>
    </ErrorBoundary>
  );
};
