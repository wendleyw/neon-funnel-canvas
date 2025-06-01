
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { ComponentTemplateItem } from './ComponentTemplateItem';
import { componentTemplatesByCategory, categoryLabels } from '../../data/componentTemplates';
import { ComponentTemplate } from '../../types/funnel';

interface CategorizedTemplatesProps {
  onDragStart: (e: React.DragEvent, template: ComponentTemplate) => void;
}

export const CategorizedTemplates: React.FC<CategorizedTemplatesProps> = ({ onDragStart }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Componentes por Categoria
      </h3>
      
      <Accordion type="multiple" className="w-full space-y-1">
        {Object.entries(componentTemplatesByCategory).map(([categoryKey, templates]) => (
          <AccordionItem 
            key={categoryKey} 
            value={categoryKey}
            className="border border-gray-700 rounded-lg bg-gray-900/50"
          >
            <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-gray-800/50 rounded-t-lg text-gray-300 text-sm">
              {categoryLabels[categoryKey as keyof typeof categoryLabels]}
            </AccordionTrigger>
            <AccordionContent className="px-2 pb-2">
              <div className="grid grid-cols-1 gap-1 pt-1">
                {templates.map((template) => (
                  <ComponentTemplateItem
                    key={template.type}
                    template={template}
                    onDragStart={onDragStart}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
