import React, { useState } from 'react';
import { ComponentTemplate } from '../../../types/funnel';
import { Search, Filter, Star } from 'lucide-react';
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
    properties: {}
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
    getFavoritesCount 
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
      'lead-capture': 'Lead',
      'sales': 'Sales',
      'webinar': 'Webinar',
      'engagement': 'Engage',
      'booking': 'Book',
      'content': 'Content',
      'membership': 'Member',
      'confirmation': 'Confirm',
      'popup': 'Popup'
    };
    return labels[category] || category;
  };

  // Custom handlers for page favorites
  const handleToggleFavorite = (template: ComponentTemplate, type: 'source' | 'page' | 'action') => {
    toggleFavorite(template, type);
  };

  const handleIsFavorite = (template: ComponentTemplate, type: 'source' | 'page' | 'action') => {
    return isFavorite(template, type);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search Section */}
      <div className="p-3 border-b border-gray-800 bg-gray-900/20 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-white">Pages</h2>
          <div className="flex items-center gap-1">
            {getFavoritesCount('page') > 0 && (
              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                  showOnlyFavorites 
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                    : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
                }`}
                title={showOnlyFavorites ? 'Show all pages' : 'Show only favorites'}
              >
                <Star className={`w-3 h-3 ${showOnlyFavorites ? 'fill-current' : ''}`} />
                <span>{getFavoritesCount('page')}</span>
              </button>
            )}
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
          <input
            type="text"
            placeholder={showOnlyFavorites ? "Search favorite templates..." : "Search templates..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800/60 border border-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-white transition-colors text-xs"
            >
              ✕
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
            onDragStart={onDragStart}
            onTemplateClick={onTemplateClick}
            showFavorites={true}
            isFavorite={(template) => handleIsFavorite(pageToComponentTemplate(template), 'page')}
            toggleFavorite={(template) => handleToggleFavorite(pageToComponentTemplate(template), 'page')}
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
    </div>
  );
}; 