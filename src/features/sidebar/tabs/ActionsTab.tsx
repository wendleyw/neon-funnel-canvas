import React, { useState, useMemo } from 'react';
import { ComponentTemplate } from '../../../types/funnel';
import { 
  Search, 
  Star,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import { useIsMobile } from '@/features/shared/hooks/use-mobile';
import { useFavorites } from '../hooks/use-favorites';
import { useTranslation } from '../../../lib/i18n';
import { useOptimizedTemplateContext } from '../../../contexts/OptimizedTemplateContext';
import { ComponentTemplateItem } from '../components/ComponentTemplateItem';

// Helper function to format category for display as subtitle
const formatCategoryForSubtitle = (category: string): string => {
  if (!category) return '';
  return category
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface ActionsTabProps {
  onDragStart: (e: React.DragEvent, template: ComponentTemplate) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['automation-email', 'automation-workflows']));

  const {
    componentTemplates,
    loading,
    getTemplatesByType
  } = useOptimizedTemplateContext();

  const { 
    isFavorite, 
    toggleFavorite, 
    getFavoritesByType, 
    getFavoritesCount,
    notification 
  } = useFavorites();

  // Filtrar apenas templates do tipo 'action' do Context
  const actionTemplates = useMemo(() => {
    return componentTemplates.filter(t => 
      // Usar originalType se disponível, caso contrário fallback para categoria
      t.originalType === 'action' ||
      // Fallback: identificar actions por category se originalType não estiver disponível
      (!t.originalType && (
        t.category?.includes('action') || 
        t.category?.includes('nurturing') ||
        t.category?.includes('automation') ||
        t.category?.includes('sequence') ||
        t.category?.includes('workflow') ||
        t.category?.includes('launch') ||
        t.category === 'digital-launch' ||
        t.label?.toLowerCase().includes('automation') ||
        t.label?.toLowerCase().includes('sequence') ||
        t.label?.toLowerCase().includes('nurturing')
      ))
    );
  }, [componentTemplates]);

  const favoriteActions = useMemo(() => {
    return actionTemplates.filter(t => isFavorite(t, 'action'));
  }, [actionTemplates, isFavorite]);
  
  const availableCategories = useMemo(() => {
    const categories: Record<string, number> = {};
    const sourceForCategories = showFavoritesOnly ? favoriteActions : actionTemplates;
    
    sourceForCategories.forEach(action => {
      const categoryName = formatCategoryForSubtitle(action.category || 'other');
      categories[categoryName] = (categories[categoryName] || 0) + 1;
    });
    const catArray = Object.entries(categories).map(([name, count]) => ({ name, count }));
    return [{ name: 'All', count: sourceForCategories.length }, ...catArray.sort((a,b) => a.name.localeCompare(b.name))];
  }, [actionTemplates, favoriteActions, showFavoritesOnly]);

  const filteredActions = useMemo(() => {
    let items = showFavoritesOnly ? favoriteActions : actionTemplates;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.label.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.category && item.category.toLowerCase().includes(query))
      );
    }

    if (expandedCategories.size > 0) {
      items = items.filter(item => expandedCategories.has(formatCategoryForSubtitle(item.category || 'other').toLowerCase()));
    }
    
    return items;
  }, [actionTemplates, favoriteActions, searchQuery, expandedCategories, showFavoritesOnly]);

  const handleToggleActionFavorite = (template: ComponentTemplate) => {
    toggleFavorite(template, 'action');
  };

  const handleItemDragStartInternal = (event: React.DragEvent, template: ComponentTemplate) => {
    event.dataTransfer.setData('application/json', JSON.stringify(template));
    event.dataTransfer.effectAllowed = 'copy';
    onDragStart(event, template);
  };
  
  const handleToggleFavoritesFilter = () => setShowFavoritesOnly(!showFavoritesOnly);
  const handleClearSearch = () => setSearchQuery('');

  if (loading) return <div className="p-4 text-center text-gray-400">Loading actions...</div>;
  if (notification) return <div className={`fixed bottom-4 right-4 z-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform translate-y-0 opacity-100 ${
    notification.type === 'added' 
      ? 'bg-green-600 text-white' 
      : 'bg-red-600 text-white'
  }`}>
    <div className="flex items-center gap-2">
      <Star className={`w-4 h-4 ${notification.type === 'added' ? 'fill-current' : ''}`} />
      {notification.message}
    </div>
  </div>;

  return (
    <div className="h-full flex flex-col bg-black">
      <div className="p-3 border-b border-neutral-700 flex-shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Actions ({filteredActions.length})
          </h3>
          {getFavoritesCount('action') > 0 ? (
            <button
              onClick={handleToggleFavoritesFilter}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                showFavoritesOnly 
                  ? 'bg-yellow-500/20 text-yellow-400' 
                  : 'text-gray-400 hover:text-yellow-400'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              <span>{getFavoritesCount('action')}</span>
            </button>
          ) : <div className="h-[26px]" />}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search actions and automations..."
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
              const isActuallyExpanded = !searchQuery && expandedCategories.has(cat.name.toLowerCase());
              const isActiveFilter = expandedCategories.has(cat.name.toLowerCase());
              
              const isVisuallyActive =
                (isActiveFilter && cat.name === 'All' && !expandedCategories.size) ||
                isActuallyExpanded ||
                (searchQuery && isActiveFilter && cat.name !== 'All');

              if (expandedCategories.size > 0 && cat.name === 'All') return null;

              const itemsInThisExpandedCategory = isActuallyExpanded 
                ? filteredActions.filter(item => formatCategoryForSubtitle(item.category || 'other') === cat.name)
                : [];

              return (
                <div key={cat.name}>
                  <button
                    onClick={() => {
                      if (!searchQuery) {
                        if (cat.name === 'All') {
                          setExpandedCategories(new Set());
                        } else {
                          setExpandedCategories(prev => {
                            const newSet = new Set(prev);
                            if (isActiveFilter) {
                              newSet.delete(cat.name.toLowerCase());
                            } else {
                              newSet.add(cat.name.toLowerCase());
                            }
                            return newSet;
                          });
                        }
                      } else {
                        setExpandedCategories(new Set());
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
                    <span className="text-xs bg-neutral-700 text-gray-300 px-2 py-0.5 rounded-full ml-2">
                      {cat.count}
                    </span>
                  </button>

                  {/* Expanded Category Items */}
                  {isActuallyExpanded && (
                    <div className="mt-2 pl-4 space-y-2">
                      {itemsInThisExpandedCategory.map(template => (
                        <ComponentTemplateItem
                          key={`${template.type}-${template.id || Math.random()}`}
                          template={template}
                          subtitle={formatCategoryForSubtitle(template.category || 'other')}
                          onDragStart={(e) => handleItemDragStartInternal(e, template)}
                          isFavorite={isFavorite(template, 'action')}
                          onToggleFavorite={() => handleToggleActionFavorite(template)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Direct items listing when no category is expanded or when searching */}
        {(expandedCategories.size === 0 || searchQuery) && (
          <div className="p-3 space-y-2">
            {filteredActions.map(template => (
              <ComponentTemplateItem
                key={`${template.type}-${template.id || Math.random()}`}
                template={template}
                subtitle={formatCategoryForSubtitle(template.category || 'other')}
                onDragStart={(e) => handleItemDragStartInternal(e, template)}
                isFavorite={isFavorite(template, 'action')}
                onToggleFavorite={() => handleToggleActionFavorite(template)}
              />
            ))}
            
            {filteredActions.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-6">
                {searchQuery ? 'No actions found matching your search.' : 'No action templates available.'}
                <div className="mt-2 text-xs text-gray-600">
                  Try importing system templates from the admin panel.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 