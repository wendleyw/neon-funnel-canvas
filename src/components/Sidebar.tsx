
import React, { useCallback, useState } from 'react';
import { ComponentTemplate } from '../types/funnel';
import { ErrorBoundary } from './ErrorBoundary';
import { useComponentTemplates } from '../hooks/useComponentTemplates';
import { SidebarHeader } from './Sidebar/SidebarHeader';
import { TemplateSection } from './Sidebar/TemplateSection';
import { FavoriteTemplatesSection } from './Sidebar/FavoriteTemplatesSection';
import { DigitalLaunchOrganizedSection } from './Sidebar/DigitalLaunchOrganizedSection';
import { SocialMediaSection } from './Sidebar/SocialMediaSection';
import { ReadyTemplatesModal } from './ReadyTemplates/ReadyTemplatesModal';
import { Button } from './ui/button';
import { Star, Menu, X } from 'lucide-react';
import { FunnelComponent, Connection } from '../types/funnel';

interface SidebarProps {
  onDragStart: (template: ComponentTemplate) => void;
  onAddCompleteTemplate?: (components: FunnelComponent[], connections: Connection[]) => void;
}

export const Sidebar = React.memo<SidebarProps>(({ onDragStart, onAddCompleteTemplate }) => {
  const { customTemplates, addCustomTemplate, removeCustomTemplate } = useComponentTemplates();
  const [favorites, setFavorites] = useState<string[]>(['offer', 'target-audience', 'lead-capture']);
  const [isReadyTemplatesOpen, setIsReadyTemplatesOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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

  const SidebarContent = () => (
    <>
      <SidebarHeader />
      
      <div className="flex-1 p-4 overflow-y-auto space-y-6 no-scrollbar">
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

        <SocialMediaSection
          onDragStart={handleDragStart}
          onAddCompleteTemplate={onAddCompleteTemplate}
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
    </>
  );

  return (
    <ErrorBoundary>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          size="sm"
          variant="outline"
          className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
        >
          {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-72 bg-gray-950 border-r border-gray-800 flex-col h-full">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileOpen(false)} />
          <div className="relative flex flex-col w-80 max-w-xs bg-gray-950 border-r border-gray-800 h-full">
            <SidebarContent />
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
});

Sidebar.displayName = 'Sidebar';
