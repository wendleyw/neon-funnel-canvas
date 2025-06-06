import React, { useState, useMemo } from 'react';
import { ComponentTemplate } from '../../../types/funnel';
import { Search, Filter, Star, RotateCcw } from 'lucide-react';
import { useIsMobile } from '@/features/shared/hooks/use-mobile';
import { useFavorites } from '../hooks/use-favorites';
import { useOptimizedTemplateContext } from '../../../contexts/OptimizedTemplateContext';
import { ComponentTemplateItem } from '../components/ComponentTemplateItem';

interface PagesTabProps {
  onDragStart: (e: React.DragEvent, template: ComponentTemplate) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
}

export const PagesTab: React.FC<PagesTabProps> = ({
  onDragStart,
  onTemplateClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['pages-lead-sales', 'pages-content-engagement']));
  const isMobile = useIsMobile();

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

  // Filtrar apenas templates do tipo 'page' do Context
  const pageTemplates = useMemo(() => {
    return componentTemplates.filter(t => 
      // Usar originalType se disponível, caso contrário fallback para categoria
      t.originalType === 'page' ||
      // Fallback: identificar pages por category se originalType não estiver disponível
      (!t.originalType && (
        t.category?.includes('page') || 
        t.category?.includes('lead') ||
        t.category?.includes('sales') ||
        t.category?.includes('engagement') ||
        t.category?.includes('content') ||
        t.category?.includes('member') ||
        t.category?.includes('book') ||
        t.category?.includes('utility') ||
        t.category === 'social-media' ||
        // Se não tem originalType e não é source nem action, provavelmente é page
        (!t.category?.includes('source') && 
         !t.category?.includes('traffic') &&
         !t.category?.includes('action') &&
         !t.category?.includes('nurturing') &&
         !t.category?.includes('automation'))
      ))
    );
  }, [componentTemplates]);

  // Extract unique categories from page templates
  const categories = useMemo(() => {
    const cats = Array.from(new Set(pageTemplates.map(template => template.category || 'other')));
    return ['all', ...cats.sort()];
  }, [pageTemplates]);

  // Get favorite pages
  const favoriteTemplates = useMemo(() => {
    return pageTemplates.filter(t => isFavorite(t, 'page'));
  }, [pageTemplates, isFavorite]);

  // Filter templates based on search, category, and favorites
  const filteredTemplates = useMemo(() => {
    let templates = showOnlyFavorites ? favoriteTemplates : pageTemplates;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(template =>
        template.label.toLowerCase().includes(query) ||
        template.description?.toLowerCase().includes(query) ||
        template.category?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'all') {
      templates = templates.filter(template => 
        (template.category || 'other') === selectedCategory
      );
    }
    
    return templates;
  }, [pageTemplates, favoriteTemplates, searchQuery, selectedCategory, showOnlyFavorites]);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'all': 'All',
      'lead-sales': 'Lead & Sales',
      'lead-capture': 'Lead Capture',
      'sales-conversion': 'Sales Conversion',
      'engagement-content': 'Engagement',
      'member-book': 'Member & Book',
      'utility': 'Utility',
      'social-media': 'Social Media',
      'page': 'Landing Pages',
      'other': 'Other'
    };
    return labels[category] || category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
  };

  // Custom handlers for page favorites
  const handleToggleFavorite = (template: ComponentTemplate) => {
    toggleFavorite(template, 'page');
  };

  const handleIsFavorite = (template: ComponentTemplate): boolean => {
    return isFavorite(template, 'page');
  };

  // Handler para onDragStart
  const handleDragStart = (e: React.DragEvent, template: ComponentTemplate) => {
    onDragStart(e, template);
  };

  // Handler para onTemplateClick
  const handleTemplateClick = (template: ComponentTemplate) => {
    if (onTemplateClick) {
      onTemplateClick(template);
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-400">Loading pages...</div>;

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Search Section */}
      <div className="p-3 border-b border-neutral-700 flex-shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            PAGES ({filteredTemplates.length})
          </h3>
          <div className="flex items-center gap-1">
            {getFavoritesCount('page') > 0 && (
              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                  showOnlyFavorites 
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'text-gray-400 hover:text-yellow-400'
                }`}
                title={showOnlyFavorites ? 'Show all pages' : 'Show only favorites'}
              >
                <Star className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-current' : ''}`} />
                <span>{getFavoritesCount('page')}</span>
              </button>
            )}
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder={showOnlyFavorites ? "Search favorite templates..." : "Search templates..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-neutral-700 rounded-md text-sm text-gray-200 placeholder-gray-500 pl-8 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
              aria-label="Clear search"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-3 py-1.5 border-b border-gray-800 bg-gray-900/10 flex-shrink-0">
        <div className="flex items-center gap-1.5 mb-1">
          <Filter className="w-2 h-2 text-gray-400" />
          <span className="text-xs font-medium text-gray-300">Categories</span>
          <span className="text-xs text-blue-400">
            {filteredTemplates.length} templates
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-1.5 py-0.5 text-xs rounded transition-all duration-200 font-medium
                ${selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-sm scale-105'
                  : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/70 hover:text-white border border-gray-700/50 hover:border-gray-600'
                }
              `}
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>
      </div>

      {/* Page Templates Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {filteredTemplates.map((template) => (
              <div
                key={`${template.type}-${template.id || Math.random()}`}
                className="bg-gray-900 border border-gray-700 rounded-lg p-3 hover:border-gray-600 transition-all duration-200 cursor-pointer group"
                onClick={() => handleTemplateClick(template)}
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify(template));
                  e.dataTransfer.effectAllowed = 'copy';
                  handleDragStart(e, template);
                }}
                draggable
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-white text-sm group-hover:text-blue-300 transition-colors">
                      {template.label}
                    </h4>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                      {template.description || 'No description available'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(template);
                    }}
                    className={`ml-2 p-1 rounded transition-colors ${
                      handleIsFavorite(template)
                        ? 'text-yellow-400 hover:text-yellow-300'
                        : 'text-gray-500 hover:text-yellow-400'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${handleIsFavorite(template) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                    {getCategoryLabel(template.category || 'other')}
                  </span>
                  {template.isPremium && (
                    <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                      Premium
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-sm py-8">
            {searchQuery || selectedCategory !== 'all' 
              ? 'No pages found matching your filters.' 
              : 'No page templates available.'
            }
            <div className="mt-2 text-xs text-gray-600">
              Try importing system templates from the admin panel.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 