import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronRight, Heart, Plus, GripVertical } from 'lucide-react';
import { ComponentTemplate } from '../../../types/funnel';
import { safeStringify } from '../../utils/safeStringify';

interface CategorySectionProps {
  title: string;
  icon: string;
  templates: ComponentTemplate[];
  onDragStart: (e: React.DragEvent, template: ComponentTemplate) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
  favorites: string[];
  onToggleFavorite: (templateType: string) => void;
  defaultExpanded?: boolean;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  icon,
  templates,
  onDragStart,
  onTemplateClick,
  favorites,
  onToggleFavorite,
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleDragStart = useCallback((e: React.DragEvent, template: ComponentTemplate) => {
    console.log('[CategorySection] Drag start:', template.label);
    
    try {
      // Use safe stringification to prevent circular reference errors
      const templateDataString = safeStringify(template);
      
      // Set transfer data
      e.dataTransfer.setData('application/json', templateDataString);
      e.dataTransfer.setData('text/plain', template.label);
      e.dataTransfer.effectAllowed = 'copy';
      
      // Create custom drag image
      const dragElement = document.createElement('div');
      dragElement.style.cssText = `
        position: absolute;
        top: -1000px;
        left: -1000px;
        padding: 8px 12px;
        background: ${template.color};
        color: white;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;
      dragElement.textContent = `${template.icon} ${template.label}`;
      document.body.appendChild(dragElement);
      
      e.dataTransfer.setDragImage(dragElement, 60, 20);
      
      // Cleanup
      setTimeout(() => {
        try {
          document.body.removeChild(dragElement);
        } catch (error) {
          console.warn('Failed to cleanup drag element:', error);
        }
      }, 100);
      
      onDragStart(e, template);
    } catch (error) {
      console.error('[CategorySection] Error in handleDragStart:', error);
      
      // Fallback: try without custom drag image
      try {
        e.dataTransfer.setData('text/plain', template.label);
        e.dataTransfer.effectAllowed = 'copy';
        onDragStart(e, template);
      } catch (fallbackError) {
        console.error('[CategorySection] Fallback drag start also failed:', fallbackError);
      }
    }
  }, [onDragStart]);

  const handleTemplateClick = useCallback((template: ComponentTemplate) => {
    console.log('[CategorySection] Click:', template.label);
    if (onTemplateClick) {
      onTemplateClick(template);
    }
  }, [onTemplateClick]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent, templateType: string) => {
    e.stopPropagation();
    onToggleFavorite(templateType);
  }, [onToggleFavorite]);

  // Short description mapping for better UX
  const getShortDescription = useCallback((description: string): string => {
    const shortDescriptions: { [key: string]: string } = {
      'Página de aterrissagem para capturar leads': 'Lead capture',
      'Quiz para engajar e qualificar leads': 'Interactive quiz',
      'Formulário de captura de dados': 'Data capture',
      'Automação de e-mails para nutrição': 'Email marketing',
      'Finalização da compra': 'Checkout',
      'Webinar ou Video Sales Letter': 'Video sales',
      'Página de vendas persuasiva': 'Sales page',
      'Clique para adicionar uma nota...': 'Sticky note',
      'Seta para indicar fluxo': 'Flow direction',
      'Organize seus componentes aqui': 'Group components'
    };

    return shortDescriptions[description] || description.slice(0, 20) + '...';
  }, []);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <div className="mb-4">
      <button
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between p-3 text-left text-gray-300 hover:text-white hover:bg-gray-900/50 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <span className="font-medium text-sm uppercase tracking-wider">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-1">
          {templates.map((template) => (
            <div
              key={template.type}
              className="flex items-center p-2 mx-3 rounded-lg border border-gray-700/30 hover:border-gray-600/50 transition-colors group"
            >
              {/* Drag Handle */}
              <div
                draggable={true}
                onDragStart={(e) => handleDragStart(e, template)}
                className="flex items-center gap-3 flex-1 cursor-grab active:cursor-grabbing hover:bg-gray-800/30 rounded p-1 transition-colors"
                title="Drag to position on canvas"
              >
                <GripVertical className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-medium text-sm shrink-0 shadow-sm group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: template.color }}
                >
                  {template.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                    {template.label}
                  </div>
                  {template.defaultProps.description && (
                    <div 
                      className="text-xs text-gray-500 truncate mt-0.5 group-hover:text-gray-400 transition-colors"
                      title={template.defaultProps.description}
                    >
                      {getShortDescription(template.defaultProps.description)}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-1 ml-2">
                {/* Add button */}
                <button
                  onClick={() => handleTemplateClick(template)}
                  className="p-1.5 hover:bg-green-600/20 rounded transition-colors opacity-0 group-hover:opacity-100"
                  title="Click to add"
                >
                  <Plus className="h-4 w-4 text-gray-500 hover:text-green-400 transition-colors" />
                </button>
                
                {/* Favorite button */}
                <button
                  onClick={(e) => handleToggleFavorite(e, template.type)}
                  className="p-1.5 hover:bg-red-600/20 rounded transition-colors opacity-0 group-hover:opacity-100"
                  title="Add to favorites"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      favorites.includes(template.type)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-500 hover:text-red-500'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
