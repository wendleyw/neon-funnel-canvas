import React, { useCallback } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { CreateContent } from './CreateContent';
import { CustomFunnelContent } from './CustomFunnelContent';
import { DiagramContent } from './DiagramContent';
import { ReadyTemplatesModal } from '../ReadyTemplates/ReadyTemplatesModal';
import { ProfileModal } from '../Profile/ProfileModal';
import { ComponentTemplate } from '../../types/funnel';
import { FunnelComponent, Connection } from '../../types/funnel';
import { DrawingShape } from '../../types/drawing';
import { Layers, Library, Search, Compass, Bell, Sparkles, Crown, PenTool } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { useModernSidebar } from '../../hooks/useModernSidebar';

interface ModernSidebarProps {
  onDragStart: (template: ComponentTemplate) => void;
  onAddCompleteTemplate?: (components: FunnelComponent[], connections: Connection[]) => void;
  onShapeAdd?: (shape: DrawingShape) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
  componentCount?: number;
  connectionCount?: number;
}

const menuItems = [
  { icon: Layers, label: 'Create', id: 'create' as const },
  { icon: Library, label: 'Library', id: 'library' as const },
  { icon: Compass, label: 'Explore', id: 'explore' as const },
  { icon: Sparkles, label: 'Create Custom Funnel', id: 'custom' as const },
  { icon: Bell, label: 'Notifications', id: 'notifications' as const },
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
        return (
          <div className="flex-1 flex flex-col h-full">
            <div className="p-4">
              <div className="text-center py-8">
                <Library className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">Ready Templates</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Explore our library of pre-built templates
                </p>
                <button
                  onClick={() => setIsReadyTemplatesOpen(true)}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                >
                  View Templates
                </button>
              </div>
            </div>
          </div>
        );

      case 'explore':
        return (
          <div className="flex-1 flex flex-col h-full">
            <div className="p-4">
              <div className="text-center py-8">
                <Compass className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">Explore Community</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Discover templates created by the community
                </p>
                <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        );

      case 'custom':
        return <CustomFunnelContent />;

      case 'notifications':
        return (
          <div className="flex-1 flex flex-col h-full">
            <div className="p-4">
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">Notifications</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Stay updated with the latest news
                </p>
                <div className="space-y-2">
                  <div className="bg-gray-800 p-3 rounded-lg text-left">
                    <p className="text-white text-sm font-medium">New template available</p>
                    <p className="text-gray-400 text-xs">2 hours ago</p>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg text-left">
                    <p className="text-white text-sm font-medium">System update</p>
                    <p className="text-gray-400 text-xs">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="w-80 h-screen bg-black flex flex-col overflow-hidden">
        {/* Header with logo and personalized greeting */}
        <div className="p-6 border-b border-gray-800 flex-shrink-0">
          <h1 className="text-white text-2xl font-bold tracking-wider">Funnel Board</h1>
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-3 mt-4 text-left w-full hover:bg-gray-900/50 p-2 rounded-lg transition-colors group"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">W</span>
            </div>
            <div className="flex-1">
              <span className="text-gray-300 text-sm font-medium block">{getGreeting()}, Wendley!</span>
              <span className="text-gray-500 text-xs">View profile and settings</span>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>

        {/* Main Menu */}
        <div className="px-4 py-6 flex-shrink-0">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors relative ${
                  activeItem === item.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-900/50'
                } ${item.id === 'custom' ? 'border border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-pink-900/20' : ''}`}
              >
                <item.icon className={`w-5 h-5 ${item.id === 'custom' ? 'text-purple-400' : ''}`} />
                <span className={`font-medium ${item.id === 'custom' ? 'text-purple-200' : ''}`}>
                  {item.label}
                </span>
                {item.id === 'custom' && (
                  <div className="ml-auto">
                    <Crown className="w-4 h-4 text-yellow-400" />
                  </div>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Dynamic content based on active item - with proper scroll */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {renderContent()}
        </div>

        {/* Footer with invites and news */}
        <div className="p-4 border-t border-gray-800 space-y-2 flex-shrink-0">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors">
            <span className="text-sm">Invite friends</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors">
            <span className="text-sm">What's new?</span>
            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">2</span>
          </button>
        </div>

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
