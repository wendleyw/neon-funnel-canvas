
import React, { useState, useCallback, useMemo } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { ModernSidebarHeader } from './ModernSidebarHeader';
import { QuickActionsSection } from './QuickActionsSection';
import { CategorySection } from './CategorySection';
import { ModernSidebarStatusBar } from './ModernSidebarStatusBar';
import { ReadyTemplatesModal } from '../ReadyTemplates/ReadyTemplatesModal';
import { ComponentTemplate } from '../../types/funnel';
import { FunnelComponent, Connection } from '../../types/funnel';
import { modernSidebarCategories, searchModernTemplates } from '../../data/modernSidebarCategories';
import { Home, Layers, Library, Search, Compass, Bell, User, CreditCard } from 'lucide-react';

interface ModernSidebarProps {
  onDragStart: (template: ComponentTemplate) => void;
  onAddCompleteTemplate?: (components: FunnelComponent[], connections: Connection[]) => void;
  componentCount?: number;
  connectionCount?: number;
}

const menuItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: Layers, label: 'Create', active: false },
  { icon: Library, label: 'Library', active: false },
  { icon: Compass, label: 'Explore', active: false },
  { icon: Search, label: 'Search', active: false },
  { icon: Bell, label: 'Notifications', active: false },
];

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  onDragStart,
  onAddCompleteTemplate,
  componentCount = 0,
  connectionCount = 0
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['offer', 'target-audience', 'lead-capture']);
  const [isReadyTemplatesOpen, setIsReadyTemplatesOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');

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

  // Filtrar templates baseado na busca
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return modernSidebarCategories;
    }

    const searchResults = searchModernTemplates(searchQuery);
    const filteredCats: typeof modernSidebarCategories = {} as typeof modernSidebarCategories;

    Object.entries(modernSidebarCategories).forEach(([key, category]) => {
      const categoryTemplates = category.templates.filter(template =>
        searchResults.some(result => result.type === template.type)
      );
      
      if (categoryTemplates.length > 0) {
        (filteredCats as any)[key] = {
          ...category,
          templates: categoryTemplates
        };
      }
    });

    return filteredCats;
  }, [searchQuery]);

  // Templates favoritos
  const favoriteTemplates = useMemo(() => {
    const allTemplates = Object.values(modernSidebarCategories).flatMap(cat => cat.templates);
    return allTemplates.filter(template => favorites.includes(template.type));
  }, [favorites]);

  return (
    <ErrorBoundary>
      <div className="w-80 h-full bg-black flex flex-col">
        {/* Header com logo */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-white text-2xl font-bold tracking-wider">SUNO</h1>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full"></div>
            <span className="text-gray-300 text-sm">wendleywilson</span>
          </div>
        </div>

        {/* Menu Principal */}
        <div className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveItem(item.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeItem === item.label
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-900/50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Componentes quando Create estiver ativo */}
          {activeItem === 'Create' && (
            <div className="mt-6 space-y-4">
              {/* Seção de Favoritos */}
              {favoriteTemplates.length > 0 && !searchQuery && (
                <CategorySection
                  title="FAVORITOS"
                  icon="⭐"
                  templates={favoriteTemplates}
                  onDragStart={handleDragStart}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  defaultExpanded={true}
                />
              )}

              {/* Categorias */}
              {Object.values(filteredCategories).map((category) => (
                <CategorySection
                  key={category.id}
                  title={category.title}
                  icon={category.icon}
                  templates={category.templates}
                  onDragStart={handleDragStart}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  defaultExpanded={searchQuery.length > 0}
                />
              ))}

              {/* Estado vazio */}
              {Object.keys(filteredCategories).length === 0 && searchQuery && (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-gray-400 text-sm">
                    Nenhum componente encontrado para "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 space-y-4">
          {/* Credits */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">50 Credits</p>
            <button className="w-full mt-2 bg-gray-800 text-white py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors">
              Upgrade to Pro
            </button>
          </div>

          {/* Bottom Menu */}
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors">
              <User className="w-4 h-4" />
              <span className="text-sm">Invite friends</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="text-sm">What's new?</span>
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">20</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors">
              <span className="text-sm">More from Suno</span>
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center gap-4 pt-4">
            <button className="text-gray-500 hover:text-gray-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>
            <button className="text-gray-500 hover:text-gray-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
            </button>
            <button className="text-gray-500 hover:text-gray-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </button>
            <button className="text-gray-500 hover:text-gray-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z"/>
              </svg>
            </button>
          </div>
        </div>

        <ReadyTemplatesModal
          isOpen={isReadyTemplatesOpen}
          onClose={() => setIsReadyTemplatesOpen(false)}
          onTemplateSelect={handleReadyTemplateSelect}
        />
      </div>
    </ErrorBoundary>
  );
};
