import React, { useState } from 'react';
import { ComponentTemplate } from '../../../types/funnel';
import { Search, Filter } from 'lucide-react';
import { useIsMobile } from '../../../hooks/use-mobile';
import { PageTemplateGrid } from './PageTemplateGrid';
import { pageTemplates } from '../../../data/pageTemplates';

interface PagesTabProps {
  onDragStart: (template: ComponentTemplate) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
}

export const PagesTab: React.FC<PagesTabProps> = ({
  onDragStart,
  onTemplateClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const isMobile = useIsMobile();

  // Extract unique categories from page templates
  const categories = ['all', ...Array.from(new Set(pageTemplates.map(template => template.category)))];

  // Filter templates based on search and category
  const filteredTemplates = pageTemplates.filter(template => {
    const matchesSearch = template.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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

  return (
    <div className="h-full flex flex-col">
      {/* Search Section */}
      <div className="p-3 border-b border-gray-800 bg-gray-900/20 flex-shrink-0">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
          <input
            type="text"
            placeholder="Search templates..."
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
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
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
          </div>
        )}
      </div>
    </div>
  );
}; 