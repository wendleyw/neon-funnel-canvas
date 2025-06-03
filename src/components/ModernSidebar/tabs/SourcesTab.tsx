import React from 'react';
import { ComponentTemplate } from '../../../types/funnel';
import MARKETING_COMPONENT_TEMPLATES from '../../../data/componentTemplates';

interface SourcesTabProps {
  onDragStart: (template: ComponentTemplate) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
}

export const SourcesTab: React.FC<SourcesTabProps> = ({
  onDragStart,
  onTemplateClick
}) => {
  // Filter for traffic sources
  const trafficSources = MARKETING_COMPONENT_TEMPLATES.filter(
    template => template.category === 'traffic-sources'
  );

  const handleDragStart = (e: React.DragEvent, template: ComponentTemplate) => {
    e.dataTransfer.setData('application/json', JSON.stringify(template));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(template);
  };

  return (
    <div className="p-4">
      <div className="space-y-3">
        {trafficSources.map((template) => (
          <div
            key={template.type}
            className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer group"
            draggable
            onDragStart={(e) => handleDragStart(e, template)}
            onClick={() => onTemplateClick?.(template)}
          >
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
              style={{ backgroundColor: `${template.color}20`, color: template.color }}
            >
              {template.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-white text-sm truncate">
                {template.label}
              </h4>
              <p className="text-xs text-gray-400 truncate">
                {template.description}
              </p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs">+</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 