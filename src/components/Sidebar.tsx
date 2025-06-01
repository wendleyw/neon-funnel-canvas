
import React, { useCallback, useState } from 'react';
import { ComponentTemplate } from '../types/funnel';
import { ErrorBoundary } from './ErrorBoundary';
import { useComponentTemplates } from '../hooks/useComponentTemplates';
import { SidebarHeader } from './Sidebar/SidebarHeader';
import { TemplateSection } from './Sidebar/TemplateSection';
import { FavoriteTemplatesSection } from './Sidebar/FavoriteTemplatesSection';
import { DigitalLaunchOrganizedSection } from './Sidebar/DigitalLaunchOrganizedSection';

interface SidebarProps {
  onDragStart: (template: ComponentTemplate) => void;
  onAddCompleteTemplate?: (components: any[], connections: any[]) => void;
}

export const Sidebar = React.memo<SidebarProps>(({ onDragStart, onAddCompleteTemplate }) => {
  const { customTemplates, addCustomTemplate, removeCustomTemplate } = useComponentTemplates();
  const [favorites, setFavorites] = useState<string[]>(['offer', 'target-audience', 'lead-capture']);

  const handleDragStart = useCallback((e: React.DragEvent, template: ComponentTemplate) => {
    console.log('Starting drag for template:', template);
    e.dataTransfer.setData('application/json', JSON.stringify(template));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(template);
  }, [onDragStart]);

  const toggleFavorite = useCallback((templateType: string) => {
    setFavorites(prev => 
      prev.includes(templateType) 
        ? prev.filter(t => t !== templateType)
        : [...prev, templateType]
    );
  }, []);

  console.log('Custom templates count:', customTemplates.length);

  return (
    <ErrorBoundary>
      <div className="w-72 bg-gray-950 border-r border-gray-800 flex flex-col">
        <SidebarHeader />
        
        <div className="flex-1 p-4 overflow-y-auto space-y-6">
          <FavoriteTemplatesSection
            favorites={favorites}
            onDragStart={handleDragStart}
            onToggleFavorite={toggleFavorite}
          />

          <DigitalLaunchOrganizedSection
            onDragStart={handleDragStart}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onAddCompleteTemplate={onAddCompleteTemplate}
          />

          {customTemplates.length > 0 && (
            <TemplateSection
              title="Componentes Personalizados"
              templates={customTemplates}
              onDragStart={handleDragStart}
              isCustomSection
              onRemoveTemplate={removeCustomTemplate}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
});

Sidebar.displayName = 'Sidebar';
