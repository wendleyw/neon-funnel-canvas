import React, { useState } from 'react';
import { ComponentTemplate } from '../../../types/funnel';
import { PageTemplate } from '../../../data/pageTemplates';
import { useIsMobile } from '../../../hooks/use-mobile';
import { Star, Plus } from 'lucide-react';

interface PageTemplateGridProps {
  templates: PageTemplate[];
  onDragStart: (template: ComponentTemplate) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
  showFavorites?: boolean;
  isFavorite?: (template: PageTemplate) => boolean;
  toggleFavorite?: (template: PageTemplate) => void;
}

// Component to create simple, clean mockups for different page types
const PageMockup: React.FC<{ type: string; className?: string }> = ({ type, className = '' }) => {
  const getMockupContent = () => {
    switch (type) {
      case 'landing-page':
        return (
          <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-white rounded border border-indigo-100 overflow-hidden">
            {/* Modern header with gradient */}
            <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <div className="p-1.5 space-y-1">
              {/* Hero headline */}
              <div className="w-full h-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-sm shadow-sm"></div>
              <div className="w-4/5 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-sm"></div>
              {/* Description text */}
              <div className="w-full h-0.5 bg-gray-300 rounded-sm"></div>
              <div className="w-3/4 h-0.5 bg-gray-300 rounded-sm"></div>
              {/* Modern CTA button */}
              <div className="w-12 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-md shadow-sm mt-1.5"></div>
              {/* Trust indicators */}
              <div className="flex gap-0.5 mt-1">
                <div className="w-2 h-0.5 bg-indigo-400 rounded-sm"></div>
                <div className="w-2 h-0.5 bg-purple-400 rounded-sm"></div>
                <div className="w-2 h-0.5 bg-indigo-400 rounded-sm"></div>
              </div>
            </div>
          </div>
        );

      case 'sales-page':
        return (
          <div className="w-full h-full bg-white rounded border overflow-hidden">
            <div className="h-1 bg-red-500"></div>
            <div className="p-1 space-y-0.5">
              <div className="w-full h-1.5 bg-red-500 rounded-sm"></div>
              <div className="w-4/5 h-1.5 bg-red-500 rounded-sm"></div>
              <div className="w-full h-0.5 bg-gray-300 rounded-sm"></div>
              <div className="w-6 h-1.5 bg-yellow-400 rounded-sm"></div>
              <div className="w-10 h-1 bg-red-500 rounded-sm"></div>
            </div>
          </div>
        );

      case 'opt-in-page':
      case 'download-page':
        return (
          <div className="w-full h-full bg-white rounded border overflow-hidden">
            <div className="p-1 space-y-0.5 text-center">
              <div className="w-4 h-0.5 bg-purple-500 rounded-sm mx-auto"></div>
              <div className="w-full h-1 bg-purple-500 rounded-sm"></div>
              <div className="w-full h-0.5 bg-gray-200 border border-gray-300 rounded-sm mt-1"></div>
              <div className="w-8 h-1 bg-purple-500 rounded-sm mx-auto"></div>
            </div>
          </div>
        );

      case 'webinar-live':
      case 'webinar-replay':
        return (
          <div className="w-full h-full bg-white rounded border overflow-hidden">
            <div className="p-1 space-y-0.5">
              <div className="w-3 h-0.5 bg-red-500 rounded-sm"></div>
              <div className="w-full h-3 bg-gray-800 rounded-sm flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
              <div className="w-full h-0.5 bg-gray-300 rounded-sm"></div>
              <div className="w-8 h-1 bg-red-500 rounded-sm"></div>
            </div>
          </div>
        );

      case 'thank-you-page':
        return (
          <div className="w-full h-full bg-white rounded border overflow-hidden">
            <div className="p-1 space-y-0.5 text-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mx-auto flex items-center justify-center">
                <div className="w-0.5 h-0.5 bg-white rounded-sm"></div>
              </div>
              <div className="w-2/3 h-1 bg-green-500 rounded-sm mx-auto"></div>
              <div className="w-full h-0.5 bg-gray-300 rounded-sm"></div>
            </div>
          </div>
        );

      case 'calendar-page':
        return (
          <div className="w-full h-full bg-white rounded border overflow-hidden">
            <div className="p-1 space-y-0.5">
              <div className="w-3/4 h-0.5 bg-blue-500 rounded-sm"></div>
              <div className="grid grid-cols-4 gap-0.5">
                <div className="w-full h-1 bg-gray-200 rounded-sm"></div>
                <div className="w-full h-1 bg-blue-500 rounded-sm"></div>
                <div className="w-full h-1 bg-gray-200 rounded-sm"></div>
                <div className="w-full h-1 bg-gray-200 rounded-sm"></div>
              </div>
              <div className="w-8 h-0.5 bg-blue-500 rounded-sm"></div>
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

  // Convert PageTemplate to ComponentTemplate for compatibility
  const convertToComponentTemplate = (pageTemplate: PageTemplate): ComponentTemplate => ({
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
      properties: {
        page_type: pageTemplate.type,
        tags: pageTemplate.tags
      }
    }
  });

  const handleDragStart = (e: React.DragEvent, pageTemplate: PageTemplate) => {
    const componentTemplate = convertToComponentTemplate(pageTemplate);
    e.dataTransfer.setData('application/json', JSON.stringify(componentTemplate));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(componentTemplate);
  };

  const handleTemplateClick = (pageTemplate: PageTemplate) => {
    if (onTemplateClick) {
      const componentTemplate = convertToComponentTemplate(pageTemplate);
      onTemplateClick(componentTemplate);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent, template: PageTemplate) => {
    e.preventDefault();
    e.stopPropagation();
    if (toggleFavorite) {
      toggleFavorite(template);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className={`
        ${isMobile 
          ? 'grid grid-cols-1 gap-3 p-4' 
          : 'grid grid-cols-2 xl:grid-cols-3 gap-3 p-4'
        }
      `}>
        {templates.map((template) => (
          <div
            key={template.id}
            className="group relative cursor-pointer"
            draggable={!isMobile}
            onDragStart={(e) => !isMobile && handleDragStart(e, template)}
            onClick={() => handleTemplateClick(template)}
          >
            {/* Template Item */}
            <div className="relative">
              {/* Preview Card */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-all duration-200 hover:shadow-lg h-28 flex items-center justify-center p-3 relative mb-2">
                
                {/* Icons Container - Top right */}
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  {/* Favorite Icon */}
                  {showFavorites && isFavorite && toggleFavorite && (
                    <button
                      onClick={(e) => handleFavoriteClick(e, template)}
                      className={`opacity-0 group-hover:opacity-100 transition-all p-1 rounded ${
                        isFavorite(template) 
                          ? 'opacity-100 text-yellow-400 hover:text-yellow-300' 
                          : 'text-gray-400 hover:text-yellow-400'
                      }`}
                      title={isFavorite(template) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star className={`w-3 h-3 ${isFavorite(template) ? 'fill-current' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Add Indicator */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all">
                  <div className="bg-blue-600 rounded p-1">
                    <Plus className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* Template Preview */}
                <PageMockup type={template.type} className="w-16 h-12" />
              </div>

              {/* Template Title and Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-medium text-white truncate">
                  {template.label}
                </h4>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {template.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 