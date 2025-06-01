
import React from 'react';
import { ComponentTemplate } from '../../types/funnel';
import { ComponentTemplateItem } from './ComponentTemplateItem';

interface TemplateSectionProps {
  title: string;
  templates: ComponentTemplate[];
  onDragStart: (e: React.DragEvent, template: ComponentTemplate) => void;
  isCustomSection?: boolean;
  onRemoveTemplate?: (type: string) => void;
}

export const TemplateSection = React.memo<TemplateSectionProps>(({
  title,
  templates,
  onDragStart,
  isCustomSection = false,
  onRemoveTemplate
}) => {
  if (templates.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
        {title}
      </h3>
      
      {templates.map((template) => (
        <ComponentTemplateItem
          key={template.type}
          template={template}
          onDragStart={onDragStart}
        />
      ))}
    </div>
  );
});

TemplateSection.displayName = 'TemplateSection';
