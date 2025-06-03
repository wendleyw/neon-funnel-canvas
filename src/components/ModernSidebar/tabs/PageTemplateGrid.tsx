import React, { useState } from 'react';
import { ComponentTemplate } from '../../../types/funnel';
import { PageTemplate } from '../../../data/pageTemplates';
import { useIsMobile } from '../../../hooks/use-mobile';
import { HelpCircle } from 'lucide-react';

interface PageTemplateGridProps {
  templates: PageTemplate[];
  onDragStart: (template: ComponentTemplate) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
}

// Component to create simple, clean mockups for different page types
const PageMockup: React.FC<{ type: string; className?: string }> = ({ type, className = '' }) => {
  const getMockupContent = () => {
    switch (type) {
      case 'landing-page':
        return (
          <div className="w-full h-full bg-white rounded border overflow-hidden">
            <div className="h-1.5 bg-blue-500"></div>
            <div className="p-1 space-y-0.5">
              <div className="w-full h-1.5 bg-blue-500 rounded-sm"></div>
              <div className="w-3/4 h-0.5 bg-gray-300 rounded-sm"></div>
              <div className="w-10 h-1 bg-green-500 rounded-sm mt-1"></div>
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
  onTemplateClick
}) => {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
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
            onMouseEnter={() => !isMobile && setHoveredTemplate(template.id)}
            onMouseLeave={() => !isMobile && setHoveredTemplate(null)}
            draggable={!isMobile}
            onDragStart={(e) => !isMobile && handleDragStart(e, template)}
            onClick={() => handleTemplateClick(template)}
          >
            {/* Template Item with Footer Title */}
            <div className="group relative cursor-pointer">
              {/* Preview Card with Internal Help Icon */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-all duration-200 hover:shadow-lg h-28 flex items-center justify-center p-3 relative mb-2">
                {/* Help Icon - Inside card, top-right corner */}
                <div className="absolute top-1.5 right-1.5 z-10">
                  <button
                    className="w-4 h-4 bg-gray-800/80 hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 hover:scale-105 shadow-sm"
                    onMouseEnter={() => setShowTooltip(template.id)}
                    onMouseLeave={() => setShowTooltip(null)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <HelpCircle className="w-2.5 h-2.5" />
                  </button>
                  
                  {/* Tooltip */}
                  {showTooltip === template.id && (
                    <div className="fixed z-[100] pointer-events-none">
                      <div 
                        className="relative bg-gray-900 border border-gray-600 rounded-lg shadow-2xl p-3 max-w-xs backdrop-blur-sm"
                        style={{
                          transform: 'translateX(-50%) translateY(-100%)',
                          marginTop: '-12px',
                          left: '50%',
                          top: '0'
                        }}
                      >
                        <p className="text-xs text-gray-200 leading-relaxed font-medium">
                          {getTemplateExplanation(template.type)}
                        </p>
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Preview Content */}
                <PageMockup type={template.type} className="w-full max-w-full" />
              </div>

              {/* Title in Footer - Clean and centered */}
              <div className="px-1 text-center">
                <h4 className="font-medium text-white text-xs leading-relaxed">
                  {template.label}
                </h4>
              </div>

              {/* Hover overlay (desktop only) - Only covers the card */}
              {!isMobile && hoveredTemplate === template.id && (
                <div className="absolute top-0 left-0 right-0 h-28 bg-blue-600/10 border-2 border-blue-500 rounded-lg pointer-events-none"></div>
              )}
            </div>
          </div>
        ))}

        {/* Add Custom Card - Footer title layout */}
        <div className="group relative cursor-pointer">
          {/* Custom Card */}
          <div className="bg-gray-900 border-2 border-dashed border-gray-700 rounded-lg hover:border-blue-500 hover:bg-gray-800/50 transition-all duration-200 h-28 flex flex-col items-center justify-center p-3 mb-2">
            <div className="w-7 h-7 bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center mb-2 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-200">
              <span className="text-xs text-gray-400 group-hover:text-white font-bold">+</span>
            </div>
            <span className="text-xs text-gray-500 group-hover:text-blue-400 font-medium transition-colors duration-200 text-center leading-tight">
              Create custom template
            </span>
          </div>

          {/* Title in Footer - Consistent with other cards */}
          <div className="px-1 text-center">
            <h4 className="font-medium text-gray-400 group-hover:text-blue-400 text-xs transition-colors duration-200 leading-relaxed">
              Custom Template
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}; 