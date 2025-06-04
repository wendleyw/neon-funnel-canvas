import React, { useState } from 'react';
import { ComponentTemplate } from '../../../types/funnel';
import { Search, Star, Plus } from 'lucide-react';
import { useIsMobile } from '../../../hooks/use-mobile';
import { useFavorites } from '../../../hooks/use-favorites';
import MARKETING_COMPONENT_TEMPLATES from '../../../data/componentTemplates';

interface SourcesTabProps {
  onDragStart: (template: ComponentTemplate) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
}

export const SourcesTab: React.FC<SourcesTabProps> = ({
  onDragStart,
  onTemplateClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const isMobile = useIsMobile();

  const { 
    isFavorite, 
    toggleFavorite, 
    getFavoritesByType, 
    getFavoritesCount 
  } = useFavorites();

  // Get all traffic source templates
  const allSources = MARKETING_COMPONENT_TEMPLATES.filter(template => 
    template.category?.includes('traffic-sources')
  );

  // Get favorite sources
  const favoriteTemplates = getFavoritesByType('source');
  const favoriteSources = favoriteTemplates.filter(template =>
    allSources.some(source => source.type === template.type)
  );

  // Filter sources based on search and favorites
  const getFilteredSources = () => {
    let sources = showOnlyFavorites ? favoriteSources : allSources;
    
    if (searchQuery) {
      sources = sources.filter(source => 
        source.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        source.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        source.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return sources;
  };

  const filteredSources = getFilteredSources();

  const handleDragStart = (e: React.DragEvent, template: ComponentTemplate) => {
    e.dataTransfer.setData('application/json', JSON.stringify(template));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(template);
  };

  const handleTemplateClick = (template: ComponentTemplate) => {
    if (onTemplateClick) {
      onTemplateClick(template);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent, template: ComponentTemplate) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(template, 'source');
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('paid')) return '📱';
    if (category.includes('social')) return '📱';
    if (category.includes('search')) return '🔍';
    if (category.includes('offline')) return '📍';
    if (category.includes('crm')) return '📊';
    if (category.includes('messaging')) return '💬';
    return '🌐';
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header with Search and Filters */}
      <div className="p-3 border-b border-gray-800 flex-shrink-0 relative bg-black">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-white">Sources</h2>
          <div className="flex items-center gap-1">
            {getFavoritesCount('source') > 0 && (
              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                  showOnlyFavorites 
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                    : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
                }`}
                title={showOnlyFavorites ? 'Show all sources' : 'Show only favorites'}
              >
                <Star className={`w-3 h-3 ${showOnlyFavorites ? 'fill-current' : ''}`} />
                <span>{getFavoritesCount('source')}</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-500" />
          <input
            type="text"
            placeholder={showOnlyFavorites ? "Search favorite sources..." : "Search sources..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 text-xs bg-gray-900 border border-gray-800 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Sources List */}
      <div className="flex-1 overflow-y-auto bg-black">
        <div className="p-2">
          {filteredSources.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs">
              {showOnlyFavorites ? (
                <>
                  <Star className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p>No favorite sources yet</p>
                  <button 
                    onClick={() => setShowOnlyFavorites(false)}
                    className="text-blue-400 hover:text-blue-300 mt-1 underline"
                  >
                    Browse all sources
                  </button>
                </>
              ) : (
                <p>No sources found</p>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredSources.map((source) => (
                <div
                  key={source.type}
                  className="group relative bg-gray-900 hover:bg-gray-800 rounded-lg border border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
                  draggable={!isMobile}
                  onDragStart={!isMobile ? (e) => handleDragStart(e, source) : undefined}
                  onClick={() => handleTemplateClick(source)}
                >
                  <div className="p-3">
                    <div className="flex items-center gap-2">
                      {/* Source Icon */}
                      <div className="w-6 h-6 rounded flex items-center justify-center text-xs flex-shrink-0"
                           style={{ backgroundColor: `${source.color}20`, color: source.color }}>
                        {source.icon === 'Facebook' ? '📘' : 
                         source.icon === 'Instagram' ? '📷' : 
                         source.icon === 'Google' ? '🔍' :
                         source.icon === 'YouTube' ? '📺' :
                         source.icon === 'TikTok' ? '🎵' :
                         source.icon === 'Twitter' ? '🐦' :
                         source.icon === 'LinkedIn' ? '💼' :
                         source.icon === 'Pinterest' ? '📌' :
                         source.icon === 'Snapchat' ? '👻' :
                         source.icon === 'Phone' ? '📞' :
                         source.icon === 'Mail' ? '📧' :
                         source.icon === 'MessageCircle' ? '💬' :
                         source.icon === 'Send' ? '📤' :
                         source.icon === 'Hash' ? '#️⃣' :
                         source.icon === 'Bot' ? '🤖' :
                         '🌐'}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium text-white truncate">
                          {source.label}
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {source.description}
                        </p>
                      </div>
                      
                      {/* Favorite indicator only */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleFavoriteClick(e, source)}
                          className={`opacity-0 group-hover:opacity-100 transition-all ${
                            isFavorite(source, 'source') ? 'opacity-100 text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                          }`}
                          title={isFavorite(source, 'source') ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Star className={`w-3 h-3 ${isFavorite(source, 'source') ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 