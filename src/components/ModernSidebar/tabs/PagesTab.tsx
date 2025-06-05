import React, { useState } from 'react';
import { ComponentTemplate } from '../../../types/funnel';
import { Search, Filter, Star, RotateCcw } from 'lucide-react';
import { useIsMobile } from '../../../hooks/use-mobile';
import { useFavorites } from '../../../hooks/use-favorites';
import { PageTemplateGrid } from './PageTemplateGrid';
import { pageTemplates, PageTemplate } from '../../../data/pageTemplates';

interface PagesTabProps {
  onDragStart: (template: ComponentTemplate) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
}

// Helper to convert PageTemplate to ComponentTemplate for favorites
const pageToComponentTemplate = (page: PageTemplate): ComponentTemplate => ({
  id: page.id,
  type: page.type,
  icon: page.type,
  label: page.label,
  color: page.color,
  category: page.category,
  title: page.label,
  description: page.description,
  defaultProps: {
    title: page.label,
    description: page.description,
    status: 'active',
    properties: { page_type: page.type, tags: page.tags }
  }
});

// Helper to convert ComponentTemplate back to PageTemplate
const componentToPageTemplate = (template: ComponentTemplate): PageTemplate | null => {
  return pageTemplates.find(page => page.type === template.type) || null;
};

export const PagesTab: React.FC<PagesTabProps> = ({
  onDragStart,
  onTemplateClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const isMobile = useIsMobile();

  const { 
    isFavorite, 
    toggleFavorite, 
    getFavoritesByType, 
    getFavoritesCount,
    notification 
  } = useFavorites();

  // Extract unique categories from page templates
  const categories = ['all', ...Array.from(new Set(pageTemplates.map(template => template.category)))];

  // Get favorite pages and convert back to PageTemplate
  const favoriteTemplates = getFavoritesByType('page');
  const favoritePages = favoriteTemplates
    .map(template => componentToPageTemplate(template))
    .filter((page): page is PageTemplate => page !== null);

  // Filter templates based on search, category, and favorites
  const getFilteredTemplates = () => {
    let templates = showOnlyFavorites ? favoritePages : pageTemplates;

    const matchesSearch = (template: PageTemplate) =>
      template.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = (template: PageTemplate) =>
      selectedCategory === 'all' || template.category === selectedCategory;
    
    return templates.filter(template => matchesSearch(template) && matchesCategory(template));
  };

  const filteredTemplates = getFilteredTemplates();

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'all': 'All',
      'lead-sales': 'Lead & Sales',
      'engagement-content': 'Engagement',
      'member-book': 'Member & Book',
      'utility': 'Utility'
    };
    return labels[category] || category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' '); // Fallback for any unmapped or new categories
  };

  // Custom handlers for page favorites
  const handleToggleFavorite = (template: PageTemplate) => {
    const componentTemplate = pageToComponentTemplate(template);
    console.log(`[PagesTab DEBUG] handleToggleFavorite called with (converted to ComponentTemplate): ID '${componentTemplate.id || componentTemplate.type}', Label: '${componentTemplate.label}'`, componentTemplate);
    toggleFavorite(componentTemplate, 'page');
  };

  const handleIsFavorite = (template: PageTemplate): boolean => {
    const componentTemplate = pageToComponentTemplate(template);
    const isFav = isFavorite(componentTemplate, 'page');
    console.log(`[PagesTab DEBUG] handleIsFavorite called with (converted to ComponentTemplate): ID '${componentTemplate.id || componentTemplate.type}', Label: '${componentTemplate.label}', IsFavorite: ${isFav}`, componentTemplate);
    return isFav;
  };

  // Handler para onDragStart do PageTemplateGrid
  const handleGridDragStart = (pageTemplate: PageTemplate) => {
    const componentTemplate = pageToComponentTemplate(pageTemplate);
    onDragStart(componentTemplate);
  };

  // Handler para onTemplateClick do PageTemplateGrid
  const handleGridTemplateClick = (pageTemplate: PageTemplate) => {
    if (onTemplateClick) {
      const componentTemplate = pageToComponentTemplate(pageTemplate);
      onTemplateClick(componentTemplate);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Search Section */}
      <div className="p-3 border-b border-neutral-700 flex-shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">PAGES</h3>
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
            {getFavoritesCount('page') === 0 && <div className="h-[26px]" />}
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
      <div className="flex-1 min-h-0">
        {filteredTemplates.length > 0 ? (
          <PageTemplateGrid
            templates={filteredTemplates}
            onDragStart={handleGridDragStart}
            onTemplateClick={onTemplateClick ? handleGridTemplateClick : undefined}
            showFavorites={true}
            isFavorite={handleIsFavorite}
            toggleFavorite={handleToggleFavorite}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
            {showOnlyFavorites ? (
              <>
                <Star className="w-12 h-12 text-gray-600 mb-3" />
                <h3 className="text-white font-medium mb-1 text-sm">No favorite pages yet</h3>
                <p className="text-gray-400 text-xs mb-3">
                  Star some page templates to save them here
                </p>
                <button
                  onClick={() => setShowOnlyFavorites(false)}
                  className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
                >
                  Browse all pages
                </button>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-3">
                  <Search className="w-6 h-6 text-gray-500" />
                </div>
                <h3 className="text-white font-medium mb-1 text-sm">No templates found</h3>
                <p className="text-gray-400 text-xs mb-3">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
                >
                  Clear filters
                </button>
              </>
            )}
          </div>
        )}
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