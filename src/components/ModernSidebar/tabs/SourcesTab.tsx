import React, { useState, useMemo, useCallback } from 'react';
import { ComponentTemplate } from '../../../types/funnel';
import { 
  Search, 
  Star,
  RotateCcw,
} from 'lucide-react';
import { useIsMobile } from '../../../hooks/use-mobile';
import { useFavorites } from '../../../hooks/use-favorites';
import { useTranslation } from '../../../lib/i18n';
import { useAdmin } from '../../../contexts/AdminContext';
import MARKETING_COMPONENT_TEMPLATES from '../../../data/componentTemplates';
import { ComponentTemplateItem } from '../../Sidebar/ComponentTemplateItem';

interface SourcesTabProps {
  onDragStart: (template: ComponentTemplate) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
}

// Helper function to format category for display as subtitle
const formatCategoryForSubtitle = (category: string | undefined): string => {
  if (!category) return 'Other';
  return category
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface CategoryFilter {
  name: string;
  count: number;
}

export const SourcesTab: React.FC<SourcesTabProps> = ({
  onDragStart,
  onTemplateClick
}) => {
  const { t } = useTranslation();
  const { customSources } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const { 
    isFavorite, 
    toggleFavorite, 
    getFavoritesByType, 
    getFavoritesCount,
    notification 
  } = useFavorites();

  // Get all traffic source templates (including custom ones)
  const allSources = useMemo(() => {
    const baseSources = MARKETING_COMPONENT_TEMPLATES.filter(template => 
      template.tags?.includes('source') || 
      ['website-traffic', 'social-ads', 'seo', 'email-marketing', 'referral', 'offline-ads'].includes(template.type) ||
      template.category?.startsWith('traffic-sources')
    );
    return [...baseSources, ...customSources].map(s => ({ ...s, id: s.id || s.type! }));
  }, [customSources]);

  // Get favorite sources
  const favoriteSources = useMemo(() => {
    const favs = getFavoritesByType('source');
    return favs.map(s => ({ ...s, id: s.id || s.type! }));
  }, [getFavoritesByType]);

  // Derive available categories for filtering
  const availableCategories = useMemo(() => {
    const sourcesToConsider = showOnlyFavorites ? favoriteSources : allSources;
    const categoriesMap = new Map<string, number>();
    
    sourcesToConsider.forEach(source => {
      const categoryName = formatCategoryForSubtitle(source.category);
      categoriesMap.set(categoryName, (categoriesMap.get(categoryName) || 0) + 1);
    });

    const sortedCategories = Array.from(categoriesMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return [{ name: 'All', count: sourcesToConsider.length }, ...sortedCategories];
  }, [allSources, favoriteSources, showOnlyFavorites]);

  const getFilteredSources = useMemo(() => {
    let sourcesToFilter = showOnlyFavorites ? favoriteSources : allSources;

    if (selectedCategory !== 'All') {
      sourcesToFilter = sourcesToFilter.filter(source => 
        formatCategoryForSubtitle(source.category) === selectedCategory
      );
    }

    if (searchQuery) {
      sourcesToFilter = sourcesToFilter.filter(source => 
        source.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (source.description && source.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        source.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return sourcesToFilter;
  }, [allSources, favoriteSources, searchQuery, selectedCategory, showOnlyFavorites]);

  const memoizedItemTemplates = useMemo(() => {
    let items = showOnlyFavorites ? favoriteSources : allSources;

    if (searchQuery) {
      items = items.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }

    if (selectedCategory !== 'All') {
      items = items.filter(item => formatCategoryForSubtitle(item.category) === selectedCategory);
    }
    
    return items.map(item => ({
      ...item,
      id: item.id || item.type!,
      subtitle: formatCategoryForSubtitle(item.category),
    }));
  }, [allSources, favoriteSources, searchQuery, selectedCategory, showOnlyFavorites]);

  // Handler para o toggle de favoritos que recebe o objeto template completo
  const handleToggleSourceFavorite = (template: ComponentTemplate) => {
    console.log(`[SourcesTab DEBUG] handleToggleSourceFavorite called with: ID '${template.id || template.type}', Label: '${template.label}'`, template);
    toggleFavorite(template, 'source');
  };

  const handleItemDragStartInternal = (event: React.DragEvent, template: ComponentTemplate) => {
    event.dataTransfer.setData('application/json', JSON.stringify(template));
    event.dataTransfer.effectAllowed = 'copy';
    onDragStart(template);
  };

  const handleToggleFavoritesFilter = useCallback(() => {
    setShowOnlyFavorites(prev => !prev);
  }, []);
  
  const handleClearSearch = () => setSearchQuery('');

  return (
    <div className="h-full flex flex-col bg-black">
      <div className="p-3 border-b border-neutral-700 flex-shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {t('sidebar.sources')}
          </h3>
          {getFavoritesCount('source') > 0 ? (
            <button
              onClick={handleToggleFavoritesFilter}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                showOnlyFavorites 
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'text-gray-400 hover:text-yellow-400'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-current' : ''}`} />
              <span>{getFavoritesCount('source')}</span>
            </button>
          ) : <div className="h-[26px]" />}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search traffic sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-neutral-700 rounded-md text-sm text-gray-200 placeholder-gray-500 pl-8 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
              aria-label="Clear search"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {availableCategories.length > 1 && !searchQuery && (
          <div className="p-3 space-y-1 border-b border-neutral-700">
            {availableCategories.map(cat => {
              const isActuallyExpanded = !searchQuery && expandedCategory === cat.name && cat.name !== 'All';
              const isActiveFilter = selectedCategory === cat.name;
              
              const isVisuallyActive =
                (isActiveFilter && cat.name === 'All' && !expandedCategory) ||
                isActuallyExpanded ||
                (searchQuery && isActiveFilter && cat.name !== 'All');

              if (expandedCategory && cat.name === 'All') {
                return null;
              }

              const itemsInThisExpandedCategory = isActuallyExpanded 
                ? memoizedItemTemplates.filter(item => formatCategoryForSubtitle(item.category) === cat.name)
                : [];

              return (
                <div key={cat.name}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      if (!searchQuery) {
                        if (cat.name === 'All') {
                          setExpandedCategory(null);
                        } else {
                          setExpandedCategory(prev => (prev === cat.name ? null : cat.name));
                        }
                      } else {
                        setExpandedCategory(null);
                      }
                    }}
                    className={`w-full flex justify-between items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 group
                      border hover:shadow-md
                      ${isVisuallyActive
                        ? 'bg-neutral-800 text-white border-neutral-600 shadow-lg' 
                        : 'bg-black text-gray-300 border-neutral-700 hover:bg-neutral-900 hover:border-neutral-600' 
                      }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${isVisuallyActive ? 'bg-neutral-700 text-gray-200' : 'bg-neutral-800 text-gray-400 group-hover:bg-neutral-700'}`}>
                      {cat.count}
                    </span>
                  </button>

                  {isActuallyExpanded && (
                    <div className="mt-1.5 space-y-2 pl-2 pr-1 py-1.5 border-l-2 border-neutral-700 bg-neutral-900/30 rounded-r-md">
                      {itemsInThisExpandedCategory.length > 0 ? (
                        itemsInThisExpandedCategory.map(item => {
                          const isFav = isFavorite(item as ComponentTemplate, 'source');
                          console.log(`[SourcesTab DEBUG] Rendering EXPANDED item: ID '${item.id || item.type}', Label: '${item.label}', IsFavorite: ${isFav}`, item);
                          return (
                            <ComponentTemplateItem
                              key={item.id}
                              template={item as ComponentTemplate}
                              subtitle={item.subtitle}
                              tags={item.tags || []}
                              onDragStart={handleItemDragStartInternal}
                              isFavorite={isFav}
                              onToggleFavorite={handleToggleSourceFavorite}
                            />
                          );
                        })
                      ) : (
                        <p className="text-xs text-gray-500 px-2 py-1">
                          {`${t('sidebar.no_items_in_category')}: ${cat.name}`}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="p-3 space-y-2">
          {memoizedItemTemplates.length > 0 ? (
            memoizedItemTemplates
              .filter(item => searchQuery || !expandedCategory || formatCategoryForSubtitle(item.category) !== expandedCategory)
              .map(item => {
                const isFav = isFavorite(item as ComponentTemplate, 'source');
                console.log(`[SourcesTab DEBUG] Rendering GLOBAL item: ID '${item.id || item.type}', Label: '${item.label}', IsFavorite: ${isFav}`, item);
                return (
                  <ComponentTemplateItem
                    key={item.id}
                    template={item as ComponentTemplate}
                    subtitle={item.subtitle}
                    tags={item.tags || []}
                    onDragStart={handleItemDragStartInternal}
                    isFavorite={isFav}
                    onToggleFavorite={handleToggleSourceFavorite}
                  />
                );
              })
          ) : (
            <p className="text-center text-gray-500 text-sm py-6">
              {showOnlyFavorites 
                  ? t('sidebar.no_favorite_items_type').replace('{type}', t('sidebar.sources').toLowerCase())
                  : (searchQuery 
                      ? `${t('sidebar.no_results_search_sources')}: "${searchQuery}"`
                      : t('sources.no_sources_available_filtered')
                    )
              }
            </p>
          )}
        </div>
      </div>

      {notification && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform translate-y-0 opacity-100 ${
          notification.type === 'added' 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          <div className="flex items-center gap-2">
            <Star className={`w-4 h-4 ${notification.type === 'added' ? 'fill-current' : ''}`} />
            {notification.message}
          </div>
        </div>
      )}
    </div>
  );
};
