import React, { useState } from 'react';
import { ComponentTemplate } from '../../../types/funnel';
import { PageTemplate } from '../../../data/pageTemplates';
import { useIsMobile } from '../../../hooks/use-mobile';
import { Star, Plus } from 'lucide-react';

interface PageTemplateGridProps {
  templates: PageTemplate[];
  onDragStart: (template: PageTemplate) => void;
  onTemplateClick?: (template: PageTemplate) => void;
  showFavorites?: boolean;
  isFavorite?: (template: PageTemplate) => boolean;
  toggleFavorite?: (template: PageTemplate) => void;
}

// Component to create simple, clean mockups for different page types
const PageMockup: React.FC<{ type: string; className?: string }> = ({ type, className = '' }) => {
  const getMockupContent = () => {
    switch (type) {
      // Social Media Mockups
      case 'instagram-reels':
        return (
          <div className="w-full h-full bg-black rounded border overflow-hidden relative">
            <div className="h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
            <div className="flex-1 bg-gradient-to-br from-purple-900 via-pink-900 to-black relative h-full flex items-center justify-center">
              <div className="text-white text-xs font-bold">REELS</div>
              <div className="absolute top-1 left-1 text-white text-xs">🎬</div>
              <div className="absolute bottom-1 right-1 text-white text-xs">9:16</div>
            </div>
          </div>
        );

      case 'instagram-post':
        return (
          <div className="w-full h-full bg-white rounded border overflow-hidden">
            <div className="h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
            <div className="p-0.5 space-y-0.5">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                <div className="w-3 h-0.5 bg-gray-400 rounded-sm"></div>
              </div>
              <div className="w-full h-3 bg-gradient-to-br from-pink-400 to-purple-600 rounded-sm flex items-center justify-center">
                <div className="text-white text-xs">📸</div>
              </div>
              <div className="flex gap-1">
                <div className="text-xs">❤️</div>
                <div className="text-xs">💬</div>
                <div className="text-xs">📤</div>
              </div>
            </div>
          </div>
        );

      case 'instagram-story':
        return (
          <div className="w-full h-full bg-black rounded border overflow-hidden">
            <div className="h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
            <div className="p-0.5 flex flex-col items-center justify-center h-full">
              <div className="w-2 h-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-1"></div>
              <div className="text-white text-xs font-bold">STORY</div>
              <div className="text-gray-400 text-xs">9:16</div>
            </div>
          </div>
        );

      case 'tiktok-video':
        return (
          <div className="w-full h-full bg-black rounded border overflow-hidden">
            <div className="p-0.5 flex flex-col items-center justify-center h-full">
              <div className="text-white text-xs font-bold">TIKTOK</div>
              <div className="text-red-400 text-xs">🎵</div>
              <div className="text-gray-400 text-xs">9:16</div>
            </div>
          </div>
        );

      case 'youtube-short':
        return (
          <div className="w-full h-full bg-black rounded border overflow-hidden">
            <div className="h-0.5 bg-red-600"></div>
            <div className="p-0.5 flex flex-col items-center justify-center h-full">
              <div className="text-white text-xs font-bold bg-red-600 px-1 rounded">SHORTS</div>
              <div className="text-white text-xs">📹</div>
              <div className="text-gray-400 text-xs">9:16</div>
            </div>
          </div>
        );

      case 'facebook-post':
        return (
          <div className="w-full h-full bg-white rounded border overflow-hidden">
            <div className="h-0.5 bg-blue-600"></div>
            <div className="p-0.5 space-y-0.5">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                <div className="w-3 h-0.5 bg-gray-400 rounded-sm"></div>
              </div>
              <div className="w-full h-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-sm flex items-center justify-center">
                <div className="text-white text-xs">👥</div>
              </div>
              <div className="flex gap-1 text-xs">
                <span>👍</span>
                <span>💬</span>
                <span>📤</span>
              </div>
            </div>
          </div>
        );

      case 'linkedin-post':
        return (
          <div className="w-full h-full bg-white rounded border overflow-hidden">
            <div className="h-0.5 bg-blue-700"></div>
            <div className="p-0.5 space-y-0.5">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-blue-700 rounded-sm"></div>
                <div className="w-3 h-0.5 bg-gray-400 rounded-sm"></div>
              </div>
              <div className="w-full h-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-sm flex items-center justify-center">
                <div className="text-white text-xs">💼</div>
              </div>
              <div className="flex gap-1 text-xs">
                <span>👍</span>
                <span>💬</span>
                <span>📤</span>
              </div>
            </div>
          </div>
        );

      case 'twitter-post':
        return (
          <div className="w-full h-full bg-white rounded border overflow-hidden">
            <div className="h-0.5 bg-sky-500"></div>
            <div className="p-0.5 space-y-0.5">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-sky-500 rounded-full"></div>
                <div className="w-3 h-0.5 bg-gray-400 rounded-sm"></div>
              </div>
              <div className="w-full h-2 bg-gradient-to-br from-sky-400 to-sky-600 rounded-sm flex items-center justify-center">
                <div className="text-white text-xs">🐦</div>
              </div>
              <div className="flex gap-1 text-xs">
                <span>💬</span>
                <span>🔄</span>
                <span>❤️</span>
              </div>
            </div>
          </div>
        );

      case 'landing-page':
        return (
          <div className="w-full h-full bg-white rounded border overflow-hidden">
            <div className="p-1 space-y-0.5">
              <div className="w-full h-1 bg-indigo-500 rounded-sm"></div>
              <div className="w-4/5 h-0.5 bg-gray-300 rounded-sm"></div>
              <div className="w-8 h-1 bg-green-500 rounded-sm"></div>
            </div>
          </div>
        );

      case 'sales-page':
        return (
          <div className="w-full h-full bg-white rounded border overflow-hidden">
            <div className="p-1 space-y-0.5">
              <div className="w-full h-1.5 bg-red-500 rounded-sm"></div>
              <div className="w-3/4 h-0.5 bg-gray-300 rounded-sm"></div>
              <div className="w-10 h-1 bg-green-500 rounded-sm"></div>
            </div>
          </div>
        );

      case 'opt-in-page':
      case 'download-page':
        return (
          <div className="w-full h-full bg-white rounded border overflow-hidden">
            <div className="p-1 space-y-0.5">
              <div className="w-full h-1 bg-purple-500 rounded-sm"></div>
              <div className="w-4/5 h-0.5 bg-gray-300 rounded-sm"></div>
              <div className="w-8 h-1 bg-purple-500 rounded-sm"></div>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full bg-white rounded border overflow-hidden">
            <div className="p-1 space-y-0.5">
              <div className="w-full h-1.5 bg-gray-500 rounded-sm"></div>
              <div className="w-4/5 h-0.5 bg-gray-300 rounded-sm"></div>
              <div className="w-8 h-1 bg-gray-500 rounded-sm mt-1"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`aspect-[4/3] ${className}`}>
      {getMockupContent()}
    </div>
  );
};

// Helper function to get simple explanations
const getTemplateExplanation = (type: string): string => {
  const explanations: Record<string, string> = {
    'landing-page': 'Landing page to capture visitors',
    'sales-page': 'Sales page to convert leads',
    'opt-in-page': 'Email capture form',
    'download-page': 'Download page for materials',
    'webinar-live': 'Live webinar page',
    'webinar-replay': 'Webinar replay page',
    'thank-you-page': 'Post-conversion thank you page',
    'calendar-page': 'Meeting scheduling',
  };
  return explanations[type] || 'Custom template for your funnel';
};

export const PageTemplateGrid: React.FC<PageTemplateGridProps> = ({
  templates,
  onDragStart,
  onTemplateClick,
  showFavorites = false,
  isFavorite,
  toggleFavorite
}) => {
  const isMobile = useIsMobile();

  const handleDragStart = (e: React.DragEvent, pageTemplate: PageTemplate) => {
    const componentTemplateForDragData = {
        type: pageTemplate.type,
        icon: '📄',
        label: pageTemplate.label,
        color: pageTemplate.color,
        category: pageTemplate.category,
        title: pageTemplate.label,
        description: pageTemplate.description,
        defaultProps: {
            title: pageTemplate.label,
            description: pageTemplate.description,
            status: 'draft',
            properties: { page_type: pageTemplate.type, tags: pageTemplate.tags }
        }
    };
    e.dataTransfer.setData('application/json', JSON.stringify(componentTemplateForDragData));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(pageTemplate);
  };

  const handleTemplateClick = (pageTemplate: PageTemplate) => {
    if (onTemplateClick) {
      onTemplateClick(pageTemplate);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent, template: PageTemplate) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`[PageTemplateGrid DEBUG] handleFavoriteClick for page: ID '${template.id}', Label: '${template.label}'`, template);
    if (toggleFavorite) {
      toggleFavorite(template);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className={`
        ${isMobile 
          ? 'grid grid-cols-1 gap-2 p-3' 
          : 'grid grid-cols-2 lg:grid-cols-3 gap-2 p-3' 
        }
      `}>
        {templates.map((template) => {
          const isFav = isFavorite ? isFavorite(template) : false;
          console.log(`[PageTemplateGrid DEBUG] Rendering page item: ID '${template.id}', Label: '${template.label}', IsFavorite: ${isFav}`, template);
          return (
            <div
              key={template.id || template.type}
              draggable
              onDragStart={(e) => handleDragStart(e, template)}
              onClick={() => handleTemplateClick(template)}
              className="group relative p-3 rounded-lg border border-neutral-700 hover:border-neutral-600 bg-black hover:bg-neutral-900 transition-colors duration-150 cursor-pointer"
            >
              {/* Mockup Section */}
              <div className="relative h-20 flex items-center justify-center mb-3">
                <PageMockup type={template.type} className="w-16 h-12" />
              </div>
              
              <div className="flex flex-col text-left">
                <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">
                  {template.label}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2">
                  {template.description}
                </p>
              </div>

              {/* Favorite Button */}
              {showFavorites && (
                <button
                  onClick={(e) => handleFavoriteClick(e, template)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-neutral-800/50 hover:bg-neutral-700/70 transition-colors opacity-100"
                  title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star 
                    className={`w-4 h-4 transition-colors ${
                      isFav 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-500 hover:text-yellow-500'
                    }`} 
                  />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}; 