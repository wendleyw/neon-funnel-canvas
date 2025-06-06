import React, { useCallback } from 'react';
import { ErrorBoundary } from '@/features/shared/components/ErrorBoundary';
import { CreateContent } from './CreateContent';
import { CustomFunnelContent } from './CustomFunnelContent';
import { ReadyTemplatesModal } from '@/features/templates/components/ReadyTemplatesModal';
import { ProfileModal } from '@/features/auth/components/ProfileModal';
import { ComponentTemplate } from '../../../types/funnel';
import { FunnelComponent, Connection } from '../../../types/funnel';
import { DrawingShape } from '../../../types/drawing';
import { ScrollArea } from '@/features/shared/ui/scroll-area';
import { useModernSidebar } from '../hooks/useModernSidebar';
import { FunnelBoardSidebarHeader } from './FunnelBoardSidebarHeader';
import { ModernSidebarFooter } from './ModernSidebarFooter';
import { ModernSidebarMenu, MenuItem } from './ModernSidebarMenu';
import { LibraryContent } from './content/LibraryContent';
import { ExploreContent } from './content/ExploreContent';
import { NotificationsContent } from './content/NotificationsContent';
import { Layers, Library, Compass, Bell, Sparkles } from 'lucide-react';

interface ModernSidebarProps {
  onDragStart: (template: ComponentTemplate) => void;
  onAddCompleteTemplate?: (components: FunnelComponent[], connections: Connection[]) => void;
  onShapeAdd?: (shape: DrawingShape) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
  componentCount?: number;
  connectionCount?: number;
}

const menuItems: MenuItem[] = [
  { icon: Layers, label: 'Create', id: 'create' },
  { icon: Library, label: 'Library', id: 'library' },
  { icon: Compass, label: 'Explore', id: 'explore' },
  { icon: Sparkles, label: 'Create Custom Funnel', id: 'custom', isCustom: true },
  { icon: Bell, label: 'Notifications', id: 'notifications' },
];

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  onDragStart,
  onAddCompleteTemplate,
  onShapeAdd,
  onTemplateClick,
  componentCount = 0,
  connectionCount = 0
}) => {
  const {
    searchQuery,
    favorites,
    activeItem,
    isReadyTemplatesOpen,
    isProfileOpen,
    filteredCategories,
    favoriteTemplates,
    setSearchQuery,
    toggleFavorite,
    setActiveItem,
    setIsReadyTemplatesOpen,
    setIsProfileOpen,
    getGreeting
  } = useModernSidebar();

  const handleDragStart = useCallback((e: React.DragEvent, template: ComponentTemplate) => {
    console.log('Starting drag for template:', template);
    e.dataTransfer.setData('application/json', JSON.stringify(template));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(template);
  }, [onDragStart]);

  const handleReadyTemplateSelect = useCallback((components: FunnelComponent[], connections: Connection[]) => {
    if (onAddCompleteTemplate) {
      onAddCompleteTemplate(components, connections);
    }
  }, [onAddCompleteTemplate]);

  const renderContent = () => {
    switch (activeItem) {
      case 'create':
        return (
          <CreateContent
            searchQuery={searchQuery}
            favorites={favorites}
            favoriteTemplates={favoriteTemplates}
            filteredCategories={filteredCategories}
            onSearchChange={setSearchQuery}
            onDragStart={handleDragStart}
            onToggleFavorite={toggleFavorite}
            onShapeAdd={onShapeAdd}
            onTemplateClick={onTemplateClick}
          />
        );

      case 'library':
        return <LibraryContent onOpenReadyTemplatesModal={() => setIsReadyTemplatesOpen(true)} />;

      case 'explore':
        return <ExploreContent />;

      case 'custom':
        return <CustomFunnelContent />;

      case 'notifications':
        return <NotificationsContent />;

      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="w-80 h-screen bg-black modern-sidebar flex flex-col overflow-hidden relative">
        {/* Funnel connector line */}
        <div className="absolute left-1/2 top-24 bottom-20 w-0.5 sidebar-connector-line transform -translate-x-px z-0"></div>
        
        <FunnelBoardSidebarHeader 
          greeting={getGreeting()} 
          onProfileOpen={() => setIsProfileOpen(true)} 
        />

        <ModernSidebarMenu 
          menuItems={menuItems} 
          activeItem={activeItem} 
          onMenuItemClick={setActiveItem} 
        />

        {/* Dynamic content based on active item - with proper scroll */}
        <div className="flex-1 min-h-0 overflow-hidden relative z-10 sidebar-content-area">
          <div className="h-full sidebar-enhanced-scroll overflow-y-auto">
            {renderContent()}
          </div>
        </div>

        <ModernSidebarFooter />

        <ReadyTemplatesModal
          isOpen={isReadyTemplatesOpen}
          onClose={() => setIsReadyTemplatesOpen(false)}
          onTemplateSelect={handleReadyTemplateSelect}
        />

        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      </div>
    </ErrorBoundary>
  );
};
