import React, { useState, useMemo } from 'react';
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
import { actionSections } from '../../../data/userActions'; // UserAction type removed if not directly used
import { ComponentTemplateItem } from '../../Sidebar/ComponentTemplateItem';

// Helper function to format category for display as subtitle (can be moved to utils later)
const formatCategoryForSubtitle = (category: string): string => {
  if (!category) return '';
  return category
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface ActionsTabProps {
  onDragStart: (template: ComponentTemplate) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
  // onShapeAdd?: (shape: any) => void; // Removido se não estiver sendo usado em ActionsTab
}

interface CategoryFilter {
  name: string;
  count: number;
}

export const ActionsTab: React.FC<ActionsTabProps> = ({
  onDragStart,
  onTemplateClick
}) => {
  const { t } = useTranslation();
  const { customActions } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  // const isMobile = useIsMobile(); // Removido se não estiver sendo usado

  const { 
    isFavorite, 
    toggleFavorite, 
    getFavoritesByType, 
    getFavoritesCount,
    notification 
  } = useFavorites();

  const allActions = useMemo(() => {
    const userActions = Object.values(actionSections).flatMap(section => section.actions);
    return [...userActions, ...customActions].map(action => ({...action, id: action.id || action.type!}));
  }, [customActions]);

  const favoriteActions = useMemo(() => {
    return getFavoritesByType('action').map(favAction => ({...favAction, id: favAction.id || favAction.type!}));
  }, [getFavoritesByType]);
  
  const availableCategories = useMemo(() => {
    const categories: Record<string, number> = {};
    const sourceForCategories = showOnlyFavorites ? favoriteActions : allActions;
    
    sourceForCategories.forEach(action => {
      const categoryName = formatCategoryForSubtitle(action.category);
      categories[categoryName] = (categories[categoryName] || 0) + 1;
    });
    const catArray = Object.entries(categories).map(([name, count]) => ({ name, count }));
    return [{ name: 'All', count: sourceForCategories.length }, ...catArray.sort((a,b) => a.name.localeCompare(b.name))];
  }, [allActions, favoriteActions, showOnlyFavorites]);

  const memoizedItemTemplates = useMemo(() => {
    let items = showOnlyFavorites ? favoriteActions : allActions;

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
      id: item.id || item.type!, // Ensure id for key consistency
      defaultProps: item.defaultProps || { description: item.description || '' },
      icon: item.icon || '📄',
      subtitle: formatCategoryForSubtitle(item.category),
      tags: item.tags || [],
    }));
  }, [allActions, favoriteActions, searchQuery, selectedCategory, showOnlyFavorites]);

  const handleToggleActionFavorite = (template: ComponentTemplate) => {
    console.log(`[ActionsTab DEBUG] handleToggleActionFavorite called with: ID '${template.id || template.type}', Label: '${template.label}'`, template);
    toggleFavorite(template, 'action');
  };

  const handleItemDragStartInternal = (event: React.DragEvent, template: ComponentTemplate) => {
    event.dataTransfer.setData('application/json', JSON.stringify(template));
    event.dataTransfer.effectAllowed = 'copy';
    onDragStart(template);
  };
  
  const handleToggleFavoritesFilter = () => setShowOnlyFavorites(!showOnlyFavorites);
  const handleClearSearch = () => setSearchQuery('');

  return (
    <div className="h-full flex flex-col bg-black">
      <div className="p-3 border-b border-neutral-700 flex-shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {t('sidebar.actions')}
          </h3>
          {getFavoritesCount('action') > 0 ? (
            <button
              onClick={handleToggleFavoritesFilter}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                showOnlyFavorites 
                  ? 'bg-yellow-500/20 text-yellow-400' 
                  : 'text-gray-400 hover:text-yellow-400'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-current' : ''}`} />
              <span>{getFavoritesCount('action')}</span>
            </button>
          ) : <div className="h-[26px]" />}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder={t('actions.search_placeholder')}
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

              if (expandedCategory && cat.name === 'All') return null;

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
                          const isFav = isFavorite(item as ComponentTemplate, 'action');
                          console.log(`[ActionsTab DEBUG] Rendering EXPANDED item: ID '${item.id || item.type}', Label: '${item.label}', IsFavorite: ${isFav}`, item);
                          return (
                            <ComponentTemplateItem
                              key={item.id}
                              template={item as ComponentTemplate}
                              subtitle={item.subtitle}
                              tags={item.tags || []}
                              onDragStart={handleItemDragStartInternal}
                              isFavorite={isFav}
                              onToggleFavorite={handleToggleActionFavorite}
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
                const isFav = isFavorite(item as ComponentTemplate, 'action');
                console.log(`[ActionsTab DEBUG] Rendering GLOBAL item: ID '${item.id || item.type}', Label: '${item.label}', IsFavorite: ${isFav}`, item);
                return (
                  <ComponentTemplateItem
                    key={item.id}
                    template={item as ComponentTemplate}
                    subtitle={item.subtitle}
                    tags={item.tags || []}
                    onDragStart={handleItemDragStartInternal}
                    isFavorite={isFav}
                    onToggleFavorite={handleToggleActionFavorite}
                  />
                );
              })
          ) : (
            <p className="text-center text-gray-500 text-sm py-6">
              {showOnlyFavorites 
                  ? t('sidebar.no_favorite_items_type').replace('{type}', t('sidebar.actions').toLowerCase())
                  : (searchQuery 
                      ? `${t('sidebar.no_results_search_actions')}: "${searchQuery}"`
                      : (selectedCategory === 'All' && !expandedCategory ? 
                          t('actions.no_actions_available_filtered') : 
                          `${t('sidebar.no_items_in_category_selected')}: ${selectedCategory}`
                        )
                    )
              }
            </p>
          )}
        </div>
      </div>

      {/* Notification Toast */}
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