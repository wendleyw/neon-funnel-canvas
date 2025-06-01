
import React, { useCallback, useState } from 'react';
import { ComponentTemplate } from '../types/funnel';
import { ErrorBoundary } from './ErrorBoundary';
import { useComponentTemplates } from '../hooks/useComponentTemplates';
import { SidebarHeader } from './Sidebar/SidebarHeader';
import { TemplateSection } from './Sidebar/TemplateSection';
import { FavoriteTemplatesSection } from './Sidebar/FavoriteTemplatesSection';
import { DigitalLaunchOrganizedSection } from './Sidebar/DigitalLaunchOrganizedSection';
import { ReadyTemplatesModal } from './ReadyTemplates/ReadyTemplatesModal';
import { Button } from './ui/button';
import { Star } from 'lucide-react';
import { FunnelComponent, Connection } from '../types/funnel';

interface SidebarProps {
  onDragStart: (template: ComponentTemplate) => void;
  onAddCompleteTemplate?: (components: FunnelComponent[], connections: Connection[]) => void;
}

export const Sidebar = React.memo<SidebarProps>(({ onDragStart, onAddCompleteTemplate }) => {
  const { customTemplates, addCustomTemplate, removeCustomTemplate } = useComponentTemplates();
  const [favorites, setFavorites] = useState<string[]>(['offer', 'target-audience', 'lead-capture']);
  const [isReadyTemplatesOpen, setIsReadyTemplatesOpen] = useState(false);

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

  const handleReadyTemplateSelect = useCallback((components: FunnelComponent[], connections: Connection[]) => {
    if (onAddCompleteTemplate) {
      onAddCompleteTemplate(components, connections);
    }
  }, [onAddCompleteTemplate]);

  console.log('Custom templates count:', customTemplates.length);

  return (
    <ErrorBoundary>
      <div className="w-72 bg-gray-950 border-r border-gray-800 flex flex-col">
        <SidebarHeader />
        
        <div className="flex-1 p-4 overflow-y-auto space-y-6">
          {/* Ready Templates Button */}
          <Button
            onClick={() => setIsReadyTemplatesOpen(true)}
            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-medium"
          >
            <Star className="w-4 h-4 mr-2" />
            Templates Prontos
          </Button>

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

        <ReadyTemplatesModal
          isOpen={isReadyTemplatesOpen}
          onClose={() => setIsReadyTemplatesOpen(false)}
          onTemplateSelect={handleReadyTemplateSelect}
        />
      </div>
    </ErrorBoundary>
  );
});

Sidebar.displayName = 'Sidebar';
