import React from 'react';
import { Star } from 'lucide-react';
import { ComponentTemplate } from '../../../types/funnel';
import { safeStringify } from '../../../utils/safeStringify';

interface ComponentTemplateItemProps {
  template: ComponentTemplate;
  onDragStart: (e: React.DragEvent, template: ComponentTemplate) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (template: ComponentTemplate) => void;
  subtitle?: string;
  tags?: string[];
}

export const ComponentTemplateItem: React.FC<ComponentTemplateItemProps> = ({
  template,
  onDragStart,
  isFavorite = false,
  onToggleFavorite,
  subtitle,
  tags
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    try {
      const dragData = safeStringify(template);
      e.dataTransfer.setData('application/json', dragData);
      e.dataTransfer.setData('text/plain', template.label);
      e.dataTransfer.effectAllowed = 'copy';
      onDragStart(e, template);
    } catch (error) {
      console.error('[ComponentTemplateItem] Error in handleDragStart:', error);
      // Fallback: try without JSON data
      try {
        e.dataTransfer.setData('text/plain', template.label);
        e.dataTransfer.effectAllowed = 'copy';
        onDragStart(e, template);
      } catch (fallbackError) {
        console.error('[ComponentTemplateItem] Fallback drag start also failed:', fallbackError);
      }
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleFavorite?.(template);
  };

  // Check for custom mockup
  const customMockup = template.defaultProps?.image || template.defaultProps?.properties?.customMockup;

  // Debug específico para testemonica
  if (template.label.includes('testemonica')) {
    console.log('🔍 [ComponentTemplateItem] DEBUG - testemonica template:', {
      label: template.label,
      defaultPropsImage: template.defaultProps?.image,
      customMockupProperty: template.defaultProps?.properties?.customMockup,
      finalCustomMockup: customMockup,
      templateData: template
    });
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`
        flex items-center gap-3 p-3 rounded-lg transition-colors duration-150 
        cursor-grab active:cursor-grabbing group relative
        bg-black hover:bg-neutral-900 border border-neutral-700 hover:border-neutral-600
      `}
    >
      {/* Template Icon/Mockup */}
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
        {customMockup ? (
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-600">
            <img 
              src={customMockup} 
              alt={template.label} 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to icon if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div 
              className="w-full h-full hidden rounded-lg flex items-center justify-center text-lg"
              style={{ 
                backgroundColor: `${template.color}20`,
                color: template.color
              }}
            >
              {template.icon}
            </div>
          </div>
        ) : (
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg border-2"
            style={{ 
              backgroundColor: `${template.color}20`,
              borderColor: `${template.color}40`,
              color: template.color
            }}
          >
            {template.icon}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="font-semibold text-white text-sm truncate">
          {template.label}
        </div>
        {subtitle && (
          <div className="text-xs text-gray-400 truncate mt-0.5">
            {subtitle}
          </div>
        )}
        {tags && tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-x-1.5 gap-y-1">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="inline-block bg-neutral-800 border border-neutral-600 text-gray-300 text-[10px] px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {onToggleFavorite && (
        <button
          onClick={handleToggleFavorite}
          className="transition-opacity duration-200 p-1.5 hover:bg-neutral-700 rounded-full shrink-0 ml-2 self-center"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star 
            className={`w-5 h-5 transition-colors ${
              isFavorite 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-500 hover:text-yellow-500'
            }`} 
          />
        </button>
      )}
    </div>
  );
};
